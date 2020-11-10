import { ApolloClient,HttpLink,InMemoryCache,split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
const uri = 'http://localhost:4000'
const ws = 'ws://localhost:4000/graphql'

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


const wsLink = new WebSocketLink({
  uri: ws,
  options: {
    reconnect: true
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)



const client = new ApolloClient({
  link : splitLink,
  cache:new InMemoryCache()
})


export default client