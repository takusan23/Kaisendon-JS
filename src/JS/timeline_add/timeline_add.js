//JSおんりー

//追加するタイムラインの名前の配列。
var nameList = []
var timelineList = []

//追加したタイムラインを読み込む  
window.onload = function () {

    loadTimelines()

    setDragItem()

}

//ボタン生成
function loadTimelines() {
    document.getElementById('timeline_button_list').innerHTML = ''
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var timelineList = JSON.parse(json)
        for (let index = 0; index < timelineList.length; index++) {
            const json = timelineList[index];
            if (json.load != null) {
                //HTML追加
                var timelineItem = document.createElement('a')
                timelineItem.className = 'waves-effect btn-flat menubutton white-text'
                //クリック
                timelineItem.setAttribute('onclick', `loadTimeline(${JSON.stringify(json)},${index})`)   //timeline.jsへ
                //中のアイコン
                var icon = document.createElement('i')
                icon.className = 'material-icons-outlined left'
                icon.innerHTML = getIcon(json.load)
                //ボタンにアイコンとタイトル入れる
                timelineItem.append(icon)
                timelineItem.innerHTML += json.name
                timelineItem.setAttribute('name', json.name)
                //ボタン追加
                document.getElementById('timeline_button_list').append(timelineItem)
            }
        }
    }
}


function getIcon(load) {
    var icon = ""
    switch (load) {
        case 'home':
            icon = 'home'
            break
        case 'notification':
            icon = 'notifications'
            break
        case 'local':
            icon = 'train'
            break
        case 'public':
            icon = 'flight'
            break
    }
    return icon
}


//追加ボタン
document.getElementById('add').onclick = () => {

    //TL名前
    var name = document.getElementById('name').value
    //アカウントのいち。LocalStorageと同じ位置。
    var accountPos = document.getElementById('account_select').selectedIndex
    //インスタンス名、アクセストークン取得
    var instance = getInstance(accountPos)
    var token = getToken(accountPos)
    //読み込むTL
    var load = document.getElementById('load').value
    //オプション
    var streaming = document.getElementById('streaming').checked
    var img = document.getElementById('img').checked
    var gif = document.getElementById('gif').checked

    //オブジェクトへ
    var item = {
        'name': name,
        'instance': instance,
        'token': token,
        'load': load,
        'streaming': streaming,
        'img': img,
        'gif': gif
    }


    //LocalStorageから読み込む
    getTimelineList()
    //すでにある？名前から
    var pos = nameList.indexOf(name)
    if (pos == -1) {
        //新規作成
        //配列に追加
        timelineList.push(item)
        //Toast
        M.toast({ html: `作成しました` })
    } else {
        //上書き
        timelineList[pos] = item
        //Toast
        M.toast({ html: `編集しました` })
    }

    //LocalStorageに保存
    var json = JSON.stringify(timelineList)
    localStorage.setItem('timelines', json)


    //できたら編集画面非表示に
    var panel = document.getElementById('editpanel')
    panel.style.display = 'none'

    //メニュー作り直し
    loadTimelines()
}

//削除ボタン
//新規作成のときはふさがってる。
function timelineDelete(name) {
    //LocalStorageから読み込む
    getTimelineList()
    //すでにある？名前から
    var pos = nameList.indexOf(name)
    timelineList.splice(pos, 1)
    //LocalStorageに保存
    var json = JSON.stringify(timelineList)
    localStorage.setItem('timelines', json)
    //Toast
    M.toast({ html: `削除しました` })
    //できたら編集画面非表示に
    var panel = document.getElementById('editpanel')
    panel.style.display = 'none'
    //メニュー作り直し
    loadTimelines()
}

function loadAccount() {
    document.getElementById('account_select').innerHTML = ''
    if (localStorage.getItem('accounts') != null) {
        var accounts = JSON.parse(localStorage.getItem('accounts'))
        for (let index = 0; index < accounts.length; index++) {
            const account = accounts[index];
            //追加
            var element = document.createElement('option')
            element.value = index
            element.innerHTML = account.instance + ' / ' + account.name
            document.getElementById('account_select').append(element)
        }
    }
}

