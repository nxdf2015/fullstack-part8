
import React, {   useState } from 'react'

import { useQuery } from '@apollo/client'

import { ALL_AUTHORS ,ALL_BOOKS } from './query'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')


  let result = useQuery(page === 'authors' ? ALL_AUTHORS : ALL_BOOKS)

  let data = []


  if (page === 'authors' && !result.loading) {
    data = result.data.allAuthors
  }
  else if (page === 'books' && !result.loading){
    data = result.data.allBooks
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        authors={data }
        show={page === 'authors'}
      />

      <Books
        books={data }
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App