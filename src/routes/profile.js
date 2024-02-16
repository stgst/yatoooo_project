const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件
const router = express.Router()

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON, favorite JSON)")

    router.use(express.json()); // 讓 json 資料轉換成物件
    router.use(express.urlencoded({ extended: true }));

    router.get('/remove', (req, res) => {
        if (req.session.loggedin) {

            const index = req.query.index;
            var username = req.session.username

            if (index && username) {

                db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
                    if (error) throw error

                    if (results.length > 0) {
                        if (results[0]['favorite'] != null) {
                            var jdata = JSON.parse(results[0]['favorite'])
                            jdata.splice(index, 1);

                            db.run(`UPDATE clothes SET favorite=? WHERE name=?`, [JSON.stringify(jdata), username])
                            res.redirect('/profile')

                        } else {
                            res.render('profile', { images: null, alert: "暫無資料" })
                        }
                    } else {
                        res.render('profile', { images: null, alert: "暫無資料" })
                    }
                })

            }

        } else {
            res.send('請先登入！')
        }
    })

    router.get("/", (req, res) => {
        if (req.session.loggedin) {

            var username = req.session.username

            db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
                if (error) throw error

                if (results.length > 0) {
                    if (results[0]['favorite'] != null) {
                        var jdata = JSON.parse(results[0]['favorite'])
                        var images_arr = []
                        for (item of jdata){
                            images_arr.push(JSON.stringify(item))
                        }

                        res.render('profile', { images: images_arr, alert: null })
                    } else {
                        res.render('profile', { images: null, alert: "暫無資料" })
                    }
                } else {
                    res.render('profile', { images: null, alert: "暫無資料" })
                }
            })
        } else {
            res.send('請先登入！')
        }

    })
})

module.exports = router