import React, { useState, useEffect } from 'react'
import GovNavbar from './GovNavbar'
import UpdateTenderModal from './UpdateTenderModal'
import AddBillModal from './AddBillModal'
import CompletedProjectsModal from './CompletedProjectsModal'
import GovComplaintDashboard from "./GovComplaintDashboard";
const GovDashboard = () => {

  const [projects, setProjects] = useState([])
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] =useState(false)
  const [isBillModalOpen, setIsBillModalOpen] =useState(false)
  const [isCompletedModalOpen, setIsCompletedModalOpen] =useState(false)
  const [selectedComplaint, setSelectedComplaint] =useState(null)

  const [complaintModalOpen, setComplaintModalOpen] =useState(false)
  const [complaints, setComplaints] = useState([]);

  const fetchTenders = async () => {
  try {
    const res = await fetch(
      'http://localhost:5000/api/tenders/all'
    );
    const data = await res.json();
    setProjects(Array.isArray(data.data) ? data.data : []);
  } catch (err) {
    console.error(err);
  }
};
  const fetchBills = async () => {
  try {
    const res = await fetch(
      'http://localhost:5000/api/bills/all'
    )
    const data = await res.json()
    console.log("Bills Response:", data)
    if (data.success) {
      setBills(
        Array.isArray(data.data)
          ? data.data
          : []
      )
    } else {
      setBills([])
    }
  } catch (err) {
    console.error(err)
    setBills([])
  }
}
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, []);
  useEffect(() => {
    const loadData = async () => {
      await fetchTenders()
      await fetchBills()
      setLoading(false)
    }
    loadData()
    const loadComplaints = () => {
      fetch('http://localhost:5000/api/complaints')
        .then(res => res.json())
        .then(data => setComplaints(data))
        .catch(err =>
          console.error(err)
        )
    }
    loadComplaints()

  }, [])
  const totalTendersCount =projects.length

  const totalBillsCount =bills.length

  const inProgressCount =projects.filter(
      p => p.status === 'In Progress'
    ).length

  const completedCount =projects.filter(
      p => p.status === 'Completed'
    ).length
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  return (

    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <GovNavbar
        onOpenModal={() =>
          setIsModalOpen(true)
        }
        onOpenBillModal={() =>
          setIsBillModalOpen(true)
        }
      />
      <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Government Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Tenders and Bills
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border-l-4 border-blue-500 shadow">
            <p className="text-sm text-gray-500">
              Total Tenders
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {totalTendersCount}
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-4 border-l-4 border-purple-500 shadow">
            <p className="text-sm text-gray-500">
              Total Bills
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {totalBillsCount}
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-4 border-l-4 border-yellow-500 shadow">
            <p className="text-sm text-gray-500">
              In Progress
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {inProgressCount}
            </h2>
          </div>
          <div
            onClick={() =>
              setIsCompletedModalOpen(true)
            }
            className="bg-white rounded-2xl p-4 border-l-4 border-green-500 shadow cursor-pointer"
          >
            <p className="text-sm text-gray-500">
              Completed
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {completedCount}
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-4 border-l-4 border-red-500 shadow">
            <p className="text-sm text-gray-500">
              Delays
            </p>
            <h2 className="text-3xl font-bold mt-2">
              11
            </h2>
          </div>

          <div
            onClick={() => setComplaintModalOpen(true)}
            className="bg-white rounded-2xl p-4 border-l-4 border-red-700 shadow cursor-pointer"
          >
            <p className="text-sm text-gray-500">Complaints</p>
            <h2 className="text-3xl font-bold mt-2">
              {complaints.length}
            </h2>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Active Tenders
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full bg-white p-10 rounded-3xl text-center shadow">
                <h2 className="text-2xl font-bold text-gray-700">
                  No Tenders Found
                </h2>
              </div>
            ) : (
              projects.map((project, index) => (
                <div
                  key={project._id || index}
                  className="bg-white rounded-3xl border shadow-sm hover:shadow-xl transition overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {project.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeColor(project.status)}`}
                      >
                        {project.status}
                      </span>

                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-5">
                      {project.tenderName}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                          Company
                        </span>
                        <span className="font-semibold text-right">
                          {project.companyName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                          Budget
                        </span>
                        <span className="font-semibold text-right">
                          ₹ {project.budget}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                          Location
                        </span>
                        <span className="font-semibold text-right">
                          {project.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Government Bills
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bills.length === 0 ? (
              <div className="col-span-full bg-white p-10 rounded-3xl text-center shadow">
                <h2 className="text-2xl font-bold text-gray-700">
                  No Bills Found
                </h2>
              </div>
            ) : (
              bills.map((bill, index) => (
                <div
                  key={bill._id || index}
                  className="bg-white rounded-3xl border shadow-sm hover:shadow-xl transition overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        {bill.id}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-green-100 text-green-700">
                        {bill.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-5">
                      {bill.billTitle}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                          Ward No.
                        </span>
                        <span className="font-semibold text-right">
                          {bill.wardNo}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                          Department
                        </span>
                        <span className="font-semibold text-right">
                          {bill.department}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-gray-500">
                          Location
                        </span>

                        <span className="font-semibold text-right">
                          {bill.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <UpdateTenderModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        projects={projects}
        fetchProjects={fetchTenders}
      />
      <AddBillModal
        isOpen={isBillModalOpen}
        onClose={() =>
          setIsBillModalOpen(false)
        }
        bills={bills}
        fetchBills={fetchBills}
      />
      <CompletedProjectsModal
        isOpen={isCompletedModalOpen}
        onClose={() =>
          setIsCompletedModalOpen(false)
        }
        projects={projects}
      />
      {complaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60">
        
          <div className="bg-white h-full w-full overflow-y-auto relative">
            <button
              onClick={() => setComplaintModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50"
            >
              Close
            </button>

            <GovComplaintDashboard />
          </div>
        </div>
      )}
    </div>
  )
}

export default GovDashboard