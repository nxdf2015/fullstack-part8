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
  bookCount: {
    type:Number
  },
  born: {
    type: Number,
  },
})


const schemaUser = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },

  favoriteGenre:{
    type:String,
    required:true
  }
})

schemaAuthor.plugin(uniquePlugin)
schemaBook.plugin(uniquePlugin)
schemaUser.plugin(uniquePlugin)

const Book = mongoose.model('Book', schemaBook)
const Author= mongoose.model('Author', schemaAuthor)
const User= mongoose.model('User',schemaUser)

module.exports={ Book, Author ,User }