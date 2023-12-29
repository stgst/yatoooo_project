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
        response.render('home')
        response.end()
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

module.exports = router;