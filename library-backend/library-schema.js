const mongoose = require('mongoose')
const uniquePlugin = require('mongoose-unique-validator')
const schemaBook = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String }
  ]
})



const schemaAuthor = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

schemaAuthor.plugin(uniquePlugin)
schemaBook.plugin(uniquePlugin)

const Book = mongoose.model('Book', schemaBook)
const Author= mongoose.model('Author', schemaAuthor)


module.exports={ Book, Author }