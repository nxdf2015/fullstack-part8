import { ApolloClient,HttpLink,InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const uri = 'http://localhost:4000'

const authLink=setContext((_,{ headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers:{
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const httpLink = new HttpLink({
  uri
})

const client = new ApolloClient({
  link : authLink.concat(httpLink),
  cache:new InMemoryCache()
})


export default client