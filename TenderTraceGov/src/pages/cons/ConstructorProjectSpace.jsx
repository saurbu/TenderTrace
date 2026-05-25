import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ConstructorProjectSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    designation: '',
    address: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/workers/project/${id}`)
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tenderId: id })
      });
      if (!res.ok) throw new Error("Failed to save");
      
      const newWorker = await res.json();
      setWorkers([newWorker, ...workers]);
      setFormData({ name: '', aadhaar: '', designation: '', address: '', imageUrl: '' });
      alert("Worker onboarded successfully!");
    } catch (err) {
      alert("Error onboarding worker");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-gray-900 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/constructor-dashboard')} className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <h1 className="text-xl font-bold tracking-wider hidden sm:block">Project Workspace</h1>
              <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full font-mono border border-gray-700">Tender ID: {id}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 hidden md:block"><i className="ri-shield-check-fill mr-1 text-green-400"></i> Secure Database Sync</span>
              <button
                onClick={() => navigate('/constructor-dashboard')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-lg">
                <i className="ri-logout-box-r-line mr-2"></i>
                Exit Workspace
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 animate-fade-in-down">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Worker Registration & Logistics</h2>
          <p className="text-gray-600 mt-2 text-lg">Onboard daily wage workers and core operators to sync with the central Auth database.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Form (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="ri-user-add-line text-blue-600 mr-2 text-2xl"></i> Upload Worker Details
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Legal Name</label>
                    <input 
                      type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Aadhaar / Gov ID No.</label>
                    <input 
                      type="text" required value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Designation / Skill role</label>
                    <select 
                      required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select Designation...</option>
                      <option value="Laborer">Laborer</option>
                      <option value="Mason">Mason</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Foreman">Foreman</option>
                      <option value="Site Engineer">Site Engineer</option>
                      <option value="Heavy Machinery Operator">Heavy Machinery Operator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Capture Image Data (URL Link)</label>
                    <input 
                      type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="https://image-url..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Permanent Address / Contact Info</label>
                    <textarea 
                      rows="3" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Enter complete home address details..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center min-w-[200px]">
                    {loading ? <i className="ri-loader-4-line animate-spin text-xl"></i> : <><i className="ri-save-3-line mr-2"></i> Register Worker Base</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Worker Roster */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl sticky top-24 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6 flex justify-between items-center pb-4 border-b border-gray-800">
                <span>Total Workforce</span>
                <span className="bg-blue-600 text-white text-sm py-1 px-3 rounded-full font-mono">{workers.length}</span>
              </h3>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {workers.length === 0 ? (
                  <div className="text-center py-10 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
                    <i className="ri-team-line text-4xl text-gray-500 mb-3 block"></i>
                    <p className="text-gray-400 font-medium px-4">No worker details uploaded yet.<br/>Please add members.</p>
                  </div>
                ) : (
                  workers.map((worker) => (
                    <div key={worker._id} className="bg-gray-800 border-l-4 border-blue-500 border-y-0 border-r-0 p-4 rounded-xl flex items-center space-x-4 shadow hover:bg-gray-700 transition">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {worker.imageUrl ? (
                           <img src={worker.imageUrl} alt={worker.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400"><i className="ri-user-4-fill text-2xl"></i></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate text-sm">{worker.name}</p>
                        <p className="text-xs text-blue-400 font-semibold truncate mb-1">{worker.designation}</p>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">{worker.aadhaar.substring(0, 4)}-XXXX-XXXX</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ConstructorProjectSpace;