import React from "react";

const ComplaintDetailsModal = ({ isOpen, onClose, complaint }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-[400px]">
        
        <h2 className="text-xl font-bold mb-3">
          Complaint Details
        </h2>

        <div className="text-sm space-y-2">
          <p><b>Title:</b> {complaint?.title || "N/A"}</p>
          <p><b>Description:</b> {complaint?.description || "N/A"}</p>
          <p><b>Status:</b> {complaint?.status || "Pending"}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default ComplaintDetailsModal;