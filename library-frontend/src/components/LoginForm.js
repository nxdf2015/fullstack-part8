import React from 'react'

const LoginForm = ({ visible,  submit }) => {
  if(!visible){
    return null }

  return(
    <form
      onSubmit={( event) => {
        event.preventDefault()
        submit({ username:event.target.username.value, password:event.target.password.value })}
      }
    >
      <label>
      username
        <input type="text" name="username"/>
      </label>
      <label>
      password
        <input type="password" name="password" />
      </label>
      <button type="submit">login</button>
    </form>
  )}


export default LoginForm