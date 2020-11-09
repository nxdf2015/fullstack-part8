import React,{ useState,useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../mutation'

const Login = ({ show ,setLogged ,showLogin }) => {
  const [login, { data }] = useMutation(LOGIN,{ onError:(error) => console.log(error.message) })
  const [username,setName] = useState('')
  const [password,setPassword] = useState('')

  useEffect(() => {
    if (data && data.login){
      localStorage.setItem('token',data.login.value)
      setLogged(true)
      showLogin(false)
    }
  },[data]) // eslint-disable-line
  const submit = e => {

    e.preventDefault()

    login({ variables:{
      username,
      password
    } })


  }

  if (!show)
    return null
  return  (<div>
    <form onSubmit={submit}>
      <label>
              username
        <input type="text" name="username" value={username} onChange={e => setName(e.target.value)} />
      </label>
      <label>
              password
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}/>
      </label>
      <input type="submit" value="login"/>
    </form>
  </div>)}

export default Login