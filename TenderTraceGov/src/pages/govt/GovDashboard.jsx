import React, { useState, useEffect } from 'react'
import GovNavbar from './GovNavbar'
import UpdateTenderModal from './UpdateTenderModal'
import AddBillModal from './AddBillModal'
import CompletedProjectsModal from './CompletedProjectsModal'
import ComplaintDetailsModal from './ComplaintDetailsModal'

const GovDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/tenders/all')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
      })
      .catch(err => console.error("Error fetching tenders:", err));

    // Load complaints from true Backend DB for cross-portal data bridge
    const loadComplaints = () => {
      fetch('http://localhost:5000/api/complaints')
        .then(res => res.json())
        .then(data => setComplaints(data))
        .catch(err => console.error("Error fetching complaints:", err));
    };
    
    loadComplaints();
    const interval = setInterval(loadComplaints, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTenderSubmit = async (newProject) => {
    try {
      const res = await fetch('http://localhost:5000/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (!res.ok) throw new Error('Failed to create tender');
      const savedProject = await res.json();
      setProjects([savedProject, ...projects]);
      alert('Tender Details Updated Successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update tender details.');
    }
  }

  const handleAddBillSubmit = () => {
    alert('Bill Added Successfully!');
    setIsBillModalOpen(false);
  }

  const handleStatusChange = (projectId, newStatus) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    setOpenDropdownId(null);
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Dynamic statistics calculations
  const totalTendersCount = projects.length + 137; // keep original base number approximately
  const inProgressCount = projects.filter(p => p.status === 'In Progress').length + 84; 
  const completedCount = projects.filter(p => p.status === 'Completed').length + 44;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <GovNavbar 
        onOpenModal={() => setIsModalOpen(true)} 
        onOpenBillModal={() => setIsBillModalOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Government Dashboard</h1>
            <p className="mt-2 text-gray-600 text-lg">Overview of all active tenders, assigned projects, and contractor progress.</p>
          </div>
          
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <p className="flex items-center"><i className="ri-time-line mr-2 text-blue-500"></i> Last Sync: <span className="font-semibold text-gray-800 ml-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Tenders</p>
              <i className="ri-file-list-3-line text-blue-500 text-xl bg-blue-50 p-2 rounded-lg"></i>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">{totalTendersCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">In Progress</p>
              <i className="ri-loader-2-line text-yellow-500 text-xl bg-yellow-50 p-2 rounded-lg"></i>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">{inProgressCount}</p>
          </div>
          <div 
            onClick={() => setIsCompletedModalOpen(true)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 hover:shadow-md hover:bg-green-50 transition-all cursor-pointer"
            title="Click to view all completed projects"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Completed</p>
              <i className="ri-checkbox-circle-line text-green-500 text-xl bg-green-50 p-2 rounded-lg relative">
                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
              </i>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">{completedCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Flagged Delays</p>
              <i className="ri-alarm-warning-line text-red-500 text-xl bg-red-50 p-2 rounded-lg"></i>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">11</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-600 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Citizen Complaints</p>
              <i className="ri-feedback-line text-red-600 text-xl bg-red-50 p-2 rounded-lg"></i>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">{complaints.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Listings - Col-span-2 */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="ri-building-4-line mr-2 text-blue-600"></i> Recent Projects & Tenders
            </h2>
            <div className="relative">
              <input type="text" placeholder="Search by name, ID or company..." className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-72 bg-gray-50 focus:bg-white transition-colors" />
              <i className="ri-search-line absolute left-3.5 top-2.5 text-gray-400 text-lg"></i>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.id || index} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{project.id}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors" title={project.tenderName}>{project.tenderName}</h3>
                  <p className="text-sm text-gray-600 mb-5 flex items-center font-medium">
                    <i className="ri-building-line mr-2 text-gray-400 text-lg"></i> {project.companyName}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 text-sm border-t border-gray-100 pt-5">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-semibold flex items-center"><i className="ri-calendar-2-line mr-1 text-gray-400"></i> Date</p>
                      <p className="font-semibold text-gray-800">{project.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-semibold flex items-center"><i className="ri-money-rupee-circle-line mr-1 text-gray-400"></i> Budget</p>
                      <p className="font-semibold text-gray-800">{project.budget}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-semibold flex items-center"><i className="ri-map-pin-line mr-1 text-gray-400"></i> Scope / Location</p>
                      <p className="font-semibold text-gray-800">{project.locationInfo}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                  <button className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center">
                    View Complete Details <i className="ri-arrow-right-line ml-1"></i>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === project.id ? null : project.id)}
                      className="text-gray-400 hover:text-gray-700 bg-white p-1 rounded-full border border-gray-200 shadow-sm" 
                      title="Update Status"
                    >
                      <i className="ri-more-2-fill text-lg"></i>
                    </button>
                    {openDropdownId === project.id && (
                      <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-md shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="text-xs font-semibold text-gray-500 uppercase px-4 py-2 bg-gray-50 border-b border-gray-100">Set Status</div>
                        {['Pending', 'In Progress', 'Under Review', 'Completed'].map(status => (
                          <button 
                            key={status} 
                            onClick={() => handleStatusChange(project.id, status)} 
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${project.status === status ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints Sidebar - Col-span-1 */}
          <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <i className="ri-error-warning-line mr-2 text-red-600"></i> Active Complaints
                        </h2>
                        {complaints.length > 0 && (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">{complaints.length} New</span>
                        )}
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                        {complaints.length === 0 ? (
                            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <i className="ri-folder-info-line text-4xl text-gray-300 mb-2"></i>
                                <p className="text-gray-500 font-medium">No complaints reported.</p>
                            </div>
                        ) : (
                            complaints.map((comp) => (
                                <div key={comp.id} className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit mb-1">
                                                Malpractice Report
                                            </span>
                                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{comp.subject}</h4>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">{comp.date ? comp.date.split(',')[0] : 'Recent'}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-3 mb-4 italic leading-relaxed">"{comp.description}"</p>
                                    <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Reporter</span>
                                            <span className="text-[11px] font-semibold text-gray-700">{comp.name}</span>
                                        </div>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Opening modal for:", comp);
                                            setSelectedComplaint(comp);
                                            setComplaintModalOpen(true);
                                          }} 
                                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                            Investigate
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
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

      <ComplaintDetailsModal 
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        complaint={selectedComplaint}
        project={selectedComplaint ? projects.find(p => String(p.id || p._id) === String(selectedComplaint.tenderId)) : null}
      />
    </div>
  )
}

export default GovDashboard