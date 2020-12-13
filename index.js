const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadFile('index.html')
}
app.whenReady().then(createWindow);

let id;
let icon;
let name;
let desc;
let rpc;

ipcMain.on('x', function() {
    app.quit();
});

ipcMain.on('max', function () {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) return mainWindow.unmaximize();
    else return mainWindow.maximize();
});

ipcMain.on('min', function() {
    if (!mainWindow) return;
    mainWindow.minimize();
});

ipcMain.on('id:value', function(e, value) {
    id = value;
    rpc = require('discord-rich-presence')(id);
});

ipcMain.on('icon:value', function(e, value) {
    icon = value;
});

ipcMain.on('game:value', function(e, value) {
    name = value;
});

ipcMain.on('desc:value', function (e, value) {
   desc = value;
   changeRPCStatus();
});

let status = "online";
ipcMain.on("online", function() {
    status = "online";
    changeRPCStatus();
});
ipcMain.on("away", function() {
    status = "away";
    changeRPCStatus();
});

function changeRPCStatus() {
    if (!id || !icon || !name || !desc) return;
    rpc.updatePresence({
        state: desc,
        details: name,
        largeImageKey: icon,
        largeImageText: name,
        smallImageKey: status,
        smallImageText: status.charAt(0).toUpperCase() + status.slice(1)
    })
}