
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