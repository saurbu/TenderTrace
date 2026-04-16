import React from 'react'

const About = () => {
  return (
    <div>
      <div className='px-40 '>
        <h2 className='text-3xl pt-12 font-bold'>About TenderTrack</h2>
        <div className='text-gray-700'>
          
          <div className='px-8'>
            <p className='text-2xl pt-8'> <span className='font-bold '>TenderTrack </span>is a smart transparency platform designed to eliminate corruption in public infrastructure projects. With nearly ₹15 lakh crore spent annually on government tenders, a large portion is lost due to fraud, poor monitoring, and lack of accountability.</p>
            <p className='text-2xl pt-5 '>TenderTrack solves this by creating a real-time, tamper-proof system that tracks every stage of a project—from workforce verification to material quality and fund release.</p>
          </div>
          <div className='text-2xl pt-8 px-8'>
            <p>A dedicated <span className='text-3xl font-bold'>Citizen Portal </span>empowers people to:</p>
            <ul className='list-disc px-8 pt-3'>
              <li>Track tenders in their area</li>
              <li>View budgets and project progress</li>
              <li>Raise complaints on specific tenders if they detect fraud or irregularities</li>
            </ul>
            <p className='text-2xl pt-3 '>This ensures direct public participation and accountability, making the entire system transparent and trustworthy.</p>
          </div>
          <div className='text-2xl p-8 py-8 '>
            <p> <span className='font-bold'>Our mission: </span>Turn the “black hole” of corruption into a system where every rupee is tracked and every project is built with integrity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
