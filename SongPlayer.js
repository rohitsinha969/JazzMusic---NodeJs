/*
 Simple YouTube terminal player using mpv + IPC.
 Usage:
   node script.js <youtube-link or song name>

 Controls (then press Enter):
   p   = play/pause
   +   = volume up
   -   = volume down
   s   = stop
   q   = quit

 Requirements:
   - Node.js
   - mpv installed and available in PATH
*/

const { spawn, execSync } = require("child_process");
const net = require("net");
const readline = require("readline");
const { existsSync, unlinkSync } = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");

// -------------------------------------------
// MERGE CLI ARGUMENTS CORRECTLY
// -------------------------------------------
const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.error("Usage: node script.js <youtube-link or song name>");
  process.exit(1);
}
let input = argv.join(" ").trim();

// -------------------------------------------
// DETECT YOUTUBE URL
// -------------------------------------------
function isYouTubeURL(str) {
  return /(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\b/i.test(str);
}

// -------------------------------------------
// NO-API YOUTUBE SEARCH (IMPROVED)
// -------------------------------------------
function searchYouTube(query) {
  const url =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(query);

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          // Main pattern
          let match = data.match(/"videoId":"(.*?)"/);

          // Fallback pattern
          if (!match) match = data.match(/videoIds":\["(.*?)"\]/);

          if (match && match[1]) {
            resolve("https://www.youtube.com/watch?v=" + match[1]);
          } else {
            reject("No results found");
          }
        });
      })
      .on("error", reject);
  });
}

async function resolveLink(input) {
  if (isYouTubeURL(input)) return input;

  console.log("Searching YouTube for:", input);

  try {
    const result = await searchYouTube(input);
    console.log("Found:", result);
    return result;
  } catch (err) {
    console.error("Search failed:", err);
    process.exit(1);
  }
}

// -------------------------------------------
// TERMINAL INPUT
// -------------------------------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function listenKeys(handler) {
  rl.on("line", (key) => handler(key.trim()));
}

// -------------------------------------------
// WAIT FOR MPV SOCKET
// -------------------------------------------
function waitForSocket(socketPath, timeout = 6000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      if (existsSync(socketPath)) return resolve();
      if (Date.now() - start > timeout)
        return reject(new Error("mpv IPC socket timeout"));
      setTimeout(check, 50);
    })();
  });
}

// -------------------------------------------
// FORCE CLOSE OLD MPV
// -------------------------------------------
try {
  execSync("killall mpv", { stdio: "ignore" });
} catch (_) {}

// -------------------------------------------
// PLAYER
// -------------------------------------------
async function playYouTube(link) {
  const socketPath = path.join(os.tmpdir(), `mpv-${process.pid}.sock`);

  if (existsSync(socketPath)) unlinkSync(socketPath);

  const mpvArgs = [
    "--no-terminal",
    `--input-ipc-server=${socketPath}`,
    "--quiet",
    link,
  ];

  const mpv = spawn("mpv", mpvArgs, { stdio: "ignore" });

  mpv.on("error", () => {
    console.error("Could not start mpv. Install it using: brew install mpv");
    process.exit(1);
  });

  mpv.on("exit", () => {
    console.log("Player closed.");
    process.exit(0);
  });

  await waitForSocket(socketPath);

  const client = net.createConnection({ path: socketPath }, () => {
    console.log("Playing:", link);
  });

  let reqId = 1;

  function send(commandArr) {
    const msg =
      JSON.stringify({ command: commandArr, request_id: reqId++ }) + "\n";
    client.write(msg);
  }

  function getVolume() {
    return new Promise((resolve) => {
      const id = reqId;
      const handler = (chunk) => {
        try {
          const obj = JSON.parse(chunk.toString());
          if (obj.request_id === id && obj.error === "success") {
            client.removeListener("data", handler);
            resolve(obj.data);
          }
        } catch (_) {}
      };
      client.on("data", handler);

      send(["get_property", "volume"]);

      setTimeout(() => {
        client.removeListener("data", handler);
        resolve(null);
      }, 300);
    });
  }

  client.on("data", () => {}); // Silence mpv

  // -------------------------------------------
  // KEY HANDLER
  // -------------------------------------------
  listenKeys(async (k) => {
    if (k === "p") {
      send(["cycle", "pause"]);
      console.log("Play/Pause");
    } else if (k === "+") {
      let v = (await getVolume()) || 50;
      v = Math.min(150, v + 5);
      send(["set_property", "volume", v]);
      console.log("Volume:", v);
    } else if (k === "-") {
      let v = (await getVolume()) || 50;
      v = Math.max(0, v - 5);
      send(["set_property", "volume", v]);
      console.log("Volume:", v);
    } else if (k === "s") {
      send(["stop"]);
      console.log("Stopped");
    } else if (k === "q") {
      console.log("Quit.");
      client.end();
      mpv.kill();
      process.exit(0);
    } else {
      console.log("Unknown key. Use p / + / - / s / q");
    }
  });
}

// -------------------------------------------
// MAIN
// -------------------------------------------
(async () => {
  const link = await resolveLink(input);
  await playYouTube(link);
})();
