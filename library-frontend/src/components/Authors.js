import React, { useState } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../mutation'
import { ALL_AUTHORS } from '../query'



const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],onError: error => props.notify(error.name,error.message)
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors
  const customStyle = {
    option: (provided, state) => {
      return {
        ...provided,
        padding: 20,
        color: 'grey',
        backgroundColor: state.isSelected
          ? 'darkblue'
          : state.isFocused
            ? 'lightblue'
            : '',
      }
    },

    control: (provided) => ({ ...provided, width: 200, margin: 5 }),
  }
  const handlerEdit = (event) => {
    event.preventDefault()
    editAuthor({
      variables: {
        name,
        setBornTo: parseInt(born)
      },
    })
  }
  const handlerSelect = (event) => {
    const name = event.value
    setName(name)
    const author = authors.find((author) => author.name === name)
    if (author.born) {
      setBorn(author.born)
    } else {
      setBorn('')
    }
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
        onSubmit={handlerEdit}
      >
        <Select
          styles={customStyle}
          placeholder="select a name"
          name="name"
          onChange={handlerSelect}
          options={authors.map((author) => ({
            label: author.name,
            value: author.name,
          }))}
        />

        <label>
          born
          <input
            style={{ margin: 5 }}
            type="number"
            name="born"
            placeholder="enter a year"
            onChange={(e) => setBorn(e.target.value)}
            value={born}
          />
        </label>
        <input type="submit" value="update author" />
      </form>
    </div>
  )
}

export default Authors
