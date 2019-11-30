//ブラウザーのJS
//これはElectronのAPI使ってない。
window.onload = function () {
    document.getElementById('close_button').style.display = 'none'
    document.getElementById('dev_button').style.display = 'none'
}


function openBrowser(json, instance) {
    window.open(`https://${instance}/web/statuses/${json.id}`)
}
