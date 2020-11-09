import React from 'react'
import Table from './Table'

const Filter = ({ filter,data }) => {

  const dataFilter = filter === '' ? data : data.filter(d => d.genres.includes(filter))
  return <Table data={dataFilter}/>
}

export default Filter