import React from 'react'
import { useQuery } from '@apollo/client'

import { ME,ALL_BOOKS } from '../query'
import FilterTable from './Filter'

const Recommend = ({ show,notify }) => {
  const user = useQuery(ME,{ onError: (error) => notify(error) })
  const query = useQuery(ALL_BOOKS)
  if (!show || user.loading || query.loading ){
    return null
  }
  return (<div>
    <h2>recommendations</h2>
      books in your favorite genre <strong>{user.data.me.favoriteGenre}</strong>
    <FilterTable data={query.data.allBooks} filter={user.data.me.favoriteGenre}/>


  </div>)
}

export default Recommend