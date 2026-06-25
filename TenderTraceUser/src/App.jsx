import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Section1 from './components/section1/Section1'
import Section2 from './components/section2/Section2'
import Section3 from './components/section3/Section3'
import Footer from './components/footer/Footer'
import Navbar from './components/Navbar'
import About from './components/about/About'
import StateTenders from './components/state/StateTenders'
import ProjectDetails from "./pages/ProjectDetails";

const Home = () => {

  const [tenders, setTenders] = React.useState([])
  const [bills, setBills] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {

    const fetchData = async () => {

      try {
        setLoading(true)

        const tenderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/tenders/all`)
        const tenderData = await tenderRes.json()

        const billRes = await fetch(`${import.meta.env.VITE_API_URL}/api/bills/all`)
        const billData = await billRes.json()

        if (tenderData.success) setTenders(tenderData.data)
        else setTenders([])

        if (billData.success) setBills(billData.data)
        else setBills([])

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, [])

  return (
    <>
      <Section1 />

      <Section2 tenders={tenders} />

      <Section3
        tenders={tenders}
        bills={bills}
        loading={loading}
      />
    </>
  )
}

const App = () => {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/state/:stateName" element={<StateTenders />} />
        <Route path="/projects/:id" element={<ProjectDetails />}
/>
      </Routes>

      <Footer />

    </Router>
  )
}

export default App