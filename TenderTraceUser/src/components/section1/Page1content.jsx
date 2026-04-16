import React from 'react'
import Leftcontent from './Leftcontent'
import Rightcontent from './Rightcontent'
const Page1content = () => {
  return (
    <div className='flex py-6 items-center justify-between gap-5 h-[85vh] px-18'>
        <Leftcontent />
        <Rightcontent />
    </div>
  )
}

export default Page1content
