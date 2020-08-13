const express = require('express')
let app = express()

app.all('', (req, res) =>{
    res.send('Welcome to Practical node js')
})
app.listen(3000)