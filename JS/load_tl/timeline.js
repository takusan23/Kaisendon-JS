var token = ""
var instance = ""
var api = ""
var gif = ""
var streaming = ""
var img = ""

var webSocket

function loadTimeline(json, index) {

    token = json.token
    instance = json.instance
    api = json.load
    streaming = json.streaming
    img = json.img
    gif = json.gif

    //編集画面
    setEditPanel(json)

    document.getElementById('timeline_edit').style.display = 'block'

    if (webSocket != null) {
        webSocket.close()
    }

    //TLのdiv
    var timelineDiv = document.getElementById('timeline')

    //TLくるくる
    timelineDiv.innerHTML = ''
    var div = document.createElement('div')
    div.className = 'progress'
    div.style.width = '50%'
    div.style.margin = '0 auto'
    var progress = document.createElement('div')
    progress.className = 'indeterminate'
    div.append(progress)
    timelineDiv.append(div)

    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://${instance}${getURL(api)}&access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            timelineDiv.innerHTML = ''
            //中に入れるやつ
            var data = JSON.parse(this.responseText)
            for (let index = 0; index < data.length; index++) {

                const item = data[index];
                timelineDiv.append(timelineCard(item, json))

            }
        } else {
            M.toast({ html: `取得に失敗しました ${xmlHttp.status}` })
        }
    }
    xmlHttp.send();


    //ストリーミングAPI
    if (!streaming) {
        console.log(`wss://${instance}${getWebSocektURL(api)}&access_token=${token}`)
        webSocket = new WebSocket(`wss://${instance}${getWebSocektURL(api)}&access_token=${token}`);

        // 接続を開く
        webSocket.addEventListener('open', function (event) {
            M.toast({ html: `リアルタイム更新を始めます` })
        });

        // メッセージを待ち受ける
        webSocket.addEventListener('message', function (event) {
            var toot = JSON.parse(event.data)
            if (toot.payload != null) {
                var item = JSON.parse(toot.payload)
                timelineDiv.prepend(timelineCard(item, json))
            }
        });
    }

    //自分のでーた
    getMyAccount(json)

}

function loadMultiColumnTimeline(json, name) {

    var token = json.token
    var instance = json.instance
    var api = json.load
    var streaming = json.streaming
    var img = json.img
    var gif = json.gif

    if (webSocket != null) {
        //webSocket.close()
    }

    //TLのdiv
    var timelineDiv = document.getElementById(name)

    //TLくるくる
    timelineDiv.innerHTML = ''
    var div = document.createElement('div')
    div.className = 'progress'
    div.style.width = '50%'
    div.style.margin = '0 auto'
    var progress = document.createElement('div')
    progress.className = 'indeterminate'
    div.append(progress)
    timelineDiv.append(div)

    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://${instance}${getURL(api)}&access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            timelineDiv.innerHTML = ''
            //中に入れるやつ
            var data = JSON.parse(this.responseText)
            for (let index = 0; index < data.length; index++) {

                const item = data[index];
                timelineDiv.append(timelineCard(item, json))

            }
        } else {
            M.toast({ html: `取得に失敗しました ${xmlHttp.status}` })
        }
    }
    xmlHttp.send();

    //ストリーミングAPI
    if (!streaming) {
        var webSocket = new WebSocket(`wss://${instance}${getWebSocektURL(api)}&access_token=${token}`);

        // 接続を開く
        webSocket.addEventListener('open', function (event) {
            M.toast({ html: `リアルタイム更新を始めます` })
        });

        // メッセージを待ち受ける
        webSocket.addEventListener('message', function (event) {
            var toot = JSON.parse(event.data)
            if (toot.payload != null) {
                var item = JSON.parse(toot.payload)
                timelineDiv.prepend(timelineCard(item, json))
            }
        });

    }

    //自分のでーた
    getMyAccount(json)

}



function getMyAccount(json) {
    //マルチカラム時は利用しない
    var isMultiColumn = document.getElementById('multi_column').checked
    if (!isMultiColumn) {
        //API叩く
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", `https://${json.instance}/api/v1/accounts/verify_credentials?access_token=${json.token}`);
        xmlHttp.onload = function () {
            if (this.status == 200) {
                //中に入れるやつ
                var data = JSON.parse(this.responseText)

                document.getElementById('header_name').innerHTML = `
                ${data.display_name}<br>
                @${data.acct}<br>
                @${json.instance}<br>
            `
                if (!img) {
                    if (gif) {
                        document.getElementById('header_avatar').src = data.avatar_static
                    } else {
                        document.getElementById('header_avatar').src = data.avatar
                    }
                } else {
                    document.getElementById('header_name').style.marginLeft = '0'
                }
            }
        }
        xmlHttp.send();
    }
}

