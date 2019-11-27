const path = require('path')
const express = require('express')
const hbs = require('hbs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bodyParser = require('body-parser')
const cookie_parser = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(cookie_parser())

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setting up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



//Set up static homepage
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title:'ClementTask Manager App',
        name: 'Philip Clement'
    })
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.get('/dashboard', (req,res)=>{
    res.render('homepage')
})

app.get('/cookie', (req,res)=>{
    console.log(req.cookies.token)
})




module.exports = app