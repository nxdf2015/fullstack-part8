import React from 'react'
import { ALL_GENRES } from '../query'

import { useQuery } from '@apollo/client'
const Books = (props) => {
  const getGenres= useQuery(ALL_GENRES)
  let genres=[]
  if (!getGenres.loading){
    genres = getGenres.data.allGenres
  }
  if (!props.show) {
    return null
  }

  const books = props.books
  const filterByGenre = (event) => {
    console.log(event.target.dataset.name)
  }
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>

            <th>name</th>
            <th>born</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.author.born}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display:'flex' ,justifyContent:'flex-start' }}>
        {genres.map((genre,i) => (<button data-name={genre}  key={i}onClick={filterByGenre}>{genre}</button>))}

      </div>
    </div>
  )
}

export default Books
