import React from 'react';

const ComplaintDetailsModal = ({ isOpen, onClose, complaint, project }) => {
  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in text-left text-gray-900">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transform animate-scale-in max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-red-50 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <i className="ri-error-warning-fill text-red-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900">Malpractice Investigation</h2>
            </div>
            <p className="text-sm text-gray-600 font-medium mt-1">Review reported issues against assigned contractors.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Complaint Core Details */}
          <div>
             <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Report Info</h3>
             <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</h4>
                   <p className="font-semibold text-gray-900 text-lg leading-tight">{complaint.subject}</p>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Detailed Description</h4>
                   <p className="text-gray-700 italic border-l-4 border-red-200 pl-3 leading-relaxed">"{complaint.description}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-3">
                   <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reporter Name</h4>
                      <p className="font-medium text-gray-800">{complaint.name}</p>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reporter Email</h4>
                      <p className="font-medium text-gray-800">{complaint.email}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Tender & Contractor Details */}
          <div>
             <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Targeted Tender & Contractor</h3>
             {project ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                      <div className="flex items-center mb-3">
                         <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                            <i className="ri-building-line text-xl"></i>
                         </div>
                         <div>
                            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Assigned Contractor</h4>
                            <p className="font-bold text-gray-900 text-lg">{project.companyName}</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
                      <div className="flex items-center mb-3">
                         <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-3">
                            <i className="ri-file-list-3-line text-xl"></i>
                         </div>
                         <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tender ID</h4>
                            <p className="font-bold text-gray-900 text-lg">#{project.id || project._id}</p>
                         </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">{project.tenderName}</p>
                      <p className="text-xs text-gray-500"><i className="ri-map-pin-line mr-1"></i>{project.locationInfo}</p>
                   </div>
                </div>
             ) : (
                <div className="bg-red-50 text-red-600 p-5 rounded-xl border border-red-100 flex items-center">
                   <i className="ri-alarm-warning-line text-2xl mr-3"></i>
                   <div>
                     <p className="font-bold">Original Tender Data Not Found</p>
                     <p className="text-sm opacity-80">The system couldn't match Tender ID: {complaint.tenderId}</p>
                   </div>
                </div>
             )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
           <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Close Report
           </button>
           <button onClick={() => alert('Contractor suspension initiated!')} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-200">
              <i className="ri-indeterminate-circle-line mr-2"></i> Suspend Contractor
           </button>
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetailsModal;
