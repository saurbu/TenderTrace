import React from 'react'
import 'remixicon/fonts/remixicon.css'
import Hero from './HeroText'
import Arrow from './Arrow'
const leftcontent = () => {
  return (
    <div className='w-1/3 flex flex-col justify-between h-full' >
        <Hero />
        <Arrow/>
    </div>
  )
}

export default leftcontent
