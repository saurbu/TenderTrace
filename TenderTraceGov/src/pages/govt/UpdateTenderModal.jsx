import React from 'react'

const UpdateTenderModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProject = {
      id: formData.get('id'),
      tenderName: formData.get('tenderName'),
      companyName: formData.get('companyName'),
      email: formData.get('email'),
      timePeriod: formData.get('timePeriod'),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      budget: `₹ ${(parseInt(formData.get('budget')) / 10000000).toFixed(2)} Cr`,
      status: 'Pending',
      locationInfo: `${formData.get('locationFrom')} to ${formData.get('locationTo')}`
    };
    onSubmit(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Update Tender Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="tenderForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tender Name / Project Title */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tender Name / Project Title</label>
                <input type="text" name="tenderName" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. Highway Expansion Phase III" />
              </div>

              {/* Company Name */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <input type="text" name="companyName" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Enter contracting company name" />
              </div>

              {/* Unique ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Unique ID</label>
                <input type="text" name="id" required pattern="[A-Za-z0-9\-]+" title="Unique ID should only contain letters, numbers, and hyphens" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Tender/Contract ID" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Contact email" />
              </div>

              {/* Location From */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location (From)</label>
                <div className="relative">
                  <select name="locationFrom" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow">
                    <option value="">Select origin...</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-3 text-gray-500 pointer-events-none"></i>
                </div>
              </div>

              {/* Location To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location (To)</label>
                <div className="relative">
                  <select name="locationTo" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow">
                    <option value="">Select destination...</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-3 text-gray-500 pointer-events-none"></i>
                </div>
              </div>

              {/* Budget Alloted */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Budget Allotted (₹)</label>
                <input type="number" name="budget" required min="0" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. 50000000" />
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time Period (Months)</label>
                <input type="number" name="timePeriod" required min="1" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. 18" />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium focus:ring-2 focus:ring-gray-200 outline-none"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="tenderForm"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 outline-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              <i className="ri-check-line mr-2 text-lg"></i> Update Details
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateTenderModal
