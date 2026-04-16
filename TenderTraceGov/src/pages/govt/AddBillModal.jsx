import React from 'react'

const AddBillModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Add New Bill</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="billForm" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bill Title */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bill Title</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. Infrastructure Modernization Act" />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                <select required className="w-full border border-gray-300 rounded-md px-4 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow">
                  <option value="">Select Department...</option>
                  <option value="Transportation">Ministry of Road Transport and Highways</option>
                  <option value="Urban">Ministry of Housing and Urban Affairs</option>
                  <option value="Finance">Ministry of Finance</option>
                  <option value="Power">Ministry of Power</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select required className="w-full border border-gray-300 rounded-md px-4 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow">
                  <option value="">Select Status...</option>
                  <option value="Introduced">Introduced</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Passed">Passed</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. Pune City Sector" />
              </div>

              {/* Ward No */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ward No.</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. 45-B" />
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Date</label>
                <input type="date" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
              </div>

              {/* Associated Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Associated Budget (₹)</label>
                <input type="number" min="0" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. 1000000 (Optional)" />
              </div>

              {/* Summary */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bill Summary</label>
                <textarea required rows="4" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="Provide a brief summary of the bill..." />
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
            form="billForm"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 outline-none relative flex flex-row items-center"
          >
            <i className="ri-file-add-line mr-2 text-lg"></i> Add Bill
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBillModal
