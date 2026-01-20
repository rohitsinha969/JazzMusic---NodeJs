# JazzMusic---NodeJs
A no-GUI YouTube music player for the terminal. Built with Node.js and mpv. Execute, don’t click.
# 🖥️ YT-MPV :: Terminal Audio Weapon 🎧

> *Stream YouTube. From the void. No ads. No UI. Just keys.*

---

```
 ███████╗████████╗      ███╗   ███╗██████╗ ██╗   ██╗
 ██╔════╝╚══██╔══╝      ████╗ ████║██╔══██╗██║   ██║
 █████╗     ██║         ██╔████╔██║██████╔╝██║   ██║
 ██╔══╝     ██║         ██║╚██╔╝██║██╔═══╝ ╚██╗ ██╔╝
 ███████╗   ██║         ██║ ╚═╝ ██║██║      ╚████╔╝
 ╚══════╝   ╚═╝         ╚═╝     ╚═╝╚═╝       ╚═══╝
```

> **A terminal-based YouTube music player built with Node.js + mpv IPC.**
> No GUI. No mercy. Just pure terminal dominance.

---

## ⚡ WHAT THIS DOES

* 🔥 Streams **any YouTube audio/video**
* 🧠 Accepts **links OR raw song names**
* 🕶 Runs silently in your terminal
* 🎮 Controlled with single keystrokes
* 🚫 Zero browser. Zero ads. Zero distraction.

---

## 🧩 REQUIREMENTS (DO NOT SKIP)

You need these weapons installed:

* **Node.js** (>=14)
* **mpv** (must be in `$PATH`)

### Install mpv

```bash
# macOS
brew install mpv

# Ubuntu / Debian
sudo apt install mpv

# Arch
sudo pacman -S mpv
```

Verify:

```bash
mpv --version
```

If this fails, stop. Fix it. Come back.

---

## ☠️ INSTALLATION

```bash
git clone <your-repo-url>
cd yt-mpv
npm install
```

---

## ▶️ EXECUTION

```bash
node script.js <youtube-link | song-name>
```

### Examples

```bash
node script.js "Hans Zimmer Time"
```

```bash
node script.js https://youtu.be/dQw4w9WgXcQ
```

---

## 🎛 CONTROL MATRIX

Type key → Press **Enter**

| Key | Action              |
| --- | ------------------- |
| `p` | Toggle Play / Pause |
| `+` | Increase Volume     |
| `-` | Decrease Volume     |
| `s` | Stop Stream         |
| `q` | Kill Process        |

---

## 🧠 UNDER THE HOOD

* **mpv** handles playback
* **IPC socket** for real-time control
* **Node.js** listens to stdin like a sniper
* Audio streamed directly (no downloads, no trace)

---

## 🧪 WARNINGS

* Internet required
* Terminal focus required
* Highly addictive workflow
* May cause:

  * Reduced browser usage
  * Increased productivity
  * Unnecessary superiority complex

---

## 📜 LICENSE

MIT
Do whatever you want. Just don’t be boring.

---

## 👤 OPERATOR

**Shot by Sagar**
YouTube → `@shotbysagar969`

> *“Real ones don’t click play. They execute.”*

---

### ☠️ READY. STREAM. DISAPPEAR.
