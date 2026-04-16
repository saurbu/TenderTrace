import React from 'react'

const Rightcardcontent = (props) => {
  return (
    <div>
      <div className='absolute top-0 left-0 h-full w-full p-6 flex flex-col justify-between'>
        
        <h2 className='bg-white rounded-full text-2xl font-semibold h-10 w-10 flex justify-center items-center'>
          {props.id + 1}
        </h2>

        <div>
          <p className='text-lg leading-relaxed text-white mb-12'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>

          <div className='flex justify-between'>
            <button className='bg-blue-700 text-white px-7 py-2 rounded-full'>
              {props.tag}
            </button>

            <button className='bg-blue-700 text-white px-3 py-2 rounded-full cursor-pointer '>
              →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Rightcardcontent