function getTimelineList() {
    timelineList = []
    nameList = []
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var list = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            nameList.push(item.name)
            timelineList.push(item)
        }
    }
}

function getInstance(pos) {
    var accounts = localStorage.getItem('accounts')
    if (accounts != null) {
        accounts = JSON.parse(accounts)
        const obj = accounts[pos];
        return obj.instance
    }
}

function getToken(pos) {
    var accounts = localStorage.getItem('accounts')
    if (accounts != null) {
        accounts = JSON.parse(accounts)
        const obj = accounts[pos];
        return obj.token
    }
}

//編集/新規作成画面展開
function editPanel() {
    var editPanel = document.getElementById('editpanel')
    if (editPanel.style.display == 'block') {
        editPanel.style.display = 'none';
    } else {
        editPanel.style.display = 'block';
    }
}

//編集画面閉じる
function closeEditPanel() {
    var editPanel = document.getElementById('editpanel')
    editPanel.style.display = 'none';
}

//編集画面初期化
function createTimeline() {
    //編集画面開く
    editPanel()
    //読み込み
    document.getElementById('edit_title').innerText = '新規作成'
    document.getElementById('name').value = ''
    document.getElementById('load').value = ''
    //アカウント一覧読み込み
    loadAccount()
    //オプション
    document.getElementById('streaming').checked = false
    document.getElementById('gif').checked = false
    document.getElementById('img').checked = false
    //削除ボタン非表示
    document.getElementById('delete').style.display = 'none'
    document.getElementById('add').innerHTML = '<i class="material-icons left">add</i>タイムライン追加</a>'
}

//編集画面に値を入れる
function setEditPanel(json) {
    //削除ボタンを表示する
    document.getElementById('delete').style.display = 'block'
    document.getElementById('edit_title').innerText = '編集画面'
    document.getElementById('name').value = json.name
    document.getElementById('load').value = json.load
    //アカウント一覧読み込み
    setAccount(json)
    //オプション
    document.getElementById('streaming').checked = json.streaming
    document.getElementById('gif').checked = json.gif
    document.getElementById('img').checked = json.img
    document.getElementById('add').innerHTML = '<i class="material-icons left">save</i>変更を適用</a>'
    document.getElementById('delete').onclick = function () {
        timelineDelete(json.name)
    }
}


function setAccount(json) {
    document.getElementById('account_select').innerHTML = ''
    if (localStorage.getItem('accounts') != null) {
        var accounts = JSON.parse(localStorage.getItem('accounts'))
        for (let index = 0; index < accounts.length; index++) {
            const account = accounts[index];
            //追加
            var element = document.createElement('option')
            element.value = index
            element.innerHTML = account.instance + ' / ' + account.name
            document.getElementById('account_select').append(element)

            if (json.token == account.token) {
                document.getElementById('account_select').selectedIndex = index
            }
        }
    }
}

function setDragItem() {
    getTimelineList()
    //ドラッグ実装
    var menuListDiv = document.getElementById('timeline_button_list')
    var sort = Sortable.create(menuListDiv, {
        group: "menu",
        animation: 100,
        onEnd: function (evt) {
            var element = evt.item
            //移動前を探す
            var oldPath = nameList.indexOf(element.getAttribute('name'))
            //移動先を探す
            var newMenuList = menuListDiv.childNodes
            var newPath = 0
            for (let index = 0; index < newMenuList.length; index++) {
                const menu = newMenuList[index];
                if (menu.getAttribute('name') == element.getAttribute('name')) {
                    newPath = index
                }
            }
            //JSONを持ってくる
            var timelineJSON = timelineList[oldPath]
            //けす
            timelineList.splice(oldPath, 1)
            //いれる
            timelineList.splice(newPath, 0, timelineJSON)
            //保存
            //LocalStorageに保存
            var json = JSON.stringify(timelineList)
            localStorage.setItem('timelines', json)
            //メニュー作り直し
            loadTimelines()
            //ほけん
            getTimelineList()
        }
    })
}