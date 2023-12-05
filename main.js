// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, webContents} = require('electron')
const path = require('node:path')
const fs = require("fs");
const axios = require("axios");

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    const secondWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    secondWindow.loadFile('index.html')

    // Open the DevTools.
    secondWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    const jsonFile = fs.readFileSync('./users.json', 'utf8')
    let users = JSON.parse(jsonFile)

    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    ipcMain.on('getUsers', (e) => {
        e.reply('users', users);
    });

    ipcMain.on('addUser', (e, user) => {
        users.push(user)

        e.reply('users', users);
    });

    ipcMain.on('save', (e) => {
        fs.writeFileSync('./users.json', JSON.stringify(users))

        e.reply('users', users);
    });

    ipcMain.on('sync', (e) => {
        const contents = webContents.getAllWebContents();
        for (const c of contents) c.send('users', users);
    });

    ipcMain.on('crbt:getTime', async (e) => {
        const result = await axios({
            method: 'get',
            url: 'https://dev-crbt-api.lvup.gg/time'
        }).then(function (response) {
            return response.data.body.timestamp
        });

        e.reply('crbt', result);
    });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

