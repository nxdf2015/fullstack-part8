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
    born:Int
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
    allGenres: [String]
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

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Author: {
    bookCount:   (root) =>   Book.find({ author: root._id }).countDocuments()

  },
  Query: {
    bookCount: async () => Book.find().estimatedDocumentCount(),

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

    me: async (root, arg, context) => {
      const user = context.currentUser
      console.log(user)
      if (!user){
        throw new UserInputError('not logged',{ message:'you must logged' })
      }
      return user
    },

    allGenres:() =>  Book.find({} ,{ genres : 1 } )
      .then(data => data.reduce((acc,{ genres }) => [...acc,...genres  ] , [] ))
      .then(data => [...new Set(data)])
  },

  Mutation: {
    addBook: async (root, arg, context) => {
      if ( context.currentUser) {
        return services.addBook(arg)}

      else {
        throw new UserInputError('not logged',{ message : 'forbiden : you must logged in to add a book'  })
      }


    },

    editAuthor:  (root, { name, setBornTo }, context) =>  {
      if (context.currentUser){
        Author.findOneAndUpdate(
          { name: name },
          { born: setBornTo },
          { new: true })
      }
      else  {
        throw new UserInputError('not logged',{ message : 'forbiden : you must logged in to update data' })
      }
    }
    ,

    createUser: (root, { username, favoriteGenre }) =>
      new User({ username, favoriteGenre }).save().catch((error) => {
        throw new UserInputError(error.name)
      }),

    login: async (root, { username }) => {
      const user = await User.findOne({ username: username })

      let token
      if (user) {
        token = jwt.sign( { username:user.username,favoriteGenre:user.favoriteGenre }, SECRET)
      }
      return { value: token }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let currentUser = null
    if (req && req.headers.authorization) {
      const token = req.headers.authorization.substring(7)
      currentUser = jwt.verify(token, SECRET)

    }
    return { currentUser  }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
