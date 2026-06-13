import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'remixicon/fonts/remixicon.css'

import Navbar from './components/Navbar'
import Footer from './components/footer'

import Home from './components/Home'
import GovernmentLogin from './pages/govt/GovernmentLogin'
import ConstructorLogin from './pages/cons/ConstructorLogin'

import GovDashboard from './pages/govt/GovDashboard'
import ConstructorDashboard from './pages/cons/ConstructorDashboard'
import ConstructorProjectSpace from "./pages/cons/ConstructorProjectSpace"
import WorkerDetails from './pages/cons/WorkerDetails'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />

        <Route path="/gov-login" element={
          <>
            <Navbar type="Gov" />
            <GovernmentLogin />
            <Footer />
          </>
        } />

        <Route path="/constructor-login" element={
          <>
            <Navbar type="Constructor" />
            <ConstructorLogin />
            <Footer />
          </>
        } />


        <Route path="/gov-dashboard" element={
          <>
            <GovDashboard />
            <Footer />
          </>
        } />

        <Route path="/constructor-dashboard" element={
          <>
            <ConstructorDashboard />
            <Footer />
          </>
        } />

        <Route path="/constructor-project/:id" element={
          <>
          <ConstructorProjectSpace />
          <Footer />
          </>
        } />


        <Route path="/worker-details/:id" element={
          <>
            <WorkerDetails />
            <Footer /> 
          </>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App