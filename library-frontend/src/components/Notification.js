import React  from 'react'

const Notification = ({ message ,visible, setVisible }) => {


  if (!message){
    return null
  }
  else {
    setTimeout(() => setVisible(false),2000)

  }
  return  visible && <div>{message}</div>
}

export default Notification