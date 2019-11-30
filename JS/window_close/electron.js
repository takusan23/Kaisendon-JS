//ElectronのAPI使ってる
var electron = require('electron').remote

document.getElementById('close_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.close()
})

document.getElementById('dev_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.webContents.openDevTools()
})