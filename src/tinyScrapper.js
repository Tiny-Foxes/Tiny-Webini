const {
    contextBridge,
    ipcRenderer
} = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
console.log('Hello there.')
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            // console.log('I should be running')
            let validChannels = ["fromMain"]
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)

    /* What to expect:
    "Home" - Home Page
    "About Project Moondance" - About Page
    "Articles" - News All
    "News Category" - News Announcements, News Community, News Dev Notes, News Releases, News Showcases, News Uncategorized
    "FAQ" - FAQ
    "Controller Guide" - Controllers
    "Noteskins" - Noteskins
    "Tools" - Tools
    "Historical changelog" - Historical Changelog
    "Community policies" - Community policies
    */  
