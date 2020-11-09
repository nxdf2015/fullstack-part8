import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS } from '../query'
import { EDIT_AUTHORS } from '../mutation'

const Authors = (props) => {
  const query = useQuery(ALL_AUTHORS)

  const [updateAuthor] = useMutation(EDIT_AUTHORS, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => props.notify(error ),
  })
  const [author, setUpdate] = useState({ born: '', name: '' })

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

    control: (provided) => ({ ...provided, width: 300, margin: 5 }),
  }

  const handlerSelect = (event) => {
    const name = event.value
    const author = query.data.allAuthors.find((author) => author.name === name)

    setUpdate({ born: author ? parseInt(author.born) : '', name })
  }

  const handlerUpdate = (event) => {
    event.preventDefault()
    const variables = { name: author.name, born: author.born }
    updateAuthor({ variables })
  }

  const updateBorn = (event) => {
    const born = parseInt(event.target.value)
    setUpdate((author) => ({ ...author, born }))
  }

  if (!props.show || query.loading) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      {!query.loading && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {!query.loading &&
              query.data.allAuthors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <h2>set birthyear</h2>
      <form
        style={{
          width: '50%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
        onSubmit={handlerUpdate}
      >
        <label>
          name
          <Select
            styles={customStyle}
            placeholder="select a name"
            name="name"
            onChange={handlerSelect}
            options={query.data.allAuthors.map((author) => ({
              label: author.name,
              value: author.name,
            }))}
          />
        </label>
        <label>
          born
          <input
            type="text"
            name="born"
            value={author.born}
            onChange={updateBorn}
          />
        </label>
        <input type="submit" value="update" />
      </form>
    </div>
  )
}

export default Authors
