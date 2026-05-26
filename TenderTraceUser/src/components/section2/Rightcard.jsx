import React from 'react'
import { Link } from 'react-router-dom'
import Rightcardcontent from './Rightcardcontent'

const Rightcard = (props) => {
  return (
    <Link to={`/project/${props.id}`} className='block w-72 h-full rounded-4xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl'>
      <img className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110' src={props.img} alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <Rightcardcontent id={props.id} tag={props.tag} desc={props.desc} serialNumber={props.serialNumber}/>
    </Link>
  )
}

export default Rightcard
