
import React, { useEffect, useState  } from 'react'
import { useSubscription ,useApolloClient } from '@apollo/client'

import { BOOK_ADDED } from './subscription'
import { ALL_BOOKS } from './query'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import Notification from './components/Notification'

const App = () => {
  const [page, setPage] = useState('authors')
  const [showLogin,setShowLogin]=useState(false)
  const [isLogged , setLogged] = useState(false)
  const [ message , setMessage] = useState('')
  const [visible,setVisible] = useState(false)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED,{
    onSubscriptionData : ({ subscriptionData }) => {

      const data = subscriptionData.data.bookAdded
      notify({ message : `a new book ${data.title } by ${data.author.name} added ` })
      const dataInStore = client.readQuery({ query : ALL_BOOKS })
      if (!dataInStore.allBooks.find(book => book.title === data.title)){
        client.writeQuery({ query : ALL_BOOKS,
          data : {
            ...dataInStore,
            allBooks:[
              ...dataInStore.allBooks,
              data
            ]
          } })
      }
    }
  })
  useEffect(() => {
    if (localStorage.getItem('token'))
      setLogged(true)
  },[])


  const handlerLogin = () => {
    if (isLogged){
      localStorage.clear()
      setLogged(false)
      setShowLogin(false)
    }
    else {
      setShowLogin(true)
    }
  }

  const notify = data => {
    setMessage(data.message)
    setVisible(true)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {isLogged && <button onClick={() => setPage('recommend')}>recommend</button>}
        {isLogged && <button onClick={() => setPage('add')}>add book</button>}
        <button onClick={handlerLogin}>{isLogged ? 'logout' : 'login'}</button>
        <Login showLogin={setShowLogin} setLogged={setLogged} show={ showLogin} />
      </div>

      <Notification message={message} visible={visible} setVisible={setVisible}/>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
        notify={notify}
      />

      <NewBook
        show={page === 'add'}
        home={() => setPage('books') }
        notify={notify}
      />

      <Recommend show={page==='recommend'} notify={notify}/>

    </div>
  )
}

export default App