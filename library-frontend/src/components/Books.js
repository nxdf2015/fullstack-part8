import React,{ useEffect, useState } from 'react'
import { useQuery,useLazyQuery } from '@apollo/client'

import { ALL_BOOKS ,GENRES ,ALL_BOOKS_BY_GENRES  } from '../query'

import  Table from './Table'
const Books = (props) => {
  let  query = useQuery(ALL_BOOKS)
  const genres=useQuery(GENRES)
  const [data ,setData] = useState([])

  const [ filterByGenre , resultFilter ] = useLazyQuery(ALL_BOOKS_BY_GENRES)

  useEffect(() => {
    if (!query.loading && query.data)
      setData(query.data.allBooks)
  },[query.loading])



  useEffect(() => {
    if (resultFilter.called && !resultFilter.loading){
      setData(resultFilter.data.allBooks)
    }

  },[resultFilter])

  if (!props.show || query.loading ) {
    return null
  }

  const handlerFilter = (value) => {
    if (resultFilter.called)
      resultFilter.refetch()
    filterByGenre({ variables:{ genre : value } })

  }


  return (
    <div>

      <h2>books</h2>
      {!query.loading &&
     <Table  data={data}/>


      }
      <div style={{ display:'flex' }}>
        { !genres.loading && genres.data.allGenres.map((value,i) => <button key={i} onClick={() => handlerFilter(value)}>{value}</button> )}

      </div>
      <button onClick={() => {
        query.refetch().then(response => { if (! response.loading)setData(response.data.allBooks)})
      }
      }>all books</button>
    </div>
  )
}

export default Books