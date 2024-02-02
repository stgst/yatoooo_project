const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000
const path = require('path')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs')

app.set('views', `${path.resolve(__dirname + '/views')}`)

app.use(session({
  secret: '1yzS6bsXX5lFV5Ap7XsKX9j4FsFxKsCPm7oYLLIPruhl5qJ0x6UpzRD7ra9lDSJ3KHjxCe0ZD8CBK+/5N49sLqNVhPYWXPkKcEVnvNQLM3R1Mt4Z0vIC0CUzOoGeTQegSsIRJuri/wJxiPJCPhZtW4+0BgaLUCrVi+ci4BYPtEbES8FlBLV6QhRU4KieWLhw',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600 * 1000 }
}));

app.get('/', (req, res) => {
  res.send('hello world')
})

const login_router = require('./routes/login')
const register_router = require('./routes/register')
const main_router = require('./routes/main')
const upload_router = require('./routes/upload')
const closet_router = require('./routes/closet')
const pair_router = require('./routes/pair')

app.use('/login', login_router) // http://localhost:3000/login
app.use('/register', register_router) // http://localhost:3000/register
app.use('/', main_router) // http://localhost:3000/
app.use('/upload', upload_router)
app.use('/closet', closet_router)
app.use('/pair', pair_router)


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})