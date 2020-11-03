import { ApolloClient,InMemoryCache,HttpLink } from '@apollo/client'

const uri = 'http://localhost:4000'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri
  })
})

export default client