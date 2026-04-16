import React from 'react'

const CompletedProjectsModal = ({ isOpen, onClose, projects }) => {
  if (!isOpen) return null;

  const completedProjects = projects.filter(p => p.status === 'Completed');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i> Completed Projects
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-gray-50">
          {completedProjects.length === 0 ? (
            <div className="text-center py-10">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-3 block"></i>
              <p className="text-gray-500 font-medium">No completed projects found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedProjects.map((project, index) => (
                <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-green-300 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{project.id}</span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">Completed</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{project.tenderName}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <i className="ri-building-line mr-1 text-gray-400"></i> {project.companyName}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm bg-gray-50 p-3 rounded-md border border-gray-100 min-w-[200px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Budget:</span>
                      <span className="font-bold text-gray-800">{project.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Location:</span>
                      <span className="font-bold text-gray-800 text-right max-w-[120px] truncate" title={project.locationInfo}>{project.locationInfo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Date:</span>
                      <span className="font-bold text-gray-800">{project.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompletedProjectsModal
