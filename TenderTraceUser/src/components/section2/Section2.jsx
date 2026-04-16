import React from 'react'
import Rightcard from './Rightcard'

const Section2 = (props) => {
  return (
    <div id="live-projects" className='w-full px-4 md:px-18 py-10 scroll-mt-20 overflow-hidden'>
      <div className="flex justify-between items-end mb-12">
        <h4 className='text-4xl md:text-6xl font-bold text-gray-900'>Ongoing Projects</h4>
        <p className="text-gray-500 font-medium hidden md:block italic">Hover to pause • Click to explore</p>
      </div>

      <div className='relative overflow-hidden py-10'>
        <div className='flex marquee-container'>
          <div className="flex gap-8 marquee-content">
            {props.users.map((elem, idx) => (
              <div key={`original-${idx}`} className='flex-shrink-0'>
                <Rightcard id={elem.id} img={elem.img} tag={elem.tag} desc={elem.desc} serialNumber={idx + 1} />
              </div>
            ))}
            {/* Duplicating for seamless loop */}
            {props.users.map((elem, idx) => (
              <div key={`duplicate-${idx}`} className='flex-shrink-0'>
                <Rightcard id={elem.id} img={elem.img} tag={elem.tag} desc={elem.desc} serialNumber={idx + 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section2