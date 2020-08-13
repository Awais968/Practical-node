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
const server = http.createServer(app)
const boot = () => {server.listen(app.get('port'), ()=>{
    console.info(`Express server listening on port ${app.get('port')}`)
})
}
const shutdown = () => {
    server.close()
}

if(require.main === module){
    console.log('1')
    boot()
} else {
    console.log('Running app as module')
    exports.boot = boot
    exports.shutdown = shutdown
    exports.port = app.get('port')
}