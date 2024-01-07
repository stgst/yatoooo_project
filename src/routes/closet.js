const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件
const router = express.Router()

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON)")

    router.use(express.json()); // 讓 json 資料轉換成物件
    router.use(express.urlencoded({ extended: true }));

    router.get('/', (req,res) => {
        if (req.session.loggedin) {
            
            var username = req.session.username
    
            res.render('closet', {images: null, alert: null})
    
        } else {
            res.send('請先登入！')
        }
    })

    router.get('/shorts', (req, res) => {
    
        if (req.session.loggedin) {
            
            var username = req.session.username
    
            db.all('SELECT * FROM clothes WHERE name = ?', [username], function(error, results) {
                if (error) throw error
    
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
    
    router.get('/long', (req, res) => {
        
        if (req.session.loggedin) {
            
            var username = req.session.username
    
            db.all('SELECT * FROM clothes WHERE name = ?', [username], function(error, results) {
                if (error) throw error
    
                if(results.length > 0){
                    if (results[0]['long'] != null){
                        var jdata = JSON.parse(results[0]['long'])
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
    
    router.get('/pants', (req, res) => {
        
        if (req.session.loggedin) {
            
            var username = req.session.username
    
            db.all('SELECT * FROM clothes WHERE name = ?', [username], function(error, results) {
                if (error) throw error
    
                if(results.length > 0){
                    if (results[0]['pants'] != null){
                        var jdata = JSON.parse(results[0]['pants'])
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
    
    router.get('/skirts', (req, res) => {
        
        if (req.session.loggedin) {
            
            var username = req.session.username
    
            db.all('SELECT * FROM clothes WHERE name = ?', [username], function(error, results) {
                if (error) throw error
    
                if(results.length > 0){
                    if (results[0]['skirts'] != null){
                        var jdata = JSON.parse(results[0]['skirts'])
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

})

module.exports = router