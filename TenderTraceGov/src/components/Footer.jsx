import React from 'react'

const Footer = () => {
  return (
    <div>
      <div className='flex' >
        <div className='flex w-1/5 items-center justify-between px-18 py-6 h-[300px]'>
          <h4 className='bg-black  text-white uppercase rounded-full px-8 py-2'>TenderTrace</h4>
        </div>
        <div className='w-1/5 p-6 '>
          <p className='text-gray-700 text-4xl font-semibold mb-10 '>Contact Details </p>
          <ul className='p-1 decoration-0 ml-4'>
            <li className='text-lg'><span className='text-blue-400 cursor-pointer text-lg'>support@tendertrace.gov<i className="ri-arrow-right-up-line"></i></span></li>
            <li className='text-xl'>Location: <span className='text-lg'>India</span></li>
            <li className='text-lg cursor-pointer'>Help/Support<i className="ri-arrow-right-up-line text-blue-400"></i></li>

          </ul>
        </div>
        <div className='w-1/5 p-6 '>
          <p className='text-gray-700 text-4xl font-semibold mb-10 '>Key Features</p>
          <ul className=' text-xl p-2 ml-4'>
            <li>Attendence Tracking</li>
            <li>Material Varification</li>
            <li>Express Monitoring</li>
            <li>Progress Tracking</li>
            <li>Fraud Detection</li>

          </ul>
        </div>
        <div className='w-1/5 p-6 '>
          <p className='text-gray-700 text-4xl font-semibold mb- '>Transparency Section</p>
          <ul className=' text-xl p-2 ml-4'>
            <li>Public Dashboard</li>
            <li>Report Corruption</li>
            <li>Open Data Access</li>

          </ul>
        </div>
        <div className='w-1/5 p-6 '>
          <p className='text-gray-700 text-4xl font-semibold mb-10 '>Legal / Info</p>
          <ul className=' text-xl p-2 ml-4'>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>

          </ul>
        </div>

        

      </div>
      <h2 className='h-10 text-xl text-center bg-gray-400 py-1'>© 2026 TenderTrace</h2>
    </div>
  )
}

export default Footer
