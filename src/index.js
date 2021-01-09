// Modules to control application life and create native browser window
const parser = require('ini-parser')
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const path = require("path");
const fs = require("fs");
const translation = parser.parseFileSync(path.join(__dirname, '../translated.ini'))
const template = require('../template.json')

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: '#2e2c29',
    darkTheme: true,
    icon: './tinyFoxes.ico',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "tinyScrapper.js"),
      enableRemoteModule: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../pageFiles/themes/moondance/assets/default.html"))
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

ipcMain.on("toMain", (event, args) => {
  if (args.length === 2) {
    if (args[0] === 'writeFile') {
      fs.writeFileSync(args[1][0], args[1][1])
    }

    if (args[0] === 'mkdir') {
      fs.mkdir(args[1], { recursive: true }, err => {
        if (err) console.log(err)
      })
    }

    if (args[0] === 'rename') {
      fs.rename(args[1][0], args[1][1], (err) => {
        if (err) console.log(err)
      })
    }
    return
  }
  if (args === 'translationUpdate') {
    mainWindow.webContents.send('fromMain', ['translationUpdate', parser.parseFileSync(path.join(__dirname, '../translated.ini'))])
    return
  }

  mainWindow.webContents.send('fromMain', ['translation', translation])
  mainWindow.webContents.send('fromMain', ['template', template])
  mainWindow.webContents.send('fromMain', ['pathGeneratedFiles', path.join(__dirname, '../generatedFiles')])
  const jumbatron = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/jumbatron.html'), 'utf-8')
  const home = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/home.html'), 'utf-8')
  const about = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/about.html'), 'utf-8')
  const downloads = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/downloads.html'), 'utf-8')
  const faq = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/faq.html'), 'utf-8')
  const controllers = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/controllers.html'), 'utf-8')
  const noteskins = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/noteskins.html'), 'utf-8')
  const tools = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/tools.html'), 'utf-8')
  const historicalChangelog = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/historical-changelog.html'), 'utf-8')
  const communityPolicies = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/community-policies.html'), 'utf-8')

  mainWindow.webContents.send('fromMain', ['jumbatron', jumbatron])
  const files = [home, about, downloads, faq, controllers, noteskins, tools, historicalChangelog, communityPolicies]

  mainWindow.webContents.send("fromMain", files);
})

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
