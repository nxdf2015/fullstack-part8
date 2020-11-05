const { ApolloServer, gql, UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { SECRET } = require('./config')
const { Book, Author, User } = require('./library-schema')

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allAuthors: [Author]
    allBooks(author: String, genre: String): [Book]
    me: User
  }

  type Mutation {
    addBook(
      title: String
      author: String
      published: Int
      genres: [String]
    ): Book

    editAuthor(name: String, setBornTo: Int): Author

    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Author: {
    bookCount: (root) =>
      Book.find({
        author: { name: root.name },
      }).estimatedDocumentCount(),
  },
  Query: {
    bookCount: async () => Book.find({}).estimatedDocumentCount(),

    authorCount: async () => Author.find({}).estimatedDocumentCount(),

    allAuthors: () => Author.find({}),

    allBooks: async (root, arg) => {
      let query = Book.find()

      if (arg.author) {
        const author = await Author.findOne({ name: arg.author })
        query.where('author').eq(author.id)
      }
      if (arg.genre) {
        query.where('genres').in(arg.genre)
      }
      return query.populate('author').exec()
    },

    me: async (root, arg, context) => context.currentUser,
  },

  Mutation: {
    addBook: async (root, arg, context) => {
      if (!context.currentUser) return null
      let author
      let response = null

      try {
        author = await Author.findOne({ name: arg.author })
        if (!author) {
          author = await new Author({ name: arg.author }).save()
        }
        const book = new Book({ ...arg, author: author._id })
        const bookSaved = await book.save()

        return Book.findById(bookSaved._id).populate('author')
      } catch (error) {
        const { name, errors } = error

        if (errors['name']) {
          throw new UserInputError(errors['name'].kind, {
            invalidsArgs: `${name} invalid name`,
          })
        }
        if (errors['title']) {
          throw new UserInputError(errors['title'].kind, {
            invalidsArgs: `${name}: invalid title`,
          })
        }
      }

      return response
    },

    editAuthor: (root, { name, setBornTo }, context) =>
      context.currentUser
        ? Author.findOneAndUpdate(
          { name: name },
          { born: setBornTo },
          { new: true }
        )
        : null,

    createUser: (root, { username, favoriteGenre }) =>
      new User({ username, favoriteGenre }).save().catch((error) => {
        throw new UserInputError(error.name)
      }),

    login: async (root, { username }) => {
      const user = await User.findOne({ username: username })
      let token
      if (user) {
        console.log(SECRET)
        token = jwt.sign({ username, id: user._id }, SECRET)
      }
      return { value: token }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    if (req && req.headers.authorization) {
      const token = req.headers.authorization.substring(7)
      const currentUser = jwt.verify(token, SECRET)

      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
