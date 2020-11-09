const mongoose = require('mongoose')
const  { UserInputError } = require('apollo-server')
const { books, authors } = require('./data')
const { Book, Author } = require('./library-schema')
const { MONGO_URI } = require('./config')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

const setData = async () => {
  const data = authors.map(({ name, born }) => new Author({ name, born }))
  const savedAuthors = await Promise.all(data.map((d) => d.save()))

  const booksDB = books.map((book) => {
    const author_id = savedAuthors.find(
      (author) => author.name === book.author
    )
    return new Book({ ...book, author: author_id })
  })

  await Promise.all(booksDB.map((b) => b.save()))
}

const reset = async () => {
  try {
    await Book.deleteMany({})
    await Author.deleteMany({})
  } catch (error) {
    console.log(error.name)
  }
}

const connect = async () => await mongoose.connect(MONGO_URI, options)

const addBook = async (arg ) => {
  // const session = await mongoose.startSession()
  // session.startTransaction()

  try {
    let  author = await Author.findOne({ name: arg.author } )

    if (!author) {
      author = await new Author({ name: arg.author } ).save()
    }
    const book = new Book({ ...arg, author: author._id } )
    const bookSaved = await book.save()
    // session.endSession()
    return Book.findById(bookSaved._id).populate('author')
  } catch (error) {
    //  session.abortTransaction()
    const { name, errors } = error

    if (errors['name']) {
      throw new UserInputError(`name : ${errors['name'].kind}`, {
        invalidsArgs: `${name} invalid name`,
      })
    }
    if (errors['title']) {
      throw new UserInputError(`title : ${errors['title'].kind}`, {
        invalidsArgs: `${name}: invalid title`,
      })
    }
  }
}

module.exports = { setData, reset, connect ,addBook }
