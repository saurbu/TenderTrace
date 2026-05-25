import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ComplaintModal from '../ComplaintModal'

const Section3 = () => {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("tenders")

  const [tenders, setTenders] = useState([])
  const [bills, setBills] = useState([])

  const [loading, setLoading] = useState(true)

  // Complaint modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [activeTender, setActiveTender] = useState(null)

  /* -----------------------------------
      FETCH DATA
  ----------------------------------- */

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true)

        // FETCH TENDERS
        const tenderRes = await fetch(
          'http://localhost:5000/api/tenders/all'
        )

        const tenderData = await tenderRes.json()

        if (tenderData.success) {

          setTenders(tenderData.data)

        } else {

          setTenders([])

        }

        // FETCH BILLS
        const billRes = await fetch(
          'http://localhost:5000/api/bills/all'
        )

        const billData = await billRes.json()

        if (billData.success) {

          setBills(billData.data)

        } else {

          setBills([])

        }

      } catch (err) {

        console.error("Fetch Error:", err)

      } finally {

        setLoading(false)

      }
    }

    fetchData()

  }, [])

  /* -----------------------------------
      STATUS COLORS
  ----------------------------------- */

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

    <div
      id="tenders-section"
      className='min-h-screen w-full px-8 md:px-18 pt-8 pb-20 bg-gray-50 scroll-mt-24'
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">

          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Government Projects Portal
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse all government tenders and bills
          </p>

        </div>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-10">

          <button
            onClick={() => setActiveTab("tenders")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "tenders"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border"
            }`}
          >
            Active Tenders
          </button>

          <button
            onClick={() => setActiveTab("bills")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "bills"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 border"
            }`}
          >
            Government Bills
          </button>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="flex justify-center items-center h-64">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

          </div>

        ) : (

          <div
            className="h-[650px] overflow-y-auto pr-2 sm:pr-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E1 transparent'
            }}
          >

            {/* -----------------------------------
                TENDERS
            ----------------------------------- */}

            {activeTab === "tenders" && (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-6">

                {tenders.map((tender) => (

                  <div
                    key={tender._id || tender.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                  >

                    <div className="p-6 flex-grow">

                      <div className="flex justify-between items-start mb-4">

                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                          {tender.id}
                        </span>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(tender.status)}`}
                        >
                          {tender.status}
                        </span>

                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                        {tender.tenderName}
                      </h3>

                      <p className="text-sm font-semibold text-blue-600 mb-6 flex items-center">
                        <i className="ri-building-4-line mr-2 text-lg"></i>
                        {tender.companyName}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-5 rounded-xl border border-gray-100">

                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                            Budget
                          </p>

                          <p className="font-bold text-gray-900 text-base">
                            ₹ {tender.budget}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                            Location
                          </p>

                          <p className="font-bold text-gray-900 text-base">
                            {tender.location}
                          </p>
                        </div>

                        <div className="col-span-2 pt-4 border-t border-gray-200 mt-2">

                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider flex items-center">
                            <i className="ri-calendar-event-line mr-1 text-gray-500 text-base"></i>
                            Added On
                          </p>

                          <p className="font-semibold text-gray-800">
                            {
                              tender.createdAt
                                ? new Date(tender.createdAt).toLocaleDateString()
                                : "N/A"
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">

                      <button
                        onClick={() => {
                          setActiveTender(tender)
                          setIsReportModalOpen(true)
                        }}
                        className="flex-1 mr-2 text-center text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors py-2 rounded-lg flex items-center justify-center border border-red-100"
                      >
                        <i className="ri-error-warning-line mr-1.5"></i>
                        Report
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/projects/${tender.id || tender._id}`)
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

            {/* -----------------------------------
                BILLS
            ----------------------------------- */}

            {activeTab === "bills" && (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-6">

                {bills.map((bill) => (

                  <div
                    key={bill._id || bill.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                  >

                    <div className="p-6 flex-grow">

                      <div className="flex justify-between items-start mb-4">

                        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                          {bill.id}
                        </span>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(bill.status)}`}
                        >
                          {bill.status}
                        </span>

                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-700 transition-colors">
                        {bill.billTitle}
                      </h3>

                      <p className="text-sm font-semibold text-purple-600 mb-6 flex items-center">
                        <i className="ri-government-line mr-2 text-lg"></i>
                        {bill.department}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-5 rounded-xl border border-gray-100">

                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                            Budget
                          </p>

                          <p className="font-bold text-gray-900 text-base">
                            ₹ {bill.budget}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                            Ward No
                          </p>

                          <p className="font-bold text-gray-900 text-base">
                            {bill.wardNo}
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider">
                            Location
                          </p>

                          <p className="font-bold text-gray-900 text-base">
                            {bill.location}
                          </p>
                        </div>

                        <div className="col-span-2 pt-4 border-t border-gray-200 mt-2">

                          <p className="text-gray-400 text-xs uppercase mb-1 font-bold tracking-wider flex items-center">
                            <i className="ri-calendar-event-line mr-1 text-gray-500 text-base"></i>
                            Created On
                          </p>

                          <p className="font-semibold text-gray-800">
                            {
                              bill.createdAt
                                ? new Date(bill.createdAt).toLocaleDateString()
                                : "N/A"
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">

                      <button
                        className="w-full text-center text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-lg shadow-sm"
                      >
                        View Bill
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}

      </div>

      {/* COMPLAINT MODAL */}
      <ComplaintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        tenderTitle={activeTender?.tenderName}
        tenderId={activeTender?.id}
      />

    </div>
  )
}

export default Section3