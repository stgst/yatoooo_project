const express = require('express')

const router = express.Router()

// http://localhost:3000/home

router.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '! <br> <a href="/upload">上傳</a>');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

module.exports = router;