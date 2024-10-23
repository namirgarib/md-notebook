const { app, BrowserWindow, Menu, dialog } = require("electron");
const fs = require('fs');
const path = require("path");

let mainWindow;
const isMac = process.platform === 'darwin'

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
    

    const template = [
    ...(isMac
        ? [{
            label: app.name,
            submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
            ]
        }]
        : []),
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                click: () => {
                dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [
                        { name: 'Markdown', extensions: ['md', 'markdown'] },
                    ]
                }).then(result => {
                    if (!result.canceled) {
                    const filePath = result.filePaths[0];
                    fs.readFile(filePath, 'utf-8', (err, data) => {
                        if (err) {
                        console.error('Error reading file:', err);
                        return;
                        }
                        mainWindow.webContents.send('file-opened', data);
                    });
                    }
                }).catch(err => {
                    console.error('Error selecting file:', err);
                });
                }
            },
            {
                label: 'Save File',
                click: () => {
                dialog.showSaveDialog({
                    title: 'Save File',
                    filters: [
                        { name: 'Markdown', extensions: ['md', 'markdown'] },
                    ]
                }).then(result => {
                    if (!result.canceled) {
                    const filePath = result.filePath;
                    if (filePath) {
                        mainWindow.webContents.send('request-file-save', filePath);
                    }
                    }
                }).catch(err => {
                    console.error('Error saving file:', err);
                });
                }
            },
            { type: 'separator' },
            {
                label: 'Exit',
                role: 'quit'
            },
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
            ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                label: 'Speech',
                submenu: [
                    { role: 'startSpeaking' },
                    { role: 'stopSpeaking' }
                ]
                }
            ]
            : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    {
        label: 'View',
        submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
            ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ]
            : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
        {
            label: 'Learn More',
            click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/namirgarib/md-notebook/blob/main/README.md')
            }
        }
        ]
    }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (!isMac) {app.quit();}
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {createWindow();}
});