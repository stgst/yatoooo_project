const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: '1yzS6bsXX5lFV5Ap7XsKX9j4FsFxKsCPm7oYLLIPruhl5qJ0x6UpzRD7ra9lDSJ3KHjxCe0ZD8CBK+/5N49sLqNVhPYWXPkKcEVnvNQLM3R1Mt4Z0vIC0CUzOoGeTQegSsIRJuri/wJxiPJCPhZtW4+0BgaLUCrVi+ci4BYPtEbES8FlBLV6QhRU4KieWLhw',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600 * 1000 }
}));

app.get('/', (request, response) => {
  response.send('12345')
})

const login_router = require('./routes/login')
const register_router = require('./routes/register')
const main_router = require('./routes/main')
const upload_router = require('./routes/upload')

app.use('/login', login_router) 
app.use('/register', register_router) // http://localhost:3000/register
app.use('/', main_router) // http://localhost:3000/
app.use('/upload', upload_router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})