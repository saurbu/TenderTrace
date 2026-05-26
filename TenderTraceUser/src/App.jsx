import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Section1 from './components/section1/Section1'
import Section2 from './components/section2/Section2'
import Section3 from './components/section3/Section3'
import Footer from './components/footer/Footer'
import Navbar from './components/Navbar'
import ProjectDetails from './pages/ProjectDetails'
import About from './components/about/About'

// ✅ Home Page (your existing UI)
const Home = ({ users }) => {
  return (
    <>
      <Section1 />
      <Section2 users={users} />
      <Section3 />
    </>
  )
}

// ✅ Project Data
const projectsData = [
  {
    id: '1',
    img: 'https://images.unsplash.com/photo-1602757115429-b4190ae087be?w=600&auto=format&fit=crop&q=60',
    title: 'Smart City Infrastructure',
    tag: 'New Delhi',
    desc: 'Development of smart traffic management and integrated surveillance systems to reduce congestion and improve safety across the capital region.',
    cost: '₹450 Crores',
    timeline: '24 Months',
    status: 'In Progress'
  },
  {
    id: '2',
    img: 'https://images.unsplash.com/photo-1640459665989-20669a3b6446?w=600&auto=format&fit=crop&q=60',
    title: 'Coastal Road Expansion',
    tag: 'Mumbai',
    desc: 'Major expressway expansion along the western coastline to facilitate smoother transit and boost trade connectivity for the financial hub.',
    cost: '₹1200 Crores',
    timeline: '36 Months',
    status: 'Under Review'
  },
  {
    id: '3',
    img: 'https://plus.unsplash.com/premium_photo-1714674731179-2b9ee665fd44?w=687',
    title: 'Rural Electrification Phase II',
    tag: 'Underbanked',
    desc: 'Bringing modern power grids and renewable energy sources to over 200 remote villages, ensuring 24/7 electricity for education and healthcare.',
    cost: '₹320 Crores',
    timeline: '18 Months',
    status: 'Active'
  },
  {
    id: '4',
    img: 'https://plus.unsplash.com/premium_photo-1686244745026-98fc15ad3400?w=687',
    title: 'Green Energy Solar Park',
    tag: 'Satisfied',
    desc: 'Massive solar array installation aimed at reducing carbon footprint and providing sustainable energy alternatives for industrial sectors.',
    cost: '₹800 Crores',
    timeline: '30 Months',
    status: 'In Progress'
  },
  {
    id: '5',
    img: 'https://plus.unsplash.com/premium_photo-1661590867485-c67026a70bc7?w=600',
    title: 'High-Speed Railway Link',
    tag: 'Underserved',
    desc: 'Connecting secondary cities to the main economic zones with high-speed rail, reducing travel time by 60% and stimulating regional growth.',
    cost: '₹2500 Crores',
    timeline: '48 Months',
    status: 'Initial Phase'
  }
]

// ✅ Main App
const App = () => {
  const [activeProjects, setActiveProjects] = React.useState(projectsData)

  React.useEffect(() => {
    // Fetch from real govt backend database
    fetch('http://localhost:5000/api/tenders')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Map backend data to frontend project shapes
          const mappedData = data.map((tender, index) => ({
            id: tender.id || String(index + projectsData.length + 1),
            img: tender.img || 'https://images.unsplash.com/photo-1602757115429-b4190ae087be?auto=format&fit=crop&q=80',
            title: tender.tenderName || 'Government Infrastructure Project',
            tag: tender.locationInfo || 'India',
            desc: tender.description || 'Major infrastructure project aimed at public welfare and systemic upgrades.',
            cost: tender.budget || 'Not Disclosed',
            timeline: tender.timePeriod ? `${tender.timePeriod} Months` : 'TBD',
            status: tender.status || 'Active'
          }))
          // Merge to show real ones first, falling back to dummy ones if not enough
          setActiveProjects(mappedData.length > 2 ? mappedData : [...mappedData, ...projectsData])
        }
      })
      .catch(err => console.log('Backend unreachable, using fallback project data:', err))
  }, [])

  return (
    <Router>

      {/* Navbar always visible */}
      <Navbar />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home users={activeProjects} />} />
        <Route path="/about" element={<About />} />
        <Route path="/project/:id" element={<ProjectDetails projects={activeProjects} />} />
      </Routes>

      {/* Footer always visible */}
      <Footer />

    </Router>
  )
}

export default App