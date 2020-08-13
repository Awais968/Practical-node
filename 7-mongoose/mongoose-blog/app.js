const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || 'ABC'
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || 'XYZXYZ'

const express = require('express')
const routes = require('./routes')
const http = require('http')
const path = require('path')
const mongoose = require('mongoose')
const models = require('./models')
const dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog'

const db = mongoose.connect(dbUrl, {useMongoClient: true})
mongoose.Promise = global.Promise
const everyauth = require('everyauth')

// Express.js Middleware
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


everyauth.debug = true
everyauth.twitter
  .consumerKey(TWITTER_CONSUMER_KEY)
  .consumerSecret(TWITTER_CONSUMER_SECRET)
  .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
    var promise = this.Promise()
    process.nextTick(function () {
      if (twitterUserMetadata.screen_name === 'azat_co') {
        session.user = twitterUserMetadata
        session.admin = true
      }
      promise.fulfill(twitterUserMetadata)
    })
    return promise
    // return twitterUserMetadata
  })
  .redirectPath('/admin')

// We need it because otherwise the session will be kept alive
everyauth.everymodule.handleLogout(routes.user.logout)

everyauth.everymodule.findUserById(function (user, callback) {
  callback(user)
})

const app = express()
app.locals.appTitle = 'blog-express'

// Expose collections to request handlers
app.use((req, res, next) => {
    if (!models.Article || !models.User) return next (new Error('No models in database.'))
    req.models = models
    return next()
})

// Express.js configurations
app.set('port', process.env.PORT || 8000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(session({secret: 'cat', 
  resave: true,
  saveUninitialized:true}))

// Authentication middleware
app.use((req, res, next) => {
  if (req.session && req.session.admin) {
  res.locals.admin = true
  }
  next()
})

// Authorization middleware
const authorize = (req, res, next) =>{
  if (req.session && req.session.admin)
    return next()
  else
    return res.status(401).send()  
}

if (app.get('env') === 'development') {
  app.use(errorHandler('dev'))
}
//  PAGES & ROUTES  
app.get('/', routes.index)
app.get('/login', routes.user.login)
app.post('/login', routes.user.authenticate)
app.get('/logout', routes.user.logout)
app.get('/admin', authorize, routes.article.admin)
app.get('/post', authorize, routes.article.post)
app.post('/post', authorize, routes.article.postArticle)
app.get('/articles/:slug', routes.article.show)

//REST API ROUTES
app.all('/api', authorize)
app.get('/api/articles', routes.article.list)
app.post('/api/articles', routes.article.add)
app.put('/api/articles/:id', routes.article.edit)
app.delete('/api/articles/:id', routes.article.del)

app.all('*', (req, res) => {
  res.status(404).send()

})

const server = http.createServer(app)
const boot = function () {
  server.listen(app.get('port'), function () {
    console.info(`Express server listening on port ${app.get('port')}`)
  })
}
const shutdown = function () {
  server.close(process.exit)
}
if (require.main === module) {
  boot()
} else {
  console.info('Running app as a module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = app.get('port')
}