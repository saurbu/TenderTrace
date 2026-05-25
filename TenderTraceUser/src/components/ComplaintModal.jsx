import React, { useState } from 'react';

const ComplaintModal = ({ isOpen, onClose, tenderTitle, tenderId }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    subject: `Complaint regarding Tender #${tenderId} - ${tenderTitle}`,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newComplaint = {
      ...formData,
      tenderId: tenderId || 'unknown',
      date: new Date().toLocaleString(),
      status: 'Pending'
    };

    fetch('http://localhost:5000/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComplaint)
    })
      .then(res => res.json())
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({ email: '', name: '', subject: `Complaint regarding Tender #${tenderId} - ${tenderTitle}`, description: '' });
        }, 2000);
      })
      .catch((err) => {
        console.error("Error submitting complaint:", err);
        setIsSubmitting(false);
        alert('Failed to submit complaint');
      });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform animate-scale-in">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">Raise a Complaint</h2>
            <p className="text-sm text-gray-500 font-medium">This report will be sent directly to the Government Portal.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-bounce-short">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <i className="ri-checkbox-circle-fill text-5xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h3>
              <p className="text-gray-600">The relevant authorities have been notified and will review your report shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                   <input 
                    type="text" 
                    readOnly 
                    value={formData.subject}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                <textarea 
                  required 
                  rows="4" 
                  placeholder="Please describe the issue or malpractice in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-4 px-6 border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <i className="ri-error-warning-line mr-2 text-lg"></i>
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;