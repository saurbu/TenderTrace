import React, { useState } from 'react'

const UploadDetailsModal = ({ isOpen, onClose, onSubmit, projects }) => {
  const [faceScanStatus, setFaceScanStatus] = useState('idle'); // idle, scanning, success

  if (!isOpen) return null;

  const handleFaceScan = () => {
    setFaceScanStatus('scanning');
    setTimeout(() => {
      setFaceScanStatus('success');
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (faceScanStatus !== 'success') {
      alert("Please add a picture of the employee first.");
      return;
    }
    const formData = new FormData(e.target);
    onSubmit(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Upload Employee Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="uploadForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Project Selection */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Active Project</label>
                <select name="projectId" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow">
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                  ))}
                </select>
              </div>

              {/* Name of Employee */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name of Employee</label>
                <input type="text" name="employeeName" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Ramesh Kumar" />
              </div>

              {/* Aadhaar No */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar / ID No.</label>
                <input type="text" name="aadhaarNo" required pattern="[0-9]{12}" title="Must be a 12 digit Aadhaar number" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1234 5678 9012" />
              </div>

              {/* Mobile No */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile No.</label>
                <input type="tel" name="mobileNo" required pattern="[0-9]{10}" title="Must be a 10 digit number" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 9876543210" />
              </div>

              {/* Position */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Position of Employee</label>
                <input type="text" name="position" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Site Supervisor, Laborer, Engineer" />
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <textarea name="address" required rows="2" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Complete residential address..." />
              </div>

              {/* Add Picture Section */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-5 text-center transition-all duration-300">
                  <h3 className="font-semibold text-gray-800 mb-2 flex justify-center items-center">
                    <i className="ri-image-add-line text-blue-600 mr-2 text-xl"></i> Add Picture
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Please capture or upload a clear picture of the employee for verification.</p>
                  
                  {faceScanStatus === 'idle' && (
                    <button type="button" onClick={handleFaceScan} className="bg-blue-100 text-blue-700 border border-blue-200 px-6 py-2.5 rounded-full font-semibold hover:bg-blue-200 transition-colors mx-auto flex items-center">
                      <i className="ri-camera-lens-line mr-2"></i> Capture Picture
                    </button>
                  )}
                  
                  {faceScanStatus === 'scanning' && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <span className="text-blue-600 font-medium">Processing picture...</span>
                    </div>
                  )}

                  {faceScanStatus === 'success' && (
                    <div className="bg-green-100 border border-green-200 rounded-md p-3 flex justify-center items-center text-green-700 font-bold mx-auto">
                      <i className="ri-checkbox-circle-line mr-2 text-xl"></i> Picture Added Successfully!
                    </div>
                  )}
                </div>
              </div>

            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="uploadForm"
            className={`px-6 py-2.5 rounded-md text-white font-medium shadow-sm relative flex items-center transition-all ${faceScanStatus === 'success' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <i className="ri-upload-cloud-2-line mr-2 text-lg"></i> Submit Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadDetailsModal
