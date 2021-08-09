// Modules to control application life and create native browser window
const parser = require('ini-parser')
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const path = require("path");
const fs = require("fs");
fs.truncate(path.join(__dirname, '../logs/info.txt'), 0, ()=>{})
const callerId = require('caller-id')
const logger = require('simple-node-logger').createSimpleFileLogger({ logFilePath: path.join(__dirname, '../logs/info.txt') })
const translation = parser.parseFileSync(path.join(__dirname, '../translated.ini'))
const template = require('../template.json')
const notifier = require('node-notifier')

let mainWindow;

/**
 * Returns the name of the file from the file path.
 * @param {String} path - The file Path
 * @returns {String} - name of the file from the file path.
 */
function fileName (path) {
  let pathSplit = path.split('\\')
  if (pathSplit[0] === path) {
    pathSplit = path.split('/')
  }

  return pathSplit[pathSplit.length - 1].replace(/.js/gi, '')
}

/**
 * Executes log.info
 * @param {String} msg - The message to info.
 */
const info = (msg) => {
  const Data = callerId.getData()
  logger.info(`[${fileName(Data.filePath)}] at line ${Data.lineNumber} - ${msg}`)
}

/**
 * Executes log.warn
 * @param {String} msg - The message to warn.
 */
const warn = (msg) => {
  const Data = callerId.getData()
  logger.warn(`[${fileName(Data.filePath)}] at line ${Data.lineNumber} - ${msg}`)
}

function createWindow () {
  // Create the browser window.

  info('Creating window')
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
  info('Loading default html')
  // "../pageFiles/themes/moondance/assets/default.html" Project Moondance
  mainWindow.loadFile(path.join(__dirname, "../pageFiles/themes/moondance/assets/default.html"))
  mainWindow.once('ready-to-show', () => {
    info('Showing window')
    mainWindow.show()
  })
}

ipcMain.on("toMain", (event, args) => {
  if (args.length === 2) {
    info('Recieved a call to Main')
    if (args[0] === 'writeFile') {
      info(`Writing a file, arguments: \n\n ${[args[1][0], args[1][1]].join(', ')}\n\n`)
      fs.writeFileSync(args[1][0], args[1][1])
    }

    if (args[0] === 'mkdir') {
      info(`Writing a directory to ${args[1]}`)
      fs.mkdir(args[1], { recursive: true }, err => {
        if (err) warn(`Error while writing a directory, error: \n\n${err}\n\n`)
      })
    }

    if (args[0] === 'rename') {
      info(`Renaming (or moving) ${args[1][0]} to ${args[1][1]}`)
      fs.rename(args[1][0], args[1][1], (err) => {
        if (err) warn(`Error while writing a renaming, error: \n\n${err}\n\n`)
      })
    }

    if (args[0] === 'logInfo') {
      info(args[1])
    }

    if (args[0] === 'logwarn') {
      warn(args[1])
    }

    if (args[0] === 'notification') {
      if (typeof args[1] === 'string') {
        notifier.notify({
          title: "Tiny-Webini",
          message: args[1],
          icon: './tinyFoxes.png'
        })
        return
      }

      notifier.notify(args[1])
    }
    return
  }

  if (args === 'translationUpdate') {
    info('An translation update was requested, updating translation.')
    mainWindow.webContents.send('fromMain', ['translationUpdate', parser.parseFileSync(path.join(__dirname, '../translated.ini'))])
    return
  }

  info('Sending files, template, translation to isolated window.')
  mainWindow.webContents.send('fromMain', ['translation', translation])
  mainWindow.webContents.send('fromMain', ['template', template])
  mainWindow.webContents.send('fromMain', ['pathGeneratedFiles', path.join(__dirname, '../generatedFiles')])
  const jumbatron = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/jumbatron.html'), 'utf-8')
  const home = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/home.html'), 'utf-8')
  const about = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/about.html'), 'utf-8')
  const downloads = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/downloads.html'), 'utf-8')
  const controllers = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/controllers.html'), 'utf-8')
  const noteskins = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/noteskins.html'), 'utf-8')
  const tools = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/tools.html'), 'utf-8')
  const historicalChangelog = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/historical-changelog.html'), 'utf-8')
  const communityPolicies = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/community-policies.html'), 'utf-8')
  const moveFreely = fs.readFileSync(path.join(__dirname, '../pageFiles/themes/moondance/assets/move-freely.html'), 'utf-8')

  mainWindow.webContents.send('fromMain', ['jumbatron', jumbatron])
  const files = [home, about, downloads, controllers, noteskins, tools, historicalChangelog, communityPolicies, moveFreely]

  mainWindow.webContents.send("fromMain", files);
})

app.whenReady().then(() => {
  info('App is ready, creating window')
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/*
We don't support mac at the moment.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
*/
