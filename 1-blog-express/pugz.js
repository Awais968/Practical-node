const express = require('express')
const path = require('path')

const app = express()
app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static(path.join(__dirname, './views')));
app.get('/', (req, res) => {
res.render('admin', {pageTitle: 'Template engine', isAvailable: true})
}).listen(8000) 