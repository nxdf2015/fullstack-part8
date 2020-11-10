import React  from 'react'

const Notification = ({ message ,visible, setVisible }) => {


  if (!message){
    return null
  }
  else {
    setTimeout(() => setVisible(false),2000)

  }
  return  visible && <div style={{ padding: '5px' ,border:'2px solid ',background:'lightblue' }}>{message}</div>
}

export default Notification