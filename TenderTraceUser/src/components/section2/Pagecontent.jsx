import React from 'react'
import Rightcard from './Rightcard'

const Pagecontent = ({ users }) => {
  return (
    <div className='flex gap-4'>
      
      {users.map((user, index) => (
        <Rightcard key={index} id={index} img={user.img} tag={user.tag} />
      ))}
    </div>
  )
}

export default Pagecontent