function getWebSocektURL(link) {
    var url = ""
    switch (link) {
        case 'home':
            url = "/api/v1/streaming/?stream=user";
            break;
        case 'notification':
            url = "/api/v1/streaming/?stream=user:notification";
            break;
        case 'local':
            url = "/api/v1/streaming/?stream=public:local";
            break;
        case 'public':
            url = "/api/v1/streaming/?stream=public";
            break;
    }
    return url
}

function timelineCard(json, setting) {

    var content = ""
    var name = ""
    var avatar = ""
    var id = ""

    //通知とタイムラインでは内容が変わるので
    if (setting.load == 'notification') {
        if ('status' in json) {
            content = json.status.content
            id = json.status.id
        }
        name = json.type + '/' + json.account.display_name + ' / @' + json.account.acct
        if (setting.gif) {
            avatar = json.account.avatar_static
        } else {
            avatar = json.account.avatar
        }
    } else {
        content = json.content
        id = json.id
        name = json.account.display_name + ' / ' + json.account.acct
        if (setting.gif) {
            avatar = json.account.avatar_static
        } else {
            avatar = json.account.avatar
        }
    }

    //色とか
    var color = "blue lighten-1"
    if (document.getElementById('darkmode_switch').checked) {
        color = "blue darken-4"
    } else {
        color = "blue lighten-1"
    }

    //Card作る。
    var parentDiv = document.createElement('div')
    parentDiv.className = 'space'
    var cardDiv = document.createElement('div')
    cardDiv.className = `card-panel ${color}`
    cardDiv.style.padding = '5px'
    cardDiv.style.margin = '2px'
    cardDiv.style.minHeight = '50px'
    //画像非表示時はPaddingいらん
    if (!setting.img) { cardDiv.style.paddingLeft = '45px' }
    cardDiv.style.position = 'relative'

    //テキスト
    var textDiv = document.createElement('div')
    textDiv.style.padding = '2px'

    //アイコン
    if (!setting.img) {
        var avatarImg = document.createElement('img')
        avatarImg.style.width = '40px'
        avatarImg.style.margin = '2px'
        avatarImg.style.position = 'absolute'
        avatarImg.style.left = '0'
        avatarImg.src = avatar
        textDiv.append(avatarImg)
    }

    var contentSpan = document.createElement('span')
    contentSpan.style.color = '#ffffff'
    contentSpan.innerHTML = content

    var accountSpan = document.createElement('span')
    accountSpan.style.color = '#ffffff'
    accountSpan.innerHTML = name

    //入れる
    textDiv.append(accountSpan)
    textDiv.append(contentSpan)


    //ファボアイコンとか
    var favIcon = document.createElement('i')
    favIcon.onclick = function () {
        favToot(id)
    }
    favIcon.className = 'material-icons white-text'
    favIcon.innerHTML = 'star_border'
    favIcon.style.cursor = 'pointer'
    favIcon.style.cursor = 'hand'
    favIcon.style.marginRight = '10%'

    var btIcon = document.createElement('i')
    btIcon.onclick = function () {
        btToot(id)
    }
    btIcon.className = 'material-icons white-text'
    btIcon.innerHTML = 'repeat'
    btIcon.style.cursor = 'pointer'
    btIcon.style.cursor = 'hand'
    btIcon.style.marginRight = '10%'

    var openIcon = document.createElement('i')
    openIcon.onclick = function () {
        openBrowser(json, instance)//electron.jsに書いてある
    }
    openIcon.className = 'material-icons white-text'
    openIcon.innerHTML = 'open_in_browser'
    openIcon.style.cursor = 'pointer'
    openIcon.style.cursor = 'hand'
    openIcon.style.marginRight = '10%'

    var iconDiv = document.createElement('div')
    iconDiv.append(favIcon)
    iconDiv.append(btIcon)
    iconDiv.append(openIcon)

    cardDiv.append(textDiv)
    cardDiv.append(iconDiv)

    parentDiv.append(cardDiv)

    return parentDiv
}

