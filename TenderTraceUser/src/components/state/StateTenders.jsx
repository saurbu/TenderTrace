import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ComplaintModal from '../ComplaintModal'

const StateTenders = () => {

  const { stateName } = useParams()
  const navigate = useNavigate()

  const [tenders, setTenders] = useState([])
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState("all")

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [activeTender, setActiveTender] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true)

        const [tRes, bRes] = await Promise.all([
          fetch('http://localhost:5000/api/tenders/all'),
          fetch('http://localhost:5000/api/bills/all')
        ])

        const tData = await tRes.json()
        const bData = await bRes.json()

        setTenders(tData.success ? tData.data : [])
        setBills(bData.success ? bData.data : [])

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const getState = (location = "") => {
    if (!location) return ""
    return location.split('-')[0].trim().toLowerCase()
  }

  const matchState = (item) =>
    getState(item.location) === stateName.toLowerCase()

  const stateTenders = tenders.filter(matchState)
  const stateBills = bills.filter(matchState)

  let finalData = []

  if (filter === "all") {
    finalData = [
      ...stateTenders.map(t => ({ ...t, type: "tender" })),
      ...stateBills.map(b => ({ ...b, type: "bill" }))
    ]
  }

  if (filter === "tenders") {
    finalData = stateTenders.map(t => ({ ...t, type: "tender" }))
  }

  if (filter === "bills") {
    finalData = stateBills.map(b => ({ ...b, type: "bill" }))
  }
  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200'
      case 'Completed':
        return 'text-green-700 bg-green-100 border-green-200'
      case 'Under Review':
        return 'text-blue-700 bg-blue-100 border-blue-200'
      case 'Pending':
        return 'text-orange-700 bg-orange-100 border-orange-200'
      case 'Introduced':
        return 'text-purple-700 bg-purple-100 border-purple-200'
      case 'Passed':
        return 'text-green-700 bg-green-100 border-green-200'
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen w-full px-8 md:px-18 pt-8 pb-20 bg-gray-50">

      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {stateName}
        </h2>
      </div>

      <div className="flex justify-center gap-4 mb-10">

        {["all", "tenders", "bills"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === f
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}

      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {finalData.map((item) => (

            <div
              key={item._id || item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
            >

              <div className="p-6 flex-grow">

                <div className="flex justify-between items-start mb-4">

                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    {item.id}
                  </span>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>

                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                  {item.tenderName || item.billTitle}
                </h3>

                <p className="text-sm font-semibold text-blue-600 mb-6 flex items-center">
                  <i className="ri-building-4-line mr-2 text-lg"></i>
                  {item.companyName || item.department}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-5 rounded-xl border border-gray-100">

                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                      Budget
                    </p>
                    <p className="font-bold text-gray-900 text-base">
                      ₹ {item.budget}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                      Location
                    </p>
                    <p className="font-bold text-gray-900 text-base">
                      {item.location}
                    </p>
                  </div>

                  <div className="col-span-2 pt-4 border-t border-gray-200 mt-2">

                    <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider flex items-center">
                      <i className="ri-calendar-event-line mr-1 text-gray-500 text-base"></i>
                      Created On
                    </p>

                    <p className="font-semibold text-gray-800">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                </div>

              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">

                <button
                  onClick={() => {
                    setActiveTender(item)
                    setIsReportModalOpen(true)
                  }}
                  className="flex-1 mr-2 text-center text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors py-2 rounded-lg flex items-center justify-center border border-red-100"
                >
                  <i className="ri-error-warning-line mr-1.5"></i>
                  Report
                </button>

                <button
                  onClick={() =>
                    navigate(`/projects/${item.id || item._id}`)
                  }
                  className="flex-[2] text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-lg flex items-center justify-center shadow-sm"
                >
                  View Details
                  <i className="ri-arrow-right-line ml-1.5"></i>
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

      <ComplaintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        tenderTitle={activeTender?.tenderName}
        tenderId={activeTender?.id}
      />

    </div>
  )
}

export default StateTenders