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

    editAuthor: (root, { name, setBornTo }) =>
      Author.findOneAndUpdate(
        { name: name },
        { born: setBornTo },
        { new: true }
      ),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
