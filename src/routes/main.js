const express = require('express')

const router = express.Router()
const fetch = require('node-fetch')
// const path = require('path')
// const sqlite3 = require('sqlite3').verbose()
// var dbFile = '../../../data/user.sqlite'

// const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件

// http://localhost:3000/home

router.get('/home', function (request, response) {
    if (request.session.loggedin) {

        const url =
            "http://api.weatherstack.com/current?access_key=122fc1e6178fab2a85797f43b18519fd&query=Taipei&units=m";
        // weatherstack的api

        fetch(url).then(res => res.json())
        .then(data => {
            var date = data['location']['localtime']
            var location = data['location']['name']
            var temperature = data['current']['temperature']
            
            response.render('home', {date: date, location: location, temperature: temperature})
            response.end();
        })

    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

module.exports = router;