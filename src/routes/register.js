const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
var dbFile = '../../../data/user.sqlite'

const db = new sqlite3.Database(path.resolve(__dirname + dbFile), sqlite3.OPEN_READWRITE) // 定義一個 user.sqlite 的 database 物件
const router = express.Router()

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY, name TEXT, shorts JSON, long JSON, pants JSON, skirts JSON)")
    // http://localhost:3000/register/

    router.get('/', (req, res)=> {
        res.sendFile(path.resolve(__dirname + '../../views/register.html'));
    })

    // http://localhost:3000/register
    router.post('/', (request, response) => {

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
})

module.exports = router