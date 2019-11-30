
//一覧読み込み
loadSettingAccount()
//Electron設定読み込み
loadElectronSetting()

//設定表示
document.getElementById('settings').onclick = () => {
    var settingPanel = document.getElementById('settingpanel')
    if (settingPanel.style.display == 'none') {
        settingPanel.style.display = 'block'
    } else {
        settingPanel.style.display = 'none'
    }
}

document.getElementById('timeline_setting_save').onclick = () => {
    var width = document.getElementById('column_width').value
    localStorage.setItem('column_width', width)
}

function closeSettingPanel() {
    var settingPanel = document.getElementById('settingpanel')
    settingPanel.style.display = 'none'
}


//設定項目切り替え
function setSetting(content) {
    var add = document.getElementById('setting_add_account_div')
    var list = document.getElementById('setting_account_list_div')
    var electron = document.getElementById('setting_electron_div')
    var timeline = document.getElementById('setting_timeline_div')
    var thisApp = document.getElementById('setting_this_app_div')

    add.style.display = 'none'
    list.style.display = 'none'
    electron.style.display = 'none'
    timeline.style.display = 'none'
    thisApp.style.display = 'none'

    switch (content) {
        case "add":
            add.style.display = 'block'
            break;
        case "list":
            list.style.display = 'block'
            break;
        case "electron":
            electron.style.display = 'block'
            break;
        case "timeline":
            timeline.style.display = 'block'
            break;
        case "this_app":
            thisApp.style.display = 'block'
            break;
    }
}

//アカウント
document.getElementById('login_button').onclick = function () {
    //保存
    var instance = document.getElementById('instance').value
    var token = document.getElementById('token').value

    //API叩いて確認
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://${instance}/api/v1/accounts/verify_credentials?access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            var json = JSON.parse(xmlHttp.responseText)
            var display_name = json.display_name

            //配列にする
            var accountList = getArrayFromJSONArrayLocalStorage('accounts')

            //JSONにしてLocalStorageに入れる
            var accountObject = {
                'instance': instance,
                'token': token,
                'name': display_name
            }

            accountList.push(accountObject)

            //保存
            var jsonObject = JSON.stringify(accountList)
            localStorage.setItem('accounts', jsonObject)

            M.toast({ html: `保存しました。<br>${display_name}` })

            loadSettingAccount()
        }
    }
    xmlHttp.send();
}

function getArrayFromJSONArrayLocalStorage(name) {
    var list = []
    //存在するか
    if (localStorage.getItem(name) != null) {
        var data = localStorage.getItem(name)
        data = JSON.parse(data)
        for (let index = 0; index < data.length; index++) {
            list.push(data[index])
        }
    }
    return list
}

//アカウント一覧を読み込む
function loadSettingAccount() {
    document.getElementById('setting_account_list').innerHTML = ''
    if (localStorage.getItem('accounts') != null) {
        var accounts = JSON.parse(localStorage.getItem('accounts'))
        for (let index = 0; index < accounts.length; index++) {
            const account = accounts[index];
            //追加
            var element = document.createElement('li')
            element.className = 'collection-item'
            //中に入れるやつ
            var div = document.createElement('div')
            var a = document.createElement('a')
            a.className = 'secondary-content'
            div.style.cursor = 'pointer'
            var i = document.createElement('i')
            i.className = 'material-icons red-text'
            i.innerHTML = 'delete'
            a.append(i)
            div.innerHTML = `${account.name} / ${account.instance}`
            div.append(a)
            element.append(div)
            document.getElementById('setting_account_list').append(element)

            //クリックイベント
            div.onclick = function () {
                //削除を行う
                deleteAccount(index)
            }
        }
    }
}

function deleteAccount(index) {
    //配列にする
    var accountList = getArrayFromJSONArrayLocalStorage('accounts')
    accountList.splice(index, 1)
    //保存
    var jsonObject = JSON.stringify(accountList)
    localStorage.setItem('accounts', jsonObject)
    M.toast({ html: `削除しました` })
    //再生成
    loadSettingAccount()
}

function loadElectronSetting() {

    //Electron設定のDivからチェックボックスを全部探して入れる
    var electronSettingDiv = document.getElementById('setting_electron_div')
    var inputList = electronSettingDiv.getElementsByTagName('input')
    for (let index = 0; index < inputList.length; index++) {
        const element = inputList[index];
        if (element.type == 'checkbox') {
            loadSetting(element.id)
        } else if (element.type == 'text') {
            loadTextSetting(element.id)
        }
    }

    var timelineSettingDiv = document.getElementById('setting_timeline_div')
    var inputList = timelineSettingDiv.getElementsByTagName('input')
    for (let index = 0; index < inputList.length; index++) {
        const element = inputList[index];
        if (element.type == 'checkbox') {
            loadSetting(element.id)
        } else if (element.type == 'text') {
            loadTextSetting(element.id)
        }
    }


}

//localStorageから値を持ってきてCheckboxへ
function loadSetting(name) {
    var checkbox = localStorage.getItem(name)
    if (checkbox != null) {
        document.getElementById(name).checked = checkbox.match('true') ? 'checked' : ''
    }
}
function loadTextSetting(name) {
    var value = localStorage.getItem(name)
    if (value != null) {
        document.getElementById(name).value = value
    }
}

//名前はidとlocalStorageに使われる
function saveSetting(name) {
    var checkbox = document.getElementById(name).checked
    localStorage.setItem(name, checkbox)
}