const express = require('express')
const fileUpload = require('express-fileupload');
const path = require('path')
const sqlite = require('sqlite3')
const dbFile = '../../../data/user.sqlite'

const router = express.Router()
const db = new sqlite.Database(path.resolve(__dirname + dbFile))

router.use(fileUpload())

db.serialize(() => {
    router.get('/', (req, res) => {
        if(req.session.loggedin){
            res.sendFile(path.resolve(__dirname + "../../public/upload.html"))
        }else {
            res.send('請先登入！')
        }
    })

    router.post('/', (req, res) => {
        const { img } = req.files;
        var filename = img.name
        const timestamp = Math.floor(Date.now() / 1000).toString()
        
        const username = req.session.username

        if (!img) return res.sendStatus(400);
    
        if (!/^image/.test(img.mimetype)) return res.sendStatus(400);
    
        img.mv(path.resolve(__dirname + '../../../data/images/' + username + '_' + timestamp + filename.substr(filename.lastIndexOf('.'))));
    
        // data/images/xiung_170256960.png

        res.sendStatus(200);
    })
})

module.exports = router;