const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoskin = require('mongoskin')
const http = require('http')

// express instance
const app = express()

// Middleware 

app.set('port', process.env.Port || 3000)

app.use(bodyParser.json())
app.use(logger())


// Connecting to DB & Converting hex string into MongoDB objectID data type

const db = mongoskin.db('mongodb://@localhost:27017/blog')
const id = mongoskin.helper.toObjectID

// Middleware to do Something when URL pattern prefixed with colon

app.param('collection name', (req, res, next, collectionName) => {
    
    req.collection = db.collection(collectionName)
    return next()
})

// Routes

app.get('/', (req, res, next) => {
    res.send('Choose Collection Name, e.g, /collection/messages')
})

/*app.get('/:collection', (req, res, next) => {
    res.send(req.collection)
    console.log(req.collection)
    return next()
  })*/

app.get('/collections/:collectionName', (req, res, next) => {
    req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray((error, result) => {
        if(error) return next(error)
        res.send(result)
        console.log(result)
    })
})

app.post('/collections/:collectionName', (req, res, next) => {
    // TODO: Validate req.body
    req.collection.insert(req.body, {}, (e, results) => {
      if (e) return next(e)
      res.send(results.ops)
    })
  })

app.get('/collections/collectionName/:id', (req, res, next) => {
    req.collection.findOne({_id: id(req.params.id)}, (e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.put('/collections/collectionName/:id', (req, res, next) => {
    req.collection.update({_id: id(req.params.id)}, {$set: req.body},
    {safe: true, multi: false},(e, results) => {
        if (e) return next(e)
        res.send((result.result.n === 1 ) ? {msg: 'success'} : {msg: 'error'})      
    })
})

app.delete('/collections/:collectionName/:id', (req, res, next) => {
    req.collection.remove({_id: id(req.params.id)}, (e, result) => {
      if (e) return next(e)
      // console.log(result)
      res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
  })

  const server = http.createServer(app)
  const boot = () => {
      server.listen(app.get('port'), () => {
          console.info(`Express Server listening on port ${app.get('port')}`)
      })
  }

  const shutdown = () => {
      server.close(process.exit)
  }

  if (require.main === module) {
      boot()
  } else {
      console.log('Running app as module')
      exports.boot = boot
      exports.shutdown = shutdown
      exports.port = app.get('port')
  }