import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AttendanceSheet from './AttendanceSheet'; 
import MaterialDashboardPanel from "./MaterialDashboardPanel";
const ConstructorProjectSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null); 
  
  // States to handle active inline attendance view inside logs area
  const [isAttendanceViewActive, setIsAttendanceViewActive] = useState(false);
  const [activeShift, setActiveShift] = useState(''); 

  // --- SHIFT-SPECIFIC STATES ---
  const [morningSubmitted, setMorningSubmitted] = useState(false);
  const [eveningSubmitted, setEveningSubmitted] = useState(false);
  const [morningStats, setMorningStats] = useState({ total: 0, present: 0 });
  const [eveningStats, setEveningStats] = useState({ total: 0, present: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewAttendanceModal, setViewAttendanceModal] = useState(false);
  const [selectedShiftData, setSelectedShiftData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    aadhaar: '',
    designation: '',
    address: '',
    imageFile: null 
  });
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Fetch workers list and saved shift summaries for selected dates
  useEffect(() => {
    fetch(`http://localhost:5000/api/workers/project/${id}`)
      .then(res => res.json())
      .then(data => {
        setWorkers(data);
      })
      .catch(err => console.error(err));

    // Pull status data from database to restore card view metrics
    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    fetch(`http://localhost:5000/api/attendance/status/${id}?date=${formattedDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.morning) {
          setMorningSubmitted(true);
          setMorningStats({ 
            total: data.morning.total ?? 0, 
            present: data.morning.present ?? 0 
          });
        } else {
          setMorningSubmitted(false);
          setMorningStats({ total: 0, present: 0 });
        }
        if (data.evening) {
          setEveningSubmitted(true);
          setEveningStats({ 
            total: data.evening.total ?? 0, 
            present: data.evening.present ?? 0 
          });
        } else {
          setEveningSubmitted(false);
          setEveningStats({ total: 0, present: 0 });
        }
      })
      .catch(err => console.error("Error fetching status logs:", err));
  }, [id, selectedDate]);

  // Callback function executed inside AttendanceSheet submission
  const handleAttendanceCompletion = async (shiftName, presentWorkersCount) => {
    setIsSubmitting(true);
    const totalWorkersCount = workers.length;
    const verifiedPresentCount = Number(presentWorkersCount) || 0;

    const payload = {
      tenderId: id,
      date: selectedDate || new Date(),
      shift: shiftName,
      totalWorkers: totalWorkersCount,
      presentWorkers: verifiedPresentCount
    };

    // Safely check which shift was submitted using lowercase matching
    const isMorningShift = shiftName.toLowerCase().includes('morning');

    // Optimistically update metrics locally right away so the user sees results instantly
    if (isMorningShift) {
      setMorningStats({ total: totalWorkersCount, present: verifiedPresentCount });
      setMorningSubmitted(true);
    } else {
      setEveningStats({ total: totalWorkersCount, present: verifiedPresentCount });
      setEveningSubmitted(true);
    }
    setIsAttendanceViewActive(false);

    try {
      const res = await fetch('http://localhost:5000/api/attendance/save-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Database Sync Failed");
      alert(`${shiftName} attendance saved successfully.`);
    } catch (err) {
      console.error(err);
      alert("Error saving dashboard data to server. Local fallback display active.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleViewAttendance = async (shiftName) => {
    try {
      const formattedDate =
        selectedDate instanceof Date
          ? selectedDate.toISOString().split("T")[0]
          : selectedDate;

      const response = await fetch(
        `http://localhost:5000/api/attendance/${id}/${formattedDate}/${shiftName}`
      );

      const data = await response.json();

      if (data.found) {
        setSelectedShiftData(data);
        setViewAttendanceModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAadhaarChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); 
    const trimmed = rawValue.slice(0, 12); 
    const parts = trimmed.match(/.{1,4}/g);
    const formatted = parts ? parts.join(' ') : '';
    setFormData({ ...formData, aadhaar: formatted });
  };

  const handleMobileChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const trimmed = rawValue.slice(0, 10);
    setFormData({ ...formData, mobile: trimmed });
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, 
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera interface:", err);
      alert("Unable to open live camera stream.");
      setIsCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `worker_snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFormData({ ...formData, imageFile: file });
        }
        stopCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setIsCameraActive(false);
  };

  const closeFormModal = () => {
    stopCamera();
    setShowFormModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const multiPartForm = new FormData();
    multiPartForm.append('name', formData.name);
    multiPartForm.append('mobile', formData.mobile);
    multiPartForm.append('aadhaar', formData.aadhaar.replace(/\s/g, '')); 
    multiPartForm.append('designation', formData.designation);
    multiPartForm.append('address', formData.address);
    multiPartForm.append('tenderId', id);
    if (formData.imageFile) multiPartForm.append('imageFile', formData.imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/workers', { method: 'POST', body: multiPartForm });
      if (!res.ok) throw new Error("Failed to save");
      const newWorker = await res.json();
      setWorkers([newWorker, ...workers]);
      setFormData({ name: '', mobile: '', aadhaar: '', designation: '', address: '', imageFile: null });
      closeFormModal(); 
      alert("Worker onboarded successfully!");
    } catch (err) {
      alert("Error onboarding worker");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
    setCurrentDate(new Date(newDate));
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setIsAttendanceViewActive(false); 
    setActiveShift('');
  };

  const isSelectedDateToday = () => {
    if (!selectedDate) return false;
    const today = new Date();
    return selectedDate.getDate() === today.getDate() &&
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getFullYear() === today.getFullYear();
  };

  const isTodayActive = isSelectedDateToday();

  const handleLaunchAttendance = (shiftName) => {
    setActiveShift(shiftName);
    setIsAttendanceViewActive(true);
  };

  const handleCloseLogs = () => {
    setSelectedDate(null);
    setIsAttendanceViewActive(false);
    setActiveShift('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
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
              <button onClick={() => setShowFormModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-lg">
                <i className="ri-user-add-line mr-2"></i>Add Workers
              </button>
              <button onClick={() => navigate('/constructor-dashboard')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-lg">
                <i className="ri-logout-box-r-line mr-2"></i>Exit
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 animate-fade-in-down">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2">
            {!selectedDate ? (
              <MaterialDashboardPanel />
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm transition-all duration-300">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Operational Log</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2 flex items-center">
                      <i className="ri-fingerprint-line text-blue-500 mr-2"></i> Attendance
                    </h3>
                  </div>
                  <button 
                    onClick={handleCloseLogs} 
                    className="text-sm font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition"
                  >
                    <i className="ri-close-line mr-1"></i> Close Logs
                  </button>
                </div>

                <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="ri-calendar-event-line text-2xl text-blue-600"></i>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Selected Date Target</p>
                      <p className="text-base font-bold text-gray-900 font-mono">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {!isTodayActive && (
                    <span className="text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl flex items-center">
                      <i className="ri-lock-2-line mr-1 text-sm"></i> Attendance Locked
                    </span>
                  )}
                </div>

                {isAttendanceViewActive ? (
                  <AttendanceSheet 
                    workers={workers}
                    selectedDate={selectedDate}
                    shiftName={activeShift}
                    tenderId={id}
                    onClose={() => setIsAttendanceViewActive(false)}
                    onAttendanceSubmit={(presentCount) => handleAttendanceCompletion(activeShift, presentCount)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    
                    {/* Morning Shift Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1 rounded-full flex items-center font-mono">
                            <i className="ri-sun-cloudy-line mr-1 text-sm"></i> Morning Attendance
                          </span>
                          <span className="text-gray-400 font-mono text-xs font-bold tracking-wider">FIRST</span>
                        </div>
                        <h4 className="text-xl font-extrabold text-gray-900 mb-1">10:00 AM Session</h4>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">Log entries for raw labor clock-ins, primary verification checks, and safety briefings.</p>
                        
                        {/* Metrics Report Block */}
                        {morningSubmitted && (
                          <div className="bg-blue-900 text-white rounded-xl p-4 mb-5 text-center border border-blue-950 shadow-inner animate-fade-in">
                            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Shift Dashboard Report</div>
                            <div className="grid grid-cols-2 gap-2 divide-x divide-blue-800">
                              <div>
                                <div className="text-2xl font-black font-mono">{morningStats.total}</div>
                                <div className="text-[10px] text-blue-200">Total Workers</div>
                              </div>
                              <div>
                                <div className="text-2xl font-black font-mono text-green-400">{morningStats.present}</div>
                                <div className="text-[10px] text-blue-200">Present Workers</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        {morningSubmitted ? (
                          <div className="space-y-3">
                            <div className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 text-center font-bold text-green-600">
                              ✓ Completed
                            </div>

                            <button
                              onClick={() =>
                                handleViewAttendance("Morning Shift (10:00 AM)")
                              }
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
                            >
                              👁 View Attendance
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={!isTodayActive || isSubmitting}
                            onClick={() =>
                              handleLaunchAttendance("Morning Shift (10:00 AM)")
                            }
                            className={`w-full py-3 rounded-xl font-bold transition ${
                              isTodayActive
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Take Attendance
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Evening Shift Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="bg-indigo-100 text-indigo-800 font-bold text-xs px-3 py-1 rounded-full flex items-center font-mono">
                            <i className="ri-sunset-line mr-1 text-sm"></i> Evening Attendance
                          </span>
                          <span className="text-gray-400 font-mono text-xs font-bold tracking-wider">SECOND</span>
                        </div>
                        <h4 className="text-xl font-extrabold text-gray-900 mb-1">04:00 PM Session</h4>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">Log check-outs, recorded shift hours completions, and site structural clearance validations.</p>
                        
                        {/* Metrics Report Block */}
                        {eveningSubmitted && (
                          <div className="bg-blue-900 text-white rounded-xl p-4 mb-5 text-center border border-blue-950 shadow-inner animate-fade-in">
                            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Shift Dashboard Report</div>
                            <div className="grid grid-cols-2 gap-2 divide-x divide-blue-800">
                              <div>
                                <div className="text-2xl font-black font-mono">{eveningStats.total}</div>
                                <div className="text-[10px] text-blue-200">Total Workers</div>
                              </div>
                              <div>
                                <div className="text-2xl font-black font-mono text-green-400">{eveningStats.present}</div>
                                <div className="text-[10px] text-blue-200">Present Workers</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        {eveningSubmitted ? (
                          <div className="space-y-3">
                            <div className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 text-center font-bold text-green-600">
                              ✓ Completed
                            </div>

                            <button
                              onClick={() =>
                                handleViewAttendance("Evening Shift (04:00 PM)")
                              }
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
                            >
                              👁 View Attendance
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={!isTodayActive || isSubmitting}
                            onClick={() =>
                              handleLaunchAttendance("Evening Shift (04:00 PM)")
                            }
                            className={`w-full py-3 rounded-xl font-bold transition ${
                              isTodayActive
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Take Attendance
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Column Layout */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800 text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <i className="ri-team-line text-3xl text-blue-500"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Total Workforce</h3>
              <p className="text-gray-400 text-sm mb-6">Currently registered project members</p>
              <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-800 mb-6">
                <span className="text-4xl font-extrabold text-white font-mono">{workers.length}</span>
                <span className="text-gray-500 ml-2 text-sm font-semibold">Active Profiles</span>
              </div>
              <button onClick={() => navigate(`/worker-details/${id}`)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer">
                <i className="ri-eye-line text-lg"></i><span>View All Workers</span>
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800">
              <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <i className="ri-calendar-todo-line text-blue-500 mr-2"></i> Attendance
                </h3>
                <div className="flex space-x-2">
                  <button onClick={() => changeMonth(-1)} className="text-gray-400 cursor-pointer hover:text-white p-1 bg-gray-800 rounded">
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <button onClick={() => changeMonth(1)} className="text-gray-400 cursor-pointer hover:text-white p-1 bg-gray-800 rounded">
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>
              
              <div className="text-center text-blue-400 font-bold mb-3 tracking-wide">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-centern  text-xs font-mono text-gray-300">
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2"></div>
                ))}
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, index) => {
                  const day = index + 1;
                  const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                  const isSelected = selectedDate && day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();

                  return (
                    <button 
                      key={`day-${day}`} 
                      onClick={() => handleDateClick(day)}
                      className={`p-2 rounded-lg transition-all focus:outline-none ${
                        isSelected ? 'bg-blue-500 text-white font-extrabold shadow-lg scale-110 ' : isToday ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'hover:bg-gray-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Popup Form Modal Area */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative border border-gray-100 max-h-[95vh] overflow-y-auto">
            <button onClick={closeFormModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition cursor-pointer">
              <i className="ri-close-line text-xl"></i>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <i className="ri-user-add-line text-blue-600 mr-2 text-2xl"></i> Register New Worker Details
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Legal Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Rahul Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number (10 Digits)</label>
                  <input type="text" required pattern="[0-9]{10}" value={formData.mobile} onChange={handleMobileChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" placeholder="Enter 10 digit number" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Aadhaar Number (Gov ID)</label>
                  <input type="text" required pattern="[0-9]{4}\s[0-9]{4}\s[0-9]{4}" value={formData.aadhaar} onChange={handleAadhaarChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono tracking-widest" placeholder="0000 0000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Designation / Skill role</label>
                  <select required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                    <option value="">Select Designation...</option>
                    <option value="Laborer">Laborer</option>
                    <option value="Mason">Mason</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Foreman">Foreman</option>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Heavy Machinery Operator">Heavy Machinery Operator</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex">
                  <label className="block text-sm font-bold text-gray-700 mb-2 pr-3 mt-5">Capture Worker Photo</label>
                  {isCameraActive ? (
                    <div className="flex flex-col items-center space-y-3 bg-gray-900 p-4 rounded-2xl border border-gray-800">
                      <video ref={videoRef} autoPlay playsInline className="w-full max-h-60 rounded-xl object-cover transform -scale-x-100" />
                      <div className="flex space-x-3 w-full">
                        <button type="button" onClick={captureSnapshot} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg flex items-center justify-center"><i className="ri-camera-fill mr-2 text-lg"></i> Take Snapshot</button>
                        <button type="button" onClick={stopCamera} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button type="button" onClick={startCamera} className="flex items-center justify-center bg-blue-50 text-blue-700 border-2 border-dashed border-blue-300 rounded-xl p-3 cursor-pointer hover:bg-blue-100 transition"><i className="ri-camera-lens-line text-2xl mr-2"></i><span className="font-semibold text-sm">Open Camera</span></button>
                      {formData.imageFile && <div className="text-xs text-green-600 bg-green-50 border border-green-200 py-2 px-3 rounded-lg flex items-center font-semibold whitespace-nowrap"><i className="ri-checkbox-circle-fill mr-1 text-base"></i> Photo Cached!</div>}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Permanent Address / Contact Info</label>
                  <textarea rows="3" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Enter complete home address details..."></textarea>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                <button type="button" onClick={closeFormModal} className=" bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center min-w-[180px]">
                  {loading ? <i className="ri-loader-4-line animate-spin text-xl"></i> : <><i className="ri-save-3-line mr-2"></i>Add Worker </>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewAttendanceModal && selectedShiftData && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

    <div className="bg-white rounded-2xl p-5 w-full max-w-md">

      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">
          {selectedShiftData?.shift || "Attendance Details"}
        </h3>

        <button
          onClick={() => setViewAttendanceModal(false)}
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">

                {selectedShiftData.attendanceList
                  ?.filter(w => w.status === "Present")
                  .map(worker => (
                    <div
                      key={worker.workerId}
                      className="border rounded-lg p-3 flex justify-between"
                    >
                      <div>
                        <p className="font-semibold">
                          {worker.workerName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {worker.designation}
                        </p>
                      </div>

                      <span className="text-green-600 font-bold">
                        Present
                      </span>
                    </div>
                  ))}

              </div>
            </div>

          </div>
        )}
    </div>
  );
  
};

export default ConstructorProjectSpace;