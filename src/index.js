const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  response.send('12345')
})

app.post('/post', (req, res) => {
    res.send(req.body.message)
})

// Express 會開始監聽設定的 port 上 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})