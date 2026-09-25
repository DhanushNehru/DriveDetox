const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { findDuplicates } = require('./scanner');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  createWindow();
  
  // Mac Auto-USB Detector
  // MacOS mounts all external drives in the /Volumes folder automatically
  if (process.platform === 'darwin') {
      fs.watch('/Volumes', (eventType, filename) => {
          if (eventType === 'rename' && filename && mainWindow) {
              // Wait 1 second for the OS to finish mounting the drive
              setTimeout(() => {
                  const drivePath = `/Volumes/${filename}`;
                  if (fs.existsSync(drivePath)) {
                      mainWindow.webContents.send('usb-detected', drivePath);
                  }
              }, 1000);
          }
      });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// IPC Endpoint: User clicks "Select Folder" manually
ipcMain.handle('select-directory', async () => {
   const result = await dialog.showOpenDialog(mainWindow, {
       properties: ['openDirectory']
   });
   if (!result.canceled) {
       return result.filePaths[0];
   }
   return null;
});

// IPC Endpoint: Frontend asks to scan a directory
ipcMain.handle('scan-directory', async (event, dirPath) => {
    return await findDuplicates(dirPath);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
