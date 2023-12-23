const express = require('express')

const router = express.Router()
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件

// http://localhost:3000/home

router.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '! <br> <a href="/upload">上傳</a>');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

router.get('/closet/shorts', (req, res) => {
    
    if (req.session.loggedin) {
        
        var username = req.session.username

        db.all('SELECT * FROM clothes WHERE name = ?', [username], function(error, results) {
            if(results.length > 0){
                if (results[0]['shorts'] != null){
                    var jdata = JSON.parse(results[0]['shorts'])
                    var images_arr = []
                    for(var item of jdata){
                        images_arr.push(item['imgName'])
                    }
                    res.render('closet', {images: images_arr, alert: null})
                } else {
                    res.render('closet', {images: null, alert: "暫無資料"})
                }
            }else{ 
                res.render('closet', {images: null, alert: "暫無資料"})
            }
        })

    } else {
        res.send('請先登入！')
    }




})

module.exports = router;