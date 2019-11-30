//ElectronのAPI使ってる
var electron = require('electron').remote
const { ipcRenderer } = require('electron')

document.getElementById('close_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.close()
})

document.getElementById('dev_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.webContents.openDevTools()
})


function openBrowser(json, instance) {
    require('electron').shell.openExternal(`https://${instance}/web/statuses/${json.id}`)
}

//デベロッパーツールのボタン非表示。trueで非表示
var showDevIcon = localStorage.getItem('setting_electron_dev')
if (JSON.parse(showDevIcon)) {
    document.getElementById('dev_button').style.display = 'none'
}

//タイトルバーにCPU使用率だす
var showTitlePCInfo = localStorage.getItem('setting_pc_info')
var isDarkmode = document.getElementById('darkmode_switch').checked
if (JSON.parse(showTitlePCInfo)) {
    //CPU/RAM
    var osu = require('node-os-utils')
    var cpu = osu.cpu
    var mem = osu.mem

    //Battery
    const batteryLevel = require('battery-level');

    var cpuIcon = document.createElement('i')
    cpuIcon.className = 'material-icons-outlined cleardrag blue-text icon-text'
    cpuIcon.id = 'cpu_useage'
    cpuIcon.innerHTML = 'memory'
    document.getElementById('bar').append(cpuIcon)
    //しようりつ
    var cpuSpan = document.createElement('span')
    if (isDarkmode) { cpuSpan.style.color = 'black' }
    document.getElementById('bar').append(cpuSpan)

    var ram = document.createElement('i')
    ram.className = 'material-icons-outlined cleardrag blue-text icon-text'
    ram.id = 'ram_useage'
    ram.innerHTML = 'data_usage'
    document.getElementById('bar').append(ram)
    var ramSpan = document.createElement('span')
    if (isDarkmode) { ramSpan.style.color = 'black' }
    document.getElementById('bar').append(ramSpan)

    var battery = document.createElement('i')
    battery.className = 'material-icons-outlined cleardrag blue-text icon-text'
    battery.id = 'battery_level'
    battery.innerHTML = 'battery_full'
    document.getElementById('bar').append(battery)
    var batterySpan = document.createElement('span')
    if (isDarkmode) { batterySpan.style.color = 'black' }
    document.getElementById('bar').append(batterySpan)

    setInterval(function () {
        cpu.usage()
            .then(cpuPercentage => {
                cpuSpan.innerHTML = 'CPU：' + cpuPercentage + '%'
            })
        mem.info()
            .then(memory => {
                ramSpan.innerHTML = 'RAM：' + memory.usedMemMb + 'GB'
            })
        batteryLevel().then(level => {
            if (!isNaN(level * 100)) {
                batterySpan.innerText = (level * 100) + "%"
            } else {
                //取れないときは非表示
                battery.style.display = 'none'
                batterySpan.style.display = 'none'
            }
        })
    }, 1000)


}