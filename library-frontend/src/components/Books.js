import React,{ useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS ,GENRES   } from '../query'

import FilterTable from './Filter'
const Books = (props) => {
  const query = useQuery(ALL_BOOKS)
  const genres=useQuery(GENRES)

  const [genre,setGenre] = useState('')
  if (!props.show) {
    return null
  }


  return (
    <div>

      <h2>books</h2>
      {!query.loading &&
     <FilterTable filter={genre} data={query.data.allBooks}/>


      }
      <div style={{ display:'flex' }}>
        { !genres.loading && genres.data.allGenres.map((value,i) => <button key={i} onClick={() => setGenre(value)}>{value}</button> )}

      </div>
      <button onClick={() => setGenre('')}>reset filter</button>
    </div>
  )
}

export default Books