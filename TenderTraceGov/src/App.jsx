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
import ConstructorProjectSpace from "./pages/cons/ConstructorProjectSpace";


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ✅ Public Pages WITH Navbar + Footer */}
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

        {/* ✅ Dashboard Pages (NO Navbar BUT WITH Footer) */}
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
        <Route
          path="/constructor-project/:id"
          element={<ConstructorProjectSpace />

          } />
      </Routes>

    </BrowserRouter>
  )
}

export default App