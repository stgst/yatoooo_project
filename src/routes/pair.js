const express = require('express')
const router = express.Router()
const pair = require('../model/pair')
const fetch = require('node-fetch')

router.get('/', function (request, response) {
    if (request.session.loggedin) {

        var username = request.session.username
        const url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=<APIKEY>&StationId=C0A9F0&WeatherElement=AirTemperature"
        
        // <APIKEY> 部分取代成授權碼

        fetch(url).then(res => res.json())
        .then(async (data) => {

            var temperature = data.records.Station[0].WeatherElement.AirTemperature

            if (temperature >= 20){
                var top = await pair.getShorts(username)
                var bottom = await pair.final_choose(top[1], username)

                response.render('pair', {top: top[0], bottom: bottom})
                response.end();

            }else if (temperature < 20){
                var top = await pair.getLong(username)
                var bottom = await pair.final_choose(top[1], username)

                response.render('pair', {top: top[0], bottom: bottom})
                response.end();
            }
        })
        
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

module.exports = router;
