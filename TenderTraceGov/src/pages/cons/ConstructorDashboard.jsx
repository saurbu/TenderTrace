import React, { useState, useEffect } from 'react'
import ConsNavbar from './ConsNavbar'
import UploadDetailsModal from './UploadDetailsModal'

const ConstructorDashboard = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [totalWorkers, setTotalWorkers] = useState(0); // ✅ FIXED (no static 450)
  const [email, setEmail] = useState('');

  // 🔐 PIN MODAL STATES
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('contractorEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      fetch(`http://localhost:5000/api/tenders/all?email=${savedEmail}`)
        .then(res => res.json())
        .then(data => {
          // Map DB structure to UI structure
          const mappedData = data.map(p => {
            const progress = p.status === 'Completed' ? 100 : (p.status === 'Pending' ? 0 : Math.floor(Math.random() * 101));
            return {
              id: p.id,
              name: p.tenderName,
              client: p.companyName,
              deadline: p.date,
              progress: progress,
              status: progress === 100 ? 'Completed' : (p.status === 'Under Review' ? 'In Review' : (p.status === 'In Progress' ? 'In Progress' : p.status)),
              image: `https://picsum.photos/seed/${p._id || p.id}/800/600`,
              pin: "123456"
            };
          });
          setProjects(mappedData);
        })
        .catch(err => console.error("Error fetching projects:", err));
    }
  }, []);

  const handleUploadSubmit = (details) => {
    console.log("Uploaded details:", details);
    setTotalWorkers(prev => prev + 1);
    alert('Employee details added successfully!');
    setIsUploadModalOpen(false);
  };

  const handleAccessClick = (project) => {
    setSelectedProject(project);
    setEnteredPin('');
    setIsPinModalOpen(true);
  };

  const handleVerifyPin = () => {
    if (enteredPin === selectedProject.pin) {
      alert(`Access Granted to ${selectedProject.name} ✅`);
      setIsPinModalOpen(false);
      window.location.href = `/constructor-project/${selectedProject.id}`;
    } else {
      alert('Invalid PIN ❌');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-700 bg-green-100 ring-green-600/20';
      case 'On Track': return 'text-green-700 bg-green-100 ring-green-600/20';
      case 'In Progress': return 'text-blue-700 bg-blue-100 ring-blue-600/20';
      case 'In Review': return 'text-blue-700 bg-blue-100 ring-blue-600/20';
      case 'Delayed': return 'text-red-700 bg-red-100 ring-red-600/20';
      default: return 'text-gray-700 bg-gray-100 ring-gray-600/20';
    }
  }

  const getProgressBarColor = (progress, status) => {
    if (status === 'Delayed') return 'bg-red-500';
    if (progress > 75) return 'bg-green-500';
    return 'bg-blue-600';
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      <ConsNavbar onOpenUploadModal={() => setIsUploadModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Welcome Block */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Contractor Workspace</h1>
            <p className="mt-2 text-gray-600 text-lg">Manage active projects for {email || 'your account'}, upload daily reports, and handle site attendance.</p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-black/20 flex items-center w-full md:w-auto justify-center"
          >
            <i className="ri-file-upload-line mr-2"></i> File Daily Report
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className="bg-blue-100 p-4 rounded-xl mr-4"><i className="ri-building-line text-blue-600 text-2xl"></i></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Active Projects</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{projects.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className="bg-green-100 p-4 rounded-xl mr-4"><i className="ri-group-line text-green-600 text-2xl"></i></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Total No. of Workers</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalWorkers}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className="bg-purple-100 p-4 rounded-xl mr-4"><i className="ri-bar-chart-box-line text-purple-600 text-2xl"></i></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Avg. Completion</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
              </h3>
            </div>
          </div>
        </div>

        {/* My Projects Section */}
        <div id="my-projects" className="mb-6 flex items-center justify-between mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="ri-layout-masonry-line mr-3 text-blue-600"></i> My Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              
              {/* Image banner */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition">
                    <i className="ri-more-2-fill"></i>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{project.id}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-700 transition-colors">{project.name}</h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center"><i className="ri-building-line mr-1.5"></i> Client: {project.client}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-gray-700">Completion</span>
                    <span className="text-xl font-bold text-gray-900">{project.progress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5 overflow-hidden border border-gray-200">
                    <div className={`h-2.5 rounded-full ${getProgressBarColor(project.progress, project.status)} transition-all duration-1000`} style={{ width: `${project.progress}%` }}></div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600">
                      <i className="ri-calendar-event-line mr-1.5 text-gray-400"></i>
                      <span className="font-medium text-gray-800">{project.deadline}</span>
                    </div>
                    <button 
                      onClick={() => handleAccessClick(project)}
                      className="text-blue-600 font-bold hover:text-blue-800 transition flex items-center text-sm"
                    >
                      Workspace <i className="ri-arrow-right-s-line ml-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <UploadDetailsModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        projects={projects}
      />

      {/* 🔐 PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl text-center transform transition-all">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-lock-password-line text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Project Access</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your 6-digit assigned PIN to access {selectedProject?.name}</p>

            <input
              type="password"
              maxLength="6"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 rounded-xl mb-6 text-center tracking-[0.5em] text-2xl font-bold transition-colors"
              placeholder="••••••"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPin}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-600/30"
              >
                Verify PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConstructorDashboard