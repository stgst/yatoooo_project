const express = require('express')
const pair = require('../model/pair')
const fetch = require('node-fetch')
const path = require('path')
const sqlite = require('sqlite3')
const dbFile = '../../../data/user.sqlite'

const router = express.Router()
const db = new sqlite.Database(path.resolve(__dirname + dbFile))

router.get('/', function (request, response) {
    if (request.session.loggedin) {
        response.render('pair', { btn_name: '開始配對', top: null, bottom: null, hidden: true })
    }
})

router.get('/process', function (request, response) {
    if (request.session.loggedin) {

        var username = request.session.username
        const url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-FF49B18C-7FBD-4191-A36A-4037D0DF5353&StationId=C0A9F0&WeatherElement=AirTemperature"

        // <APIKEY> 部分取代成授權碼

        fetch(url).then(res => res.json())
            .then(async (data) => {

                var temperature = data.records.Station[0].WeatherElement.AirTemperature

                if (temperature >= 20) {
                    var top = await pair.getShorts(username)
                    var bottom = await pair.final_choose(top[1], username)

                } else if (temperature < 20) {
                    var top = await pair.getLong(username)
                    var bottom = await pair.final_choose(top[1], username)
                }

                response.render('pair', { btn_name: '重新配對', top: top[0], bottom: bottom, hidden: false })
                response.end();
            })

    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

router.get('/callback', (request, response) => {
    const up = request.query.up
    const off = request.query.off
    const username = request.session.username

    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
        db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON, favorite JSON)")
        
        var params = {'up': up, 'off': off}
        db.serialize(() => {
            db.all('SELECT * FROM clothes WHERE name = ?', username, (error, results) => {
                if (error) throw error

                if (results.length > 0) { //有資料
                    if (results[0]['favorite'] == null) { // 如果欄位是空的
                        db.run(`UPDATE clothes SET favorite=? WHERE name=?`, [`[${JSON.stringify(params)}]`, username])
                    } else { // 否則讀取原本的資料再新增並更新
                        var jdata = JSON.parse(results[0]['favorite'])
                        jdata.push(params)
                        db.run(`UPDATE clothes SET favorite=? WHERE name=?`, [JSON.stringify(jdata), username])
                    }
                } else { // 如果整個資料沒有建立過
                    db.run(`INSERT INTO clothes (name, favorite) VALUES (?, ?)`, [username, `[${JSON.stringify(params)}]`])
                }
            })
        })
    })

    response.redirect('/pair')
})

module.exports = router;
