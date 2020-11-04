const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { Book, Author } = require('./library-schema')

const services = require('./service')

services.connect()

const action = async () => {
  await services.reset()
  await services.setData()
}

action()

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: String!
    genres: [String]
  }

  type Author {
    name: String!
    id: String!
    born: String
    bookCount: Int
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allAuthors: [Author]
    allBooks(author: String, genre: String): [Book]
  }

  type Mutation {
    addBook(
      title: String
      author: String
      published: Int
      genres: [String]
    ): Book

    editAuthor(name: String, setBornTo: Int): Author
  }
`

const resolvers = {
  Author: {
    bookCount: async (root) => {
      const count = await Book.find({
        author: { name: root.name },
      }).estimatedDocumentCount()
      return count
    },
  },
  Query: {
    bookCount: async () => {
      const count = await Book.find({}).estimatedDocumentCount()
      return count
    },
    authorCount: async () => {
      const count = await Author.find({}).estimatedDocumentCount()
      return count
    },
    allAuthors: () => Author.find({}),

    allBooks: async (root, arg) => {
      let response = []
      let query = Book.find()

      if (arg.author) {
        const author = await Author.findOne({ name: arg.author })
        query.where('author').eq(author.id)
      }
      if (arg.genre) {
        query.where('genres').in(arg.genre)
      }
      response = await query.populate('author').exec()
      return response
    },
  },

  Mutation: {
    addBook: async (root, arg) => {
      let author
      let response = null

      try {
        author = await Author.findOne({ name: arg.author })
        if (!author) {
          author = await new Author({ name: arg.author }).save()
        }
        const book = new Book({ ...arg, author: author._id })
        const bookSaved = await book.save()
        response = await Book.findById(bookSaved._id).populate('author')

      }
      catch(error){
        const { name, errors } = error

        if (errors['name']) {
          throw new UserInputError(errors['name'].kind, { invalidsArgs: `${name} invalid name` })
        }
        if (errors['title']){

          throw new UserInputError(errors['title'].kind, { invalidsArgs: `${name}: invalid title` })
        }


      }

      return response
    },

    editAuthor: async (root, { name, setBornTo }) => {
      const response = await Author.findOneAndUpdate(
        { name: name },
        { born: setBornTo },
        { new: true }
      )
      return response
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
