import React from 'react'
import { useNavigate } from 'react-router-dom'
import Rightcardcontent from './Rightcardcontent'

const Rightcard = (props) => {

  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/state/${props.tag}`)}
      className='w-72 h-[420px] rounded-3xl relative overflow-hidden flex-shrink-0 cursor-pointer'
    >
      <img
        className='h-full w-full object-cover'
        src={props.img}
        alt=""
      />

      <Rightcardcontent
        id={props.id}
        tag={props.tag}
      />
    </div>
  )
}

export default Rightcard