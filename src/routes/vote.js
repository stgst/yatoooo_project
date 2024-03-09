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
                    for (favorites of results) {
                        data = favorites['favorite']
                        if (data != null) {
                            var jdata = JSON.parse(data)
                            var indexs = 0
                            for (item of jdata) {
                                item['id'] = favorites['name']
                                item['index'] = indexs
                                images_arr.push(JSON.stringify(item))
                                indexs+=1
                            }
                            continue
                        } else continue
                    }
                    if( images_arr.length <= 0 ) res.render('vote', { images: null, alert: "暫無資料" })
                    else res.render('vote', { images: images_arr, alert: null })
                } else res.render('vote', { images: null, alert: "暫無資料" })
            })

        } else res.send('請先登入！')
    })

    router.get('/like', (req, res) => {
        if (req.session.loggedin) {
            var username = req.session.username
            var id = req.query.id
            var index = req.query.index
            db.all('SELECT * FROM clothes WHERE name = ?', id, (error, results) => {
                if (error) throw error
                if (results.length > 0) {
                    var data = JSON.parse(results[0]['favorite'])
                    var c = false
                    for ( item of data[index]['like']) {
                        if(item == username){
                            c = true
                        }
                    }
                    if(!c){
                        data[index]['like'].push(username)
                    }

                    db.run(`UPDATE clothes SET favorite=? WHERE name=?`, [JSON.stringify(data), id])
                }
            })
            res.redirect('/vote')
        } else res.send('請先登入！')
    })
})

module.exports = router