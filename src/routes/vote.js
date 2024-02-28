const express = require('express')
const path = require('path')
const fs = require('fs-extra')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件
const router = express.Router()

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON, favorite JSON)")

    router.use(express.json()); // 讓 json 資料轉換成物件
    router.use(express.urlencoded({ extended: true }));

    router.get('/', (req, res) => {
        if (req.session.loggedin) {

            db.all('SELECT * FROM clothes', function (error, results) {
                if (error) throw error

                if (results.length > 0) {
                    var images_arr = []
                    var ids = []
                    for (favorites of results) {
                        data = favorites['favorite']
                        if (data != null) {
                            var jdata = JSON.parse(data)

                            for (item of jdata) {
                                images_arr.push(JSON.stringify(item))
                                ids.push(favorites['name'])
                            }

                            continue

                        } else continue
                    }
                    if( images_arr.length <= 0 ){
                        res.render('vote', { images: null, alert: "暫無資料" })
                    }else {
                        res.render('vote', { images: images_arr, ids: ids, alert: null })
                    }
                } else {
                    res.render('vote', { images: null, alert: "暫無資料" })
                }
            })

        } else {
            res.send('請先登入！')
        }
    })
})

module.exports = router