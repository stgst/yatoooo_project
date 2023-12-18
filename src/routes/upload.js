const express = require('express')
const fileUpload = require('express-fileupload');
const path = require('path')
const sqlite = require('sqlite3')
const dbFile = '../../../data/user.sqlite'

const router = express.Router()
const db = new sqlite.Database(path.resolve(__dirname + dbFile))

router.use(fileUpload())

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON)")

    router.get('/', (req, res) => {
        if (req.session.loggedin) {
            res.sendFile(path.resolve(__dirname + "../../public/upload.html"))
        } else {
            res.send('請先登入！')
        }
    })

    router.post('/', (req, res) => {
        //imange 
        const { img } = req.files;
        var filename = img.name
        const timestamp = Math.floor(Date.now() / 1000).toString()

        const username = req.session.username

        if (!img) return res.sendStatus(400);

        if (!/^image/.test(img.mimetype)) return res.sendStatus(400);

        var img_name = username + '_' + timestamp + filename.substr(filename.lastIndexOf('.'))
        img.mv(path.resolve(__dirname + '../../../data/images/' + img_name));

        // data/images/xiung_170256960.png

        //Form data saving
        const kind = req.body.kind
        const long = req.body.long
        const version = req.body.type
        const color = req.body.color

        const long_type = long == "短版" ? "短版" : "長版"
        const version_type = version == "寬版" ? "寬版" : "窄版"

        switch (kind) {
            case "短袖":
                var params = { 'imgName': img_name, 'long_type': long_type, 'version_type': version_type, 'colors': color }
                db.serialize(() => {
                    db.all('SELECT * FROM clothes WHERE name = ?', username, (error, results) => {
                        if (error) throw error

                        if (results.length > 0) { //有資料
                            if (results[0]['shorts'] == null) { // 如果 shorts 的欄位是空的
                                db.run('UPDATE clothes SET shorts=? WHERE name=?', [`[${JSON.stringify(params)}]`, username])
                            } else { // 否則讀取原本的資料再新增並更新
                                var jdata = JSON.parse(results[0]['shorts'])
                                jdata.push(params)
                                db.run('UPDATE clothes SET shorts=? WHERE name=?', [JSON.stringify(jdata), username])
                            }
                        } else { // 如果整個資料沒有建立過
                            db.run('INSERT INTO clothes (name, shorts) VALUES (?, ?)', [username, `[${JSON.stringify(params)}]`])
                        }
                    })
                })
                break
            case "長袖":
                var params = { 'imgName': img_name, 'long_type': long_type, 'version_type': version_type, 'colors': color }
                db.serialize(() => {
                    db.all('SELECT * FROM clothes WHERE name = ?', username, (error, results) => {
                        if (error) throw error

                        if (results.length > 0) { //有資料
                            if (results[0]['long'] == null) { // 如果 long 的欄位是空的
                                db.run('UPDATE clothes SET long=? WHERE name=?', [`[${JSON.stringify(params)}]`, username])
                            } else { // 否則讀取原本的資料再新增並更新
                                var jdata = JSON.parse(results[0]['long'])
                                jdata.push(params)
                                db.run('UPDATE clothes SET long=? WHERE name=?', [JSON.stringify(jdata), username])
                            }
                        } else { // 如果整個資料沒有建立過
                            db.run('INSERT INTO clothes (name, long) VALUES (?, ?)', [username, `[${JSON.stringify(params)}]`])
                        }
                    })
                })
                break
            case "褲子":
                var params = { 'imgName': img_name, 'long_type': long_type, 'version_type': version_type, 'colors': color }
                db.serialize(() => {
                    db.all('SELECT * FROM clothes WHERE name = ?', username, (error, results) => {
                        if (error) throw error

                        if (results.length > 0) { //有資料
                            if (results[0]['pants'] == null) { // 如果 pants 的欄位是空的
                                db.run('UPDATE clothes SET pants=? WHERE name=?', [`[${JSON.stringify(params)}]`, username])
                            } else { // 否則讀取原本的資料再新增並更新
                                var jdata = JSON.parse(results[0]['pants'])
                                jdata.push(params)
                                db.run('UPDATE clothes SET pants=? WHERE name=?', [JSON.stringify(jdata), username])
                            }
                        } else { // 如果整個資料沒有建立過
                            db.run('INSERT INTO clothes (name, pants) VALUES (?, ?)', [username, `[${JSON.stringify(params)}]`])
                        }
                    })
                })
                break
            case "裙子":
                var params = { 'imgName': img_name, 'long_type': long_type, 'version_type': version_type, 'colors': color }
                db.serialize(() => {
                    db.all('SELECT * FROM clothes WHERE name = ?', username, (error, results) => {
                        if (error) throw error

                        if (results.length > 0) { //有資料
                            if (results[0]['skirts'] == null) { // 如果 skirts 的欄位是空的
                                db.run('UPDATE clothes SET skirts=? WHERE name=?', [`[${JSON.stringify(params)}]`, username])
                            } else { // 否則讀取原本的資料再新增並更新
                                var jdata = JSON.parse(results[0]['skirts'])
                                jdata.push(params)
                                db.run('UPDATE clothes SET skirts=? WHERE name=?', [JSON.stringify(jdata), username])
                            }
                        } else { // 如果整個資料沒有建立過
                            db.run('INSERT INTO clothes (name, skirts) VALUES (?, ?)', [username, `[${JSON.stringify(params)}]`])
                        }
                    })
                })
                break
            default:
                res.sendStatus(400)
                break
        }

        res.sendStatus(200);
    })
})

module.exports = router;