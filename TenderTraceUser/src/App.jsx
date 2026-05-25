import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Section1 from './components/section1/Section1'
import Section2 from './components/section2/Section2'
import Section3 from './components/section3/Section3'
import Footer from './components/footer/Footer'
import Navbar from './components/Navbar'
import About from './components/about/About' // ✅ correct path

// ✅ Home Page (your existing UI)
const Home = () => {
  const users = [
    {
      img: 'https://images.unsplash.com/photo-1602757115429-b4190ae087be?w=600&auto=format&fit=crop&q=60',
      intro: '',
      tag: 'New Delhi'
    },
    {
      img: 'https://images.unsplash.com/photo-1640459665989-20669a3b6446?w=600&auto=format&fit=crop&q=60',
      intro: '',
      tag: 'Mumbai'
    },
    {
      img: 'https://plus.unsplash.com/premium_photo-1714674731179-2b9ee665fd44?w=687',
      intro: '',
      tag: 'Underbanked'
    },
    {
      img: 'https://plus.unsplash.com/premium_photo-1686244745026-98fc15ad3400?w=687',
      intro: '',
      tag: 'Satisfied'
    },
    {
      img: 'https://plus.unsplash.com/premium_photo-1661590867485-c67026a70bc7?w=600',
      intro: '',
      tag: 'Underserved'
    }
  ]

  return (
    <>
      <Section1  />
      <Section2 users={users} />
      <Section3 /> 
    </>
  )
}

// ✅ Main App
const App = () => {
  return (
    <Router>

      {/* Navbar always visible */}
      <Navbar />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* Footer always visible */}
      <Footer />

    </Router>
  )
}

export default App