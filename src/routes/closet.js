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
            res.render('closet', { images: null, alert: null })

        } else {
            res.send('請先登入！')
        }
    })

    router.get('/remove', (req, res) => {
        if (req.session.loggedin) {

            const type = req.query.type;
            const index = req.query.index;
            var username = req.session.username

            if (type && index && username) {

                db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
                    if (error) throw error

                    if (results.length > 0) {
                        if (results[0][type] != null) {
                            var jdata = JSON.parse(results[0][type])
                            var filename = jdata[index]['imgName']

                            jdata.splice(index, 1);
                            fs.removeSync(path.resolve(__dirname + '../../public/images/' + filename))

                            db.run(`UPDATE clothes SET ${type}=? WHERE name=?`, [`${JSON.stringify(jdata)}`, username])
                            res.redirect(`/closet/${type}`)
                        } else {
                            res.render('closet', { images: null, alert: "暫無資料" })
                        }
                    } else {
                        res.render('closet', { images: null, alert: "暫無資料" })
                    }
                })

            }

        } else {
            res.send('請先登入！')
        }
    })

    router.get("/:type", (req, res) => {
        const type = req.params.type

        if (type == "shorts" || type == "long" || type == "pants" || type == "skirts") {
            if (req.session.loggedin) {

                var username = req.session.username

                db.all('SELECT * FROM clothes WHERE name = ?', [username], function (error, results) {
                    if (error) throw error

                    if (results.length > 0) {
                        if (results[0][type] != null) {
                            var jdata = JSON.parse(results[0][type])
                            var images_arr = []
                            for (var item of jdata) {
                                images_arr.push(item['imgName'])
                            }
                            res.render('closet', { type: type, images: images_arr, alert: null })
                        } else {
                            res.render('closet', { images: null, alert: "暫無資料" })
                        }
                    } else {
                        res.render('closet', { images: null, alert: "暫無資料" })
                    }
                })
            } else {
                res.send('請先登入！')
            }
        } else {
            res.sendStatus(400)
        }

    })
})

module.exports = router