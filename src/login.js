const express = require('express')
const session = require('express-session')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = './user.sqlite'

const db = new sqlite3.Database(dbFile) // 定義一個 user.sqlite 的 database 物件
const app = express()

db.serialize(() => { // 讓以下有關 db 的指令有優先順序
     // 初始化 db
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")

    app.use(session({
        secret: '1yzS6bsXX5lFV5Ap7XsKX9j4FsFxKsCPm7oYLLIPruhl5qJ0x6UpzRD7ra9lDSJ3KHjxCe0ZD8CBK+/5N49sLqNVhPYWXPkKcEVnvNQLM3R1Mt4Z0vIC0CUzOoGeTQegSsIRJuri/wJxiPJCPhZtW4+0BgaLUCrVi+ci4BYPtEbES8FlBLV6QhRU4KieWLhw',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 600 * 1000 }
    }));
    app.use(express.json()); // 讓 json 資料轉換成物件
    app.use(express.urlencoded({ extended: true }));

    // http://localhost:3000/auth
    app.post('/auth', function(request, response) {
        
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

    app.get('/login', (req, res)=> {
        res.sendFile(path.resolve(__dirname + '../../test2.html'));
    })

    app.get('/register', (req, res)=> {
        res.sendFile(path.resolve(__dirname + '../../test3.html'));
    })

    app.post('/register', (request, response) => {

        let username = request.body.name;
        let password = request.body.pwd;
        
        if (username && password) {

            db.all('SELECT * FROM users WHERE name = ? OR pwd = ?', [username, password], function(error, results) {
                
                if (error) throw error;

                if (results.length > 0){
                    response.send('Username or password already exist.');
                } else {
                    db.run('INSERT INTO users (name, pwd) VALUES (?, ?)', [username, password])
                    response.redirect('/login')
                }
                response.end();
            })
        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    })

    // http://localhost:3000/home
    app.get('/home', function(request, response) {
        
        if (request.session.loggedin) {
            
            response.send('Welcome back, ' + request.session.username + '!');
        } else {
            
            response.send('Please login to view this page!');
        }
        response.end();
    });
})
app.listen(3000);