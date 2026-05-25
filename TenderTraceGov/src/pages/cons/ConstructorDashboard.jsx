import React, { useState, useEffect } from 'react'
import ConsNavbar from './ConsNavbar'
import UploadDetailsModal from './UploadDetailsModal'
import { useNavigate } from "react-router-dom";

const ConstructorDashboard = () => {

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [totalWorkers, setTotalWorkers] = useState(0)
  const [email, setEmail] = useState('')

  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [enteredPin, setEnteredPin] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {

  const contractorEmail =
    localStorage.getItem("contractorEmail")

  console.log("Saved Email:", contractorEmail)

  if (!contractorEmail) {
    return
  }

  setEmail(contractorEmail)

  const fetchData = async () => {

    try {

      /* -----------------------------
         FETCH TENDERS
      ----------------------------- */
      const tenderRes = await fetch(
        `http://localhost:5000/api/tenders/all?email=${contractorEmail}`
      )

      const tenderData =
        await tenderRes.json()

      let tenderProjects = []

      if (tenderData.success) {

        tenderProjects =
          tenderData.data.map((p) => ({

            id: p.id,

            name: p.tenderName,

            client: p.companyName,

            deadline:
              p.endDate || p.date,

            progress:
              p.status === "Completed"
                ? 100
                : p.status === "Pending"
                ? 0
                : 40,

            status:
              p.status || "In Progress",

            image:
              `https://picsum.photos/seed/${p.id}/800/600`,

            pin: p.pin,

            type: "Tender"

          }))
      }

      /* -----------------------------
         FETCH BILLS
      ----------------------------- */
      const billRes = await fetch(
        `http://localhost:5000/api/bills/all?email=${contractorEmail}`
      )

      const billData =
        await billRes.json()

      let billProjects = []

      if (billData.success) {

        billProjects =
          billData.data.map((b) => ({

            id: b.id,

            name: b.billTitle,

            client: b.department,

            deadline: b.targetDate,

            progress:
              b.status === "Passed"
                ? 100
                : b.status === "Upcoming"
                ? 40
                : 70,

            status:
              b.status || "Upcoming",

            image:
              `https://picsum.photos/seed/${b.id}/800/600`,

            pin: b.pin,

            type: "Bill"

          }))
      }

      /* -----------------------------
         MERGE BOTH
      ----------------------------- */
      setProjects([
        ...tenderProjects,
        ...billProjects
      ])

    } catch (error) {

      console.log(error)

    }

  }

  fetchData()

}, [])

  const handleUploadSubmit = (details) => {
    console.log(details)

    setTotalWorkers((prev) => prev + 1)

    alert("Employee details added successfully!")

    setIsUploadModalOpen(false)
  }

  const handleAccessClick = (project) => {
    setSelectedProject(project)
    setEnteredPin("")
    setIsPinModalOpen(true)
  }

  const handleVerifyPin = () => {

    if (enteredPin === selectedProject.pin) {

      alert(`Access Granted to ${selectedProject.name} ✅`)

      setIsPinModalOpen(false)
      navigate(`/constructor-project/${selectedProject.id}`)

    } else {

      alert("Invalid PIN ❌")

    }
  }

  const getStatusColor = (status) => {

    switch (status) {

      case 'Completed':
        return 'text-green-700 bg-green-100'

      case 'In Progress':
        return 'text-blue-700 bg-blue-100'

      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  return (

    <div className="min-h-screen bg-gray-50 pb-16">

      <ConsNavbar
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* TOP */}
        <div className="mb-10 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Contractor Workspace
            </h1>

            <p className="text-gray-600 mt-2">
              Logged in as: {email}
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            Upload Report
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Active Projects
            </p>

            <h2 className="text-3xl font-bold">
              {projects.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Total Workers
            </p>

            <h2 className="text-3xl font-bold">
              {totalWorkers}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Avg Completion
            </p>

            <h2 className="text-3xl font-bold">

              {projects.length > 0
                ? Math.round(
                    projects.reduce((acc, p) => acc + p.progress, 0) /
                    projects.length
                  )
                : 0
              }%

            </h2>
          </div>

        </div>

        {/* PROJECTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {projects.map((project) => (

            <div
              key={project.id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >

              <img
                src={project.image}
                alt={project.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">

                <div className="flex justify-between items-center mb-3">

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {project.id}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>

                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {project.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  {project.client}
                </p>

                <p className="mt-2 text-sm font-semibold text-purple-600">
                  {project.type}
                </p>

                <div className="mt-5">

                  <div className="flex justify-between mb-2">
                    <span>Completion</span>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">

                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>

                  </div>

                </div>

                <div className="mt-5 flex justify-between items-center">

                  <span className="text-sm text-gray-500">
                    {project.deadline}
                  </span>

                  <button
                    onClick={() => handleAccessClick(project)}
                    className="text-blue-600 font-bold"
                  >
                    Workspace →
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

      {/* MODAL */}
      <UploadDetailsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        projects={projects}
      />

      {/* PIN MODAL */}
      {isPinModalOpen && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl w-full max-w-sm">

            <h2 className="text-2xl font-bold mb-5">
              Enter PIN
            </h2>

            <input
              type="password"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              maxLength="6"
              className="w-full border p-4 rounded-xl text-center text-2xl tracking-widest"
            />

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setIsPinModalOpen(false)}
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyPin}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
              >
                Verify
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default ConstructorDashboard