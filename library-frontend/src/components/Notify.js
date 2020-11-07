import React from  'react'


const Notify = (props ) => {
  console.log(props)
  setTimeout(() => props.resetNotification() , 2000)
  if (!props.visible){
    return null
  }
  return   <div style={{ border: '2px solid red' }}>{props.message} </div>
}

export default Notify