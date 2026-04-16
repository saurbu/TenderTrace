import React from 'react'
import Rightcard from './Rightcard'

const Section2 = (props) => {
  return (
    <div id="live-projects" className='h-screen w-full px-18 scroll-mt-24'>
            <h4 className='text-5xl py-5 font-semibold'>Ongoing Projects</h4>

      <div id='right' className='flex flex-nowrap gap-4 overflow-x-auto'>
        
        {props.users.map((elem, idx) => {
          return (
            <div key={idx} className='flex-shrink-0'>
              <Rightcard id={idx} img={elem.img} tag={elem.tag} />
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Section2