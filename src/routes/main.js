const express = require('express')

const router = express.Router()
const fetch = require('node-fetch')
const moment = require('moment')
// const path = require('path')
// const sqlite3 = require('sqlite3').verbose()
// var dbFile = '../../../data/user.sqlite'

// const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件

// http://localhost:3000/home

router.get('/home', function (request, response) {
    if (request.session.loggedin) {

        const url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-FF49B18C-7FBD-4191-A36A-4037D0DF5353&StationId=C0A9F0&WeatherElement=Weather,Now,AirTemperature"

        // <APIKEY> 部分取代成授權碼

        fetch(url).then(res => res.json())
            .then(data => {
                var date = data.records.Station[0].ObsTime.DateTime
                var temperature = data.records.Station[0].WeatherElement.AirTemperature
                var precipitation = data.records.Station[0].WeatherElement.Now.Precipitation
                var weather = data.records.Station[0].WeatherElement.Weather

                var d = moment(date).format('MM/DD HH:mm')

                response.render('home', { temperature: temperature, date: d, precipitation: precipitation, weather: weather })
            })
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

module.exports = router;