import React, { useState, useEffect } from 'react'
import GovNavbar from './GovNavbar'
import UpdateTenderModal from './UpdateTenderModal'
import AddBillModal from './AddBillModal'
import CompletedProjectsModal from './CompletedProjectsModal'

const GovDashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBillModalOpen, setIsBillModalOpen] = useState(false)
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  // ✅ FETCH DATA
  const fetchTenders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tender/all") // ✅ FIXED URL
      const data = await res.json()

      // safety fallback
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching tenders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenders()
  }, [])

  // ✅ CREATE TENDER
  const handleUpdateTenderSubmit = async (newProject) => {
    try {
      const res = await fetch("http://localhost:5000/api/tender/create", { // ✅ FIXED URL
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: newProject.id,
          tenderName: newProject.tenderName,
          companyName: newProject.companyName,
          email: newProject.email,
          budget: parseInt(newProject.budget),
          timePeriod: newProject.timePeriod,
          location: newProject.locationInfo
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Error creating tender")
        return
      }

      alert(`Tender Created!\nID: ${data.tenderId}\nPassword: ${data.password}`)

      fetchTenders()
      setIsModalOpen(false)

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  const handleAddBillSubmit = () => {
    alert('Bill Added Successfully!')
    setIsBillModalOpen(false)
  }

  // ✅ SAFE STATUS CHANGE (NO CRASH)
  const handleStatusChange = (projectId, newStatus) => {
    setProjects(prev =>
      (prev || []).map(p =>
        p?.id === projectId ? { ...p, status: newStatus } : p
      )
    )
    setOpenDropdownId(null)
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // ✅ REAL STATS
  const totalTendersCount = projects.length
  const inProgressCount = projects.filter(p => p.status === 'In Progress').length
  const completedCount = projects.filter(p => p.status === 'Completed').length

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <GovNavbar
        onOpenModal={() => setIsModalOpen(true)}
        onOpenBillModal={() => setIsBillModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-lg font-semibold">Loading tenders...</p>
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Government Dashboard</h1>
                <p className="mt-2 text-gray-600 text-lg">Overview of all active tenders, assigned projects, and contractor progress.</p>
              </div>

              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <p className="flex items-center">
                  <i className="ri-time-line mr-2 text-blue-500"></i>
                  Last Sync:
                  <span className="font-semibold text-gray-800 ml-1">
                    {new Date().toLocaleDateString('en-GB')}
                  </span>
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Total Tenders" value={totalTendersCount} icon="ri-file-list-3-line" color="blue" />
              <StatCard title="In Progress" value={inProgressCount} icon="ri-loader-2-line" color="yellow" />
              <StatCard title="Completed" value={completedCount} icon="ri-checkbox-circle-line" color="green" onClick={() => setIsCompletedModalOpen(true)} />
              <StatCard title="Flagged Delays" value={0} icon="ri-alarm-warning-line" color="red" />
            </div>

            {/* PROJECT LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={project.id || index} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">

                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">{project.id}</span>

                      {/* ✅ FIXED DROPDOWN */}
                      <div className="relative">
                        <span
                          onClick={() =>
                            setOpenDropdownId(openDropdownId === project.id ? null : project.id)
                          }
                          className={`cursor-pointer text-xs px-3 py-1 rounded ${getStatusBadgeColor(project.status)}`}
                        >
                          {project.status}
                        </span>

                        {openDropdownId === project.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                            {['Pending', 'In Progress', 'Under Review', 'Completed'].map(status => (
                              <div
                                key={status}
                                onClick={() => handleStatusChange(project.id, status)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {status}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg">{project.tenderName}</h3>
                    <p className="text-sm text-gray-600">{project.companyName}</p>

                    <div className="mt-4 text-sm">
                      <p><b>Budget:</b> {project.budget}</p>
                      <p><b>Time:</b> {project.timePeriod} months</p>
                      <p><b>Location:</b> {project.locationInfo}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <UpdateTenderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateTenderSubmit}
      />

      <AddBillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onSubmit={handleAddBillSubmit}
      />

      <CompletedProjectsModal
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        projects={projects}
      />
    </div>
  )
}

// ✅ SAME UI CARD (UNCHANGED LOOK)
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div onClick={onClick} className={`bg-white p-6 rounded-xl border-l-4 border-${color}-500 cursor-pointer`}>
    <p className="text-sm">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
    <i className={`${icon}`}></i>
  </div>
)

export default GovDashboard