import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ComplaintModal from '../components/ComplaintModal'

const ProjectDetails = ({ projects }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.id === id)
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">The project you are looking for doesn't exist or has been removed from our database.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={project.img} 
          alt={project.title} 
          className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group">
            <i className="ri-arrow-left-line mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
            Back to Projects
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {project.status}
            </span>
            <span className="text-white/60 text-sm">•</span>
            <span className="text-white/80 text-sm font-medium">Project ID: #{project.id}00{project.id}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center text-white/90 text-lg">
            <i className="ri-map-pin-2-line mr-2 text-blue-400"></i>
            {project.tag}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">About the Project</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
              {project.desc}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <i className="ri-money-rupee-circle-line text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Estimated Budget</p>
                <p className="text-xl font-bold text-gray-900">{project.cost}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <i className="ri-time-line text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Timeline</p>
                <p className="text-xl font-bold text-gray-900">{project.timeline}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">Key Objectives</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Infrastructure Modernization', 'Energy Efficiency', 'Community Safety', 'Economic Integration'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-gray-700 font-medium border border-transparent hover:border-blue-100 transition-colors">
                  <i className="ri-checkbox-circle-fill text-blue-500"></i>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar Sidebar Component */}
        <div className="space-y-8">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform opacity-10">
                <i className="ri-government-line text-8xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-4 relative z-10">Contractor Verification</h4>
            <p className="text-gray-400 mb-8 relative z-10">Verified details directly from the assigned contractor and Govt. agencies.</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                <span className="text-sm font-medium"><i className="ri-group-line text-blue-400 mr-2"></i>Active Workers</span>
                <span className="font-bold text-lg">{Math.floor(Math.random() * 200) + 50}</span>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                <span className="text-sm font-medium"><i className="ri-truck-line text-blue-400 mr-2"></i>Material Loads</span>
                <span className="font-bold text-lg">{Math.floor(Math.random() * 50) + 12} Tons</span>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                <span className="text-sm font-medium"><i className="ri-building-line text-blue-400 mr-2"></i>Assigned To</span>
                <span className="font-bold text-sm text-right max-w-[120px] truncate" title={project.companyName}>{project.companyName}</span>
              </div>
            </div>
          </div>

          <div className="p-8 border border-gray-100 rounded-3xl space-y-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-lg font-bold text-gray-900">Track Progress</h4>
               <span className="text-sm font-bold text-blue-600">
                 {project.status === 'Completed' ? '100' : (project.status === 'In Progress' ? '65' : (project.status === 'Under Review' ? '90' : '0'))}%
               </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
               <div 
                 className={`h-3 rounded-full transition-all duration-1000 ${project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-600'}`} 
                 style={{ width: `${project.status === 'Completed' ? 100 : (project.status === 'In Progress' ? 65 : (project.status === 'Under Review' ? 90 : 0))}%` }}>
               </div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Tender Issued', status: 'completed' },
                { label: 'Contractor Assigned', status: project.status === 'Pending' ? 'pending' : 'completed' },
                { label: 'Work In Progress', status: project.status === 'Completed' || project.status === 'Under Review' ? 'completed' : (project.status === 'In Progress' ? 'active' : 'pending') },
                { label: 'Final Inspection', status: project.status === 'Completed' ? 'completed' : (project.status === 'Under Review' ? 'active' : 'pending') }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className={`w-3 h-3 rounded-full ring-4 ${
                    step.status === 'completed' ? 'bg-green-500 ring-green-100' :
                    step.status === 'active' ? 'bg-blue-500 ring-blue-100' : 'bg-gray-300 ring-gray-50'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA - Replaced Newsletter with Raise a Complaint */}
      <div className="bg-red-50 py-24 px-6 border-t border-red-100 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 text-red-600 rounded-3xl mb-8 animate-pulse shadow-lg shadow-red-100">
            <i className="ri-error-warning-line text-4xl"></i>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Report Malpractice or Fraud</h2>
          <p className="text-gray-600 mb-12 text-xl leading-relaxed max-w-2xl mx-auto">
            If you have noticed any corruption, lack of transparency, or environmental violations in this project, you can raise a complaint directly to the government authorities.
          </p>
          <button 
            onClick={() => setIsComplaintModalOpen(true)}
            className="group relative bg-red-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200 hover:-translate-y-1 active:translate-y-0 flex items-center mx-auto"
          >
            <i className="ri-feedback-line mr-3 text-2xl"></i>
            Raise a Complaint to Govt.
          </button>
        </div>
      </div>

      <ComplaintModal 
        isOpen={isComplaintModalOpen} 
        onClose={() => setIsComplaintModalOpen(false)}
        tenderTitle={project?.title}
        tenderId={project?.id}
      />
    </div>
  )
}

export default ProjectDetails
