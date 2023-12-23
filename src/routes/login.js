const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件
const router = express.Router()
// router.set('view engine', 'ejs');
// router.set('views', path.join(__dirname, '/views'))

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON)")

    router.use(express.json()); // 讓 json 資料轉換成物件
    router.use(express.urlencoded({ extended: true }));

    // http://localhost:3000/auth
    router.post('/auth', function(request, response) {
        
        // name, pwd ( 表單 )

        let username = request.body.name;
        let password = request.body.pwd;
        
        if (username && password) {
            
            db.all('SELECT * FROM users WHERE name = ? AND pwd = ?', [username, password], function(error, results) {
                
                if (error) throw error;
                
                if (results.length > 0) {
                    
                    request.session.loggedin = true;
                    request.session.username = username;

                    response.redirect('/home');
                } else {
                    response.send('Incorrect Username and/or Password!');
                }			
                response.end();
            });
        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    });

    router.get('/', (req, res)=> {
        res.sendFile(path.resolve(__dirname + '../../views/login.html'));
    })
})

module.exports = router