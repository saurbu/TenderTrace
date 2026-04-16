import React from 'react'
import Rightcardcontent from './Rightcardcontent'

const Rightcard = (props) => {
  return (
    <div className='w-72 h-full rounded-4xl relative overflow-hidden'>
      <img className='h-full w-full object-cover' src={props.img} alt="" />
      <Rightcardcontent id={props.id} tag={props.tag}/>
    </div>
  )
}

export default Rightcard
