# 🚀 DriveDetox

**DriveDetox** is an open-source, lightning-fast desktop utility designed to find duplicate files on your computer and external USB drives. 

Built with Electron and Node.js, DriveDetox uses a smart, highly optimized algorithm (comparing exact byte-sizes first, then calculating cryptographic SHA-256 hashes) to guarantee that only 100% exact duplicate files are flagged, saving you gigabytes of storage space.

## ✨ Features
* **Auto-USB Detection (macOS):** Instantly detects when an external drive is inserted into your Mac and prompts you to scan it.
* **Smart File Hashing:** Uses Node's `crypto` module to find true duplicates, ignoring file names and exclusively analyzing the actual file data.
* **Lightning Fast:** Optimizes scans by only calculating expensive cryptographic hashes for files that share the exact same byte size.
* **Sleek UI:** A lightweight, dark-mode dashboard built with standard HTML/CSS.

## 🛠️ Installation & Setup

To run DriveDetox locally on your machine, you will need to have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/DhanushNehru/DriveDetox.git
cd DriveDetox
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch the app
```bash
npm start
```

## 📖 How to Use

1. **Open the App:** Run `npm start` in your terminal.
2. **Connect a Drive:** Plug in a USB flash drive (on macOS, the app will automatically detect it!). Alternatively, click "Select Folder & Scan" to pick any folder on your computer.
3. **Scan:** Let the app process your files. It recursively reads directories while ignoring hidden system folders.
4. **Review:** The app will output a list of exact duplicates, grouped together, showing you exactly how much space is being wasted by clones.

## 🚀 Roadmap (Upcoming Features)
* **One-Click Clean:** A button to automatically safely delete the detected duplicates, keeping only the original file.
* **Cross-Platform Auto-Detect:** Expanding the automatic USB detection beyond macOS to fully support Windows and Linux.
* **Phone Support (MTP):** Support for scanning connected Android and iOS devices.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! If you want to improve the UI or add new duplicate-finding algorithms, feel free to fork the repository and submit a pull request.

## 📝 License
This project is open-source and free to use.
