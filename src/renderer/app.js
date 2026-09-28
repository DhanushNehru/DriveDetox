const { ipcRenderer } = require('electron');

const statusBox = document.getElementById('status-box');
const scanBtn = document.getElementById('scan-btn');
const fileList = document.getElementById('file-list');
let currentScanPath = null;

// Listen for the magic USB detection event from the backend
ipcRenderer.on('usb-detected', (event, drivePath) => {
    statusBox.innerText = `USB Detected: ${drivePath}`;
    statusBox.style.background = "#17a2b8";
    currentScanPath = drivePath;
    scanBtn.innerText = `Click to Scan ${drivePath}`;
});

scanBtn.addEventListener('click', async () => {
    // If no USB is plugged in, let the user pick a folder
    if (!currentScanPath) {
        currentScanPath = await ipcRenderer.invoke('select-directory');
        if (!currentScanPath) return; // User canceled the dialog
    }

    // Update UI to show scanning
    statusBox.innerText = `Scanning: ${currentScanPath}\nCalculating cryptographic hashes...`;
    statusBox.style.background = "#555";
    fileList.innerHTML = ""; // Clear old results
    
    try {
        // Send command to backend to do the heavy lifting
        const duplicates = await ipcRenderer.invoke('scan-directory', currentScanPath);
        
        if (duplicates.length === 0) {
            statusBox.innerText = "Scan Complete: Drive is clean! No duplicates found.";
            statusBox.style.background = "#28a745";
        } else {
            statusBox.innerText = `Found ${duplicates.length} groups of duplicates!`;
            statusBox.style.background = "#dc3545";
            renderDuplicates(duplicates);
        }
    } catch (err) {
        statusBox.innerText = `Error: ${err.message}`;
        statusBox.style.background = "#dc3545";
    }
});

// Create HTML lists to show the user their duplicates
function renderDuplicates(duplicates) {
    duplicates.forEach((group, index) => {
        const li = document.createElement('li');
        const sizeMb = (group.size / 1024 / 1024).toFixed(2);
        
        li.innerHTML = `<strong style="color: #ffcc00">Group ${index + 1} (Size: ${sizeMb} MB)</strong><br>`;
        
        group.files.forEach(file => {
            li.innerHTML += `<span style="font-size: 13px; color: #ccc;">📄 ${file}</span><br>`;
        });
        
        fileList.appendChild(li);
    });
}