function favToot(json, id) {
    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `https://${json.instance}/api/v1/statuses/${id}/favourite?access_token=${json.token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            M.toast({ html: `ふぁぼりました` })
        }
    }
    xmlHttp.send();
}

function btToot(json, id) {
    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `https://${json.instance}/api/v1/statuses/${id}/reblog?access_token=${json.token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            M.toast({ html: `ブーストしました` })
        }
    }
    xmlHttp.send();
}

function getURL(load) {
    var url = ""
    switch (load) {
        case 'home':
            url = "/api/v1/timelines/home?limit=40";
            break;
        case 'notification':
            url = "/api/v1/notifications?limit=40";
            break;
        case 'local':
            url = "/api/v1/timelines/public?limit=40&local=true";
            break;
        case 'public':
            url = "/api/v1/timelines/public?limit=40";
            break;
    }
    return url
}

document.getElementById('post').onclick = function () {
    //マルチカラムじとそうでない時
    var isMultiColumn = document.getElementById('multi_column').checked
    if (isMultiColumn) {
        //マルチカラム
        //インスタンス、アクセストークンをOption要素のValueから持ってくる
        var accountJSON = JSON.parse(document.getElementById('post_account_list').value)
        //投稿
        var toot_text = document.getElementById('toot_text').value
        //API叩く
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", `https://${accountJSON.instance}/api/v1/statuses/?access_token=${accountJSON.token}`);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xmlHttp.onload = function () {
            if (this.status == 200) {
                M.toast({ html: `投稿しました` })
            }
        }
        xmlHttp.send("status=" + encodeURIComponent(toot_text));
        document.getElementById('toot_text').value = ""
    } else {
        //そうじゃない
        //投稿
        var toot_text = document.getElementById('toot_text').value
        //API叩く
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", `https://${instance}/api/v1/statuses/?access_token=${token}`);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xmlHttp.onload = function () {
            if (this.status == 200) {
                M.toast({ html: `投稿しました` })
            }
        }
        xmlHttp.send("status=" + encodeURIComponent(toot_text));
        document.getElementById('toot_text').value = ""
    }
}

function initMultiColumn() {
    var multi_column = document.getElementById('multi_column_div')
    multi_column.innerHTML = ''

    //Timeline
    var timelineList = loadTimelineList()
    for (let index = 0; index < timelineList.length; index++) {
        const json = timelineList[index];
        //Card作成
        var parentDiv = document.createElement('div')
        parentDiv.className = 'col s12 m5 multicolumn_card'
        parentDiv.style.height = '100%'
        if (localStorage.getItem('column_width') != null) { parentDiv.style.width = localStorage.getItem('column_width') }
        var cardDiv = document.createElement('div')
        cardDiv.className = 'white multicolumn_div'
        cardDiv.style.padding = '5px'
        cardDiv.style.height = '100%'
        //TL
        var timelineDiv = document.createElement('div')
        timelineDiv.className = 'multicolumn_timeline'
        timelineDiv.style.width = '100%'
        timelineDiv.style.height = 'calc(100% - 20px)'
        timelineDiv.id = json.name

        var span = document.createElement('span')
        span.style.color = 'black'
        span.style.height = '10px'
        span.className = 'multicolumn_title'
        span.innerHTML = json.name
        cardDiv.append(span)
        cardDiv.append(timelineDiv)
        parentDiv.append(cardDiv)
        multi_column.append(parentDiv)

        loadMultiColumnTimeline(json, json.name)
    }
}

function loadTimelineList() {
    timelineList = []
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var list = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            timelineList.push(item)
        }
    }
    return timelineList
}

function getTimelineNameList() {
    nameList = []
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var list = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            nameList.push(item.name)
        }
    }
    return nameList
}

//マルチカラム時のアカウント切り替えドロップダウンメニューつくる
function setAccountDropDownMenu() {
    var accounts = localStorage.getItem('accounts')
    if (accounts != null) {
        var json = JSON.parse(accounts)
        for (let index = 0; index < json.length; index++) {
            const element = json[index];
            var option = document.createElement('option')
            option.innerHTML = element.name
            option.value = JSON.stringify(element)
            document.getElementById('post_account_list').append(option)
        }
    }
}