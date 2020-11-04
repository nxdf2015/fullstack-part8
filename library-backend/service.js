const mongoose = require('mongoose')

const { books, authors } = require('./data')
const { Book, Author } = require('./library-schema')

const url =
  'mongodb+srv://admin:admin@cluster0.llwdf.mongodb.net/library?retryWrites=true&w=majority'

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

const connect = async () => await mongoose.connect(url, options)

module.exports = { setData, reset, connect }
