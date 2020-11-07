
import React, {   useEffect, useState } from 'react'

import { useQuery,useMutation, useApolloClient } from '@apollo/client'

import { ALL_AUTHORS ,ALL_BOOKS } from './query'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notify'

import { LOGIN_USER } from './query'
const App = () => {
  const [page, setPage] = useState('authors')
  const [token , setToken] = useState(null)
  const [showForm , setShowForm] = useState(false)
  const [notification , setNotification] =useState({ visible:false })

  const [login , { data }] = useMutation(LOGIN_USER)
  const client = useApolloClient()
  let result = useQuery(page === 'authors' ? ALL_AUTHORS : ALL_BOOKS,{ onError: error => {console.log(error.name)} })

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token)
  },[]) // eslint-disable-line

  let items = []

  useEffect(() => {
    if (data && data.login && data.login.value){
      localStorage.setItem('token',data.login.value)
      setToken(data.login.value)
    }
  },[data])

  if (page === 'authors' && !result.loading) {
    items = result.data.allAuthors
  }
  else if (page === 'books' && !result.loading){
    items = result.data.allBooks
  }

  const handleLog = () => {
    if (!token){
      setShowForm(!showForm)
    }else {
      localStorage.clear()
      client.clearStore()
      setToken(null)
      setPage('authors')

    }
  }
  const submit = (arg) => {
    console.log(arg)
    login({ variables:arg })
    setShowForm(false)

  }
  const notify = (type,message) => {
    setNotification({ type,message,visible:true })
  }

  const resetNotification = () => setNotification({ visible : false })



  return (
    <div>

      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      {  token &&   <button onClick={() => setPage('add')}>add book</button>}
      <button onClick={handleLog}>{token? 'logout': 'login' }</button>

      <LoginForm visible={showForm} submit={submit}/>




      {notification.visible && <Notification {...notification} resetNotification={resetNotification}/>}




      <Authors
        authors={items }
        show={page === 'authors'}

      />

      <Books
        books={items }
        show={page === 'books'}
        notify={notify}
      />

      <NewBook
        setPage={setPage}
        show={page === 'add'}
        notify={notify}
      />

    </div>
  )
}

export default App