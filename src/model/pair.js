const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// 從資料庫讀取短袖資料，並亂數選擇
function getShorts(username) {

    return new Promise((resolve, reject) => {
        var shorts, version_type
        return db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
            if (error) return reject(error)

            if (results.length > 0) {
                if (results[0]['shorts'] != null) {
                    var jdata = JSON.parse(results[0]['shorts'])
                    var randomNum = getRandomInt(jdata.length)

                    shorts = jdata[randomNum]['imgName']
                    version_type = jdata[randomNum]['version_type']

                    return resolve([shorts, version_type])
                } else {
                    return
                }
            } else {
                return
            }
        })
    })
}


// 從資料庫讀取長袖資料，並亂數選擇
function getLong(username) {
    return new Promise((resolve, reject) => {
        var long, version_type
        return db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
            if (error) return reject(error)

            if (results.length > 0) {
                if (results[0]['long'] != null) {
                    var jdata = JSON.parse(results[0]['long'])
                    var randomNum = getRandomInt(jdata.length)

                    long = jdata[randomNum]['imgName']
                    version_type = jdata[randomNum]['version_type']
                    return resolve([long, version_type])
                } else {
                    return
                }
            } else {
                return
            }
        })
    })
}

function final_choose(version_type, username) {
    return new Promise((resolve, reject) => {

        // 亂數選擇褲子或裙子，並亂數選擇長或短
        // 0 = 褲子, 1 = 裙子
        // 0 = 長, 1 = 短

        var type_choose = getRandomInt(2) == 0 ? "pants" : "skirts" // 0 或 1
        var long_choose = getRandomInt(2) == 0 ? "長版" : "短版" // 0 或 1

        // 判斷 version_type 為寬版 or 窄版，並亂數選擇其下衣為窄版 / 長 or 寬版 / 短
        var bottom
        if (version_type == "寬版") {
            // 篩選出標籤為窄版的下衣
            return db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
                if (error) return reject(error)

                if (results.length > 0) {
                    if (results[0][type_choose] != null) {
                        var jdata = JSON.parse(results[0][type_choose])
                        var i = 0
                        for (var item of jdata) {
                            if (item["version_type"] != "窄版") {
                                jdata.splice(i, 1)
                                i++
                            } else if (item["long_type"] != long_choose) {
                                jdata.splice(i, 1)
                                i++
                            } else {
                                i++
                            }
                        }
                        var randomNum = getRandomInt(jdata.length)
                        bottom = jdata[randomNum]['imgName']

                        return resolve(bottom)
                    } else {
                        return
                    }
                } else {
                    return
                }
            })
        } else if (version_type == "窄版") {
            // 篩選出標籤為寬版的下衣
            return db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
                if (error) return reject(error)
                if (results.length > 0) {
                    if (results[0][type_choose] != null) {
                        var jdata = JSON.parse(results[0][type_choose])
                        var i = 0
                        for (var item of jdata) {
                            if (item["version_type"] != "寬版") {
                                jdata.splice(i, 1)
                                i++
                            } else if (item["long_type"] != long_choose) {
                                jdata.splice(i, 1)
                                i++
                            } else {
                                i++
                            }
                        }
                        var randomNum = getRandomInt(jdata.length)
                        bottom = jdata[randomNum]['imgName']

                        return resolve(bottom)
                    } else {
                        return
                    }
                } else {
                    return
                }
            })
        }
    })
}

module.exports = { getShorts, getLong, final_choose }