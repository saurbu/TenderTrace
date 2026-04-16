import React from 'react'
import Page1content from './Page1content'

const Section1 = (props) => {
  return (
    <div className='h-screen w-full'>
      <Page1content users={props.users} />
    </div>
  )
}

export default Section1
