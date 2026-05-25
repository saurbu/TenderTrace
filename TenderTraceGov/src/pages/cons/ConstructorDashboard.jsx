import React, { useState, useEffect } from 'react'
import ConsNavbar from './ConsNavbar'

const ConstructorDashboard = () => {
  const [projects, setProjects] = useState([])
  const [totalWorkers, setTotalWorkers] = useState(0) // ✅ FIXED (no static 450)

  // 🔐 PIN MODAL STATES
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [enteredPin, setEnteredPin] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)

  // ✅ FETCH DATA
  const fetchTenders = async () => { 
    try {
      const email = localStorage.getItem("email")
      if (!email) return

      const res = await fetch(`http://localhost:5000/api/tender/all?email=${email}`)
      const data = await res.json()

      const formatted = (data || []).map(t => {
        const startDate = new Date(t.startDate || t.date)

        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + (t.timePeriod || 0))

        const progress = Math.floor(Math.random() * 101)

        return {
          id: t.id,
          name: t.tenderName,
          startDate: startDate.toLocaleDateString(),
          endDate: endDate.toLocaleDateString(),
          progress: progress,
          status: progress === 100 ? 'Completed' : 'In Progress',
          pin: "123456"
        }
      })

      setProjects(formatted)

      // ✅ WORKERS DEFAULT 0 (can update later from API)
      setTotalWorkers(0)

    } catch (err) {
      console.error("Error fetching tenders:", err)
    }
  }

  useEffect(() => {
    fetchTenders()
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-700 bg-green-100'
      case 'In Progress': return 'text-blue-700 bg-blue-100'
      default: return 'text-red-700 bg-red-100'
    }
  }

  const getProgressBarColor = (progress) => {
    if (progress === 100) return 'bg-green-500'
    if (progress > 75) return 'bg-green-400'
    return 'bg-blue-600'
  }

  const handleAccessClick = (project) => {
    setSelectedProject(project)
    setEnteredPin('')
    setIsPinModalOpen(true)
  }

  const handleVerifyPin = () => {
    if (enteredPin === selectedProject.pin) {
      alert(`Access Granted to ${selectedProject.name} ✅`)
      setIsPinModalOpen(false)
    } else {
      alert('Invalid PIN ❌')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      <ConsNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ✅ STATS (Workers restored) */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl">
            <h3>Projects</h3>
            <p>{projects.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl">
            <h3>Workers</h3>
            <p>{totalWorkers}</p> {/* ✅ now 0 */}
          </div>

          <div className="bg-white p-6 rounded-xl">
            <h3>Avg Progress</h3>
            <p>
              {projects.length
                ? Math.round(projects.reduce((a, b) => a + b.progress, 0) / projects.length)
                : 0}%
            </p>
          </div>
        </div>

        {/* Projects */}
        <div className="grid grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-5 rounded-xl shadow-sm">

              <h3 className="font-bold">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.id}</p>

              <p className="text-sm mt-2">Start: {project.startDate}</p>
              <p className="text-sm">End: {project.endDate}</p>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="bg-gray-200 h-2 rounded mt-1">
                  <div
                    className={`h-2 rounded ${getProgressBarColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <span className={`text-xs px-2 py-1 mt-3 inline-block ${getStatusColor(project.status)}`}>
                {project.status}
              </span>

              {/* Access Button */}
              <button
                onClick={() => handleAccessClick(project)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Access Project
              </button>

            </div>
          ))}
        </div>

      </main>

      {/* 🔐 PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg text-center">

            <h2 className="text-lg font-bold mb-4">Enter 6-Digit PIN</h2>

            <input
              type="password"
              maxLength="6"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="w-full border p-2 rounded mb-4 text-center tracking-widest"
              placeholder="******"
            />

            <div className="flex gap-2">
              <button
                onClick={handleVerifyPin}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>

              <button
                onClick={() => setIsPinModalOpen(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ConstructorDashboard