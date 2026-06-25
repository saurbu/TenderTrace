import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/workers/project/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error retrieving workforce details:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

<nav className="bg-gray-900 text-white shadow-xl sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex items-center space-x-4">

        <button 
          onClick={() => navigate(`/constructor-project/${id}`)} 
          className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-lg"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-wider">Workforce Directory</h1>
          <p className="text-xs text-gray-400 font-mono">Tender Associated ID: {id}</p>
        </div>
      </div>
      
      <div className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded-full font-mono font-bold">
        Total Roster: {workers.length} Members
      </div>
    </div>
  </div>
</nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Personnel Roster</h2>
          <p className="text-gray-600 text-sm mt-1">Reviewing full legal identities and verification metrics associated with this deployment space.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin mb-2 block"></i>
            <p className="text-gray-500 font-medium">Retrieving workspace staff registries...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <i className="ri-team-line text-5xl text-gray-300 mb-4 block"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Roster is Empty</h3>
            <p className="text-gray-500 text-sm mb-6">No records have been appended to this configuration space yet.</p>
            <button
              onClick={() => navigate(`/constructor-project-space/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition shadow"
            >
              Go Onboard Staff
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div key={worker._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex-shrink-0">
                      {worker.imageUrl ? (
                        <img src={worker.imageUrl} alt={worker.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                          <i className="ri-user-4-fill text-3xl"></i>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate text-base">{worker.name}</h4>
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md mt-1 border border-blue-100">
                        {worker.designation}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center"><i className="ri-phone-line mr-2"></i> Contact</span>
                      <span className="font-mono text-gray-800 font-semibold">{worker.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center"><i className="ri-shield-user-line mr-2"></i> Identity Card</span>
                      <span className="font-mono text-gray-800 font-semibold tracking-wider">
                        {worker.aadhaar ? `${worker.aadhaar.substring(0, 4)}-XXXX-XXXX` : 'XXXX-XXXX-XXXX'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400 flex items-center mb-1"><i className="ri-map-pin-line mr-2"></i> Registered Address</span>
                      <p className="text-gray-600 bg-gray-50 p-2.5 rounded-xl text-xs leading-relaxed border border-gray-100 max-h-[64px] overflow-y-auto">
                        {worker.address || 'No registration details provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerDetails;