const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', {useMongoClient: true})
mongoose.Promise = global.Promise

const bookSchema = mongoose.Schema({
    name: String,
    author: String,
    publishedDate: Date
})

const Book = mongoose.model('Book', bookSchema)

const practicalBook = new Book({
    name: 'Practical Node Book by azat Mardan',
    author: 'Azat Mardan',
    publishedDate: Date.now(),
    publisher: 'Awais publishers'
})

practicalBook.save((err, result) => {
if (err) {
    console.error(err) 
    process.exit(1)
} else {
    console.log(`Saved: ${result}`)
    process.exit(0)
}
})