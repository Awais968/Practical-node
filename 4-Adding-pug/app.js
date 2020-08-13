const express = require('express')
const http = require('http')
const path = require('path')
const { profile } = require('console')

let app = express()

app.set('appName', 'hello-advanced')
app.set('port', process.env.port || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.all('*', (req, res) => {
    res.render('index', {msg: 'Welcome to practical node js'})
})


http.createServer(app).listen(app.get('port'), ()=>{
    console.info(`Express server listening on port ${app.get('port')}`)
})


