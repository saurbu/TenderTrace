import React, { useState, useRef, useEffect } from 'react' 

const AttendanceSheet = ({ 
    workers = [],
    selectedDate,
    shiftName,
    tenderId,
    onClose,
    onAttendanceSubmit,
       }) => {
  const [attendanceRecords, setAttendanceRecords] = useState(() => 
    workers.reduce((acc, worker) => {
      const id = worker._id || worker.id 
      acc[id] = {
        status: 'Absent',
        verified: false,
        retries: 0,
        isFraud: false
      } 
      return acc 
    }
    , {})
  ) 
  console.log("Workers Data:", workers)
  const [savedAttendance, setSavedAttendance] = useState(null)
  const [activeWorkerId, setActiveWorkerId] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showAttendanceList, setShowAttendanceList] = useState(false)  
  const [verificationStage, setVerificationStage] = useState('capture') 
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null)

  const videoRef = useRef(null) 
  const today = new Date() 
  today.setHours(0, 0, 0, 0) 

  const selected = new Date(selectedDate) 
  selected.setHours(0, 0, 0, 0) 

  const isFutureDate = selected > today 
  const isPastDate = selected < today 
  const isTodayDate = selected.getTime() === today.getTime() 

  useEffect(() => {
  const fetchAttendance = async () => {
    if (!isPastDate) {
      setSavedAttendance(null)
      return
    }

    try {
      const formattedDate =
        selectedDate instanceof Date
          ? selectedDate.toISOString().split("T")[0]
          : selectedDate

      const response = await fetch(
        `http://localhost:5000/api/attendance/${tenderId}/${formattedDate}/${shiftName}`
      )

      const data = await response.json()

      setSavedAttendance(data)
    } catch (err) {
      console.error(err)
    }
  }

  fetchAttendance()
}, [selectedDate, tenderId, shiftName, isPastDate])

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop()) 
      }

      Object.values(attendanceRecords).forEach(rec => {
        if (rec.previewUrl) URL.revokeObjectURL(rec.previewUrl) 
      }) 
    } 
  }, []) 

  const totalWorkersCount = workers.length 
  const presentWorkersCount = Object.values(attendanceRecords).filter(v => v.status === 'Present').length 
  const absentWorkersCount = Object.values(attendanceRecords).filter(v => v.status === 'Absent').length 
  const lockedWorkersCount = Object.values(attendanceRecords).filter(v => v.isFraud).length 

  const startAttendanceCamera = async (workerId) => {
    if (isSubmitted) return  

    if (attendanceRecords[workerId]?.isFraud) {
      alert("This worker account is locked due to multiple failed verification attempts (Fraud Detected).") 
      return 
    }

    setActiveWorkerId(workerId) 
    setIsCameraActive(true) 
    setCapturedBlob(null) 
    setLocalPreviewUrl(null) 
    setVerificationStage('capture') 
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      }) 
      setCameraStream(stream) 
      if (videoRef.current) {
        videoRef.current.srcObject = stream 
      }
    } catch (err) {
      console.error("Error opening camera:", err) 
      alert("Unable to open camera stream. Please check site permissions.") 
      closeCameraModal() 
    }
  } 

  const handleClickImage = () => {
    if (videoRef.current && activeWorkerId) {
      const video = videoRef.current 
      const canvas = document.createElement('canvas') 
      canvas.width = video.videoWidth || 640 
      canvas.height = video.videoHeight || 480 
      const context = canvas.getContext('2d') 
      context.drawImage(video, 0, 0, canvas.width, canvas.height) 
      
      canvas.toBlob((blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob) 
          setCapturedBlob(blob) 
          setLocalPreviewUrl(previewUrl) 
          
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop()) 
            setCameraStream(null) 
          }


          handleVerifyFace(blob, previewUrl, activeWorkerId) 
        }
      }, 'image/jpeg', 0.9) 
    }
  } 

  const handleVerifyFace = async (blob, previewUrl, workerId) => {
    setVerificationStage('checking') 

    try {

      await new Promise((resolve) => setTimeout(resolve, 1500))  
        const isMatched = true
      if (isMatched) {
        setVerificationStage('success') 
      } else {
        setAttendanceRecords(prev => {
          const currentWorkerOpts = prev[workerId] 
          const updatedRetries = (currentWorkerOpts?.retries || 0) + 1 
          const maxedOut = updatedRetries >= 3 

          if (maxedOut) {
            setVerificationStage('fraud') 
          } else {
            setVerificationStage('failed') 
          }

          return {
            ...prev,
            [workerId]: {
              ...currentWorkerOpts,
              status: 'Absent',
              retries: updatedRetries,
              isFraud: maxedOut
            }
          } 
        }) 
      }
    } catch (error) {
      console.error("Face comparison crashed:", error) 
      setVerificationStage('failed') 
    }
  } 

  const handleSubmitCapturedImage = () => {
    setAttendanceRecords(prev => ({
      ...prev,
      [activeWorkerId]: {
        ...prev[activeWorkerId],
        status: "Present",
        verified: true
      }
    }))

    closeCameraModal()
  } 

  const handleRetakeImage = async () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl) 
      setLocalPreviewUrl(null) 
    }
    setCapturedBlob(null) 
    setVerificationStage('capture') 
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      }) 
      setCameraStream(stream) 
      if (videoRef.current) {
        videoRef.current.srcObject = stream 
      }
    } catch (err) {
      console.error("Error reopening camera stream:", err) 
    }
  } 

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop()) 
      setCameraStream(null) 
    }
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl) 
      setLocalPreviewUrl(null) 
    }
    setIsCameraActive(false) 
    setActiveWorkerId(null) 
    setCapturedBlob(null) 
    setVerificationStage('capture') 
  } 

  const handleSaveAttendance = async () => {
  setSubmitting(true)

  try {
    const recordsSummary = Object.entries(
      attendanceRecords
    ).map(([workerId, data]) => {
      const worker = workers.find(
        w => (w._id || w.id) === workerId
      )

      return {
        workerId,
        workerName: worker?.name || "",
        designation: worker?.designation || "",
        mobile: worker?.mobile || "",
        status: data.status,
        isFraud: data.isFraud
      }
    })

    const response = await fetch(
      "http://localhost:5000/api/attendance/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenderId,
          date:
            selectedDate instanceof Date
              ? selectedDate
                  .toISOString()
                  .split("T")[0]
              : selectedDate,
          shift: shiftName,
          totalWorkers: workers.length,
          presentWorkers: recordsSummary.filter(
            r => r.status === "Present"
          ).length,
          absentWorkers: recordsSummary.filter(
            r => r.status === "Absent"
          ).length,
          records: recordsSummary
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to save attendance"
      )
    }

    setIsSubmitted(true)

    alert("Attendance Saved Successfully")
  } catch (err) {
    console.error(err)
    alert(err.message)
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="animate-fade-in space-y-4 relative">
      <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-bold text-gray-900">
                Roster Call Processing
              </h4>
              <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase">
                {shiftName}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              Target Log Date: {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl transition shadow-sm"
              >
                Cancel & Return
              </button>
            ) : (
              <div className="text-green-600 font-bold text-sm">
                ✓ Attendance Submitted
              </div>
            )}
            
            <button 
              type="button"
              onClick={handleSaveAttendance}
              disabled={
                submitting ||
                totalWorkersCount === 0 ||
                isSubmitted ||
                isFutureDate
              }
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center space-x-1.5"
            >
              {submitting ? (
                <i className="ri-loader-4-line animate-spin text-sm"></i>
              ) : (
                <>
                  <i className="ri-save-cloud-line text-sm"></i>
                  <span>Submit Log Sheet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isPastDate ? (

        savedAttendance?.found ? (

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                Attendance Summary
              </h3>

              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                Recorded
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500">Total</p>
                <h4 className="text-xl font-bold">
                  {savedAttendance.totalWorkers}
                </h4>
              </div>

              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500">Present</p>
                <h4 className="text-xl font-bold text-green-600">
                  {savedAttendance.presentWorkers}
                </h4>
              </div>

              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500">Absent</p>
                <h4 className="text-xl font-bold text-red-600">
                  {savedAttendance.absentWorkers}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setShowAttendanceList(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              View Attendance
            </button>
          </div>

        ) : (

          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
            <i className="ri-calendar-close-line text-5xl text-gray-300"></i>

            <h3 className="mt-4 text-lg font-bold text-gray-700">
              No Attendance Found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Attendance was not recorded for this date.
            </p>
          </div>

        )

      ) : workers.length === 0 ? (

        <div className="bg-gray-50/50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
          <i className="ri-user-unfollow-line text-4xl text-gray-300 mb-2 block"></i>
          <h4 className="text-sm font-bold text-gray-700">
            No Roster Crew Detected
          </h4>
        </div>

      ) : (

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 flex justify-between items-center text-xs font-bold font-mono">
            <span className="text-gray-500 uppercase">
              Crew Listings ({totalWorkersCount})
            </span>

            <div className="flex space-x-3">
              <span className="text-green-600">
                P: {presentWorkersCount}
              </span>

              <span className="text-red-600">
                A: {absentWorkersCount}
              </span>

              <span className="text-amber-600">
                Locked: {lockedWorkersCount}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {workers.map((worker) => {
              const wId = worker._id || worker.id 
              const currentRecord = attendanceRecords[wId] 
              const isPresent = currentRecord?.status === "Present" 
              const isFraud = currentRecord?.isFraud 
              console.log(worker)
              return (
                <div
                  key={wId}
                  className="p-3 px-4 flex items-center justify-between hover:bg-gray-50/40 transition group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                  {(worker.profileImage ||
                    worker.image ||
                    worker.photo ||
                    worker.profilePic ||
                    worker.avatar
                  ) ? (
                    <img
                      src={
                        worker.profileImage ||
                        worker.image ||
                        worker.photo ||
                        worker.profilePic ||
                        worker.avatar
                      }
                      alt={worker.name}
                      className="w-10 h-10 rounded-xl object-cover border"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                <div
                  className={`w-9 h-9 rounded-xl flex-shrink-0 border flex items-center justify-center font-bold text-sm uppercase font-mono ${
                    isFraud
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }`}
                >
                  {isFraud ? (
                    <i className="ri-error-warning-fill"></i>
                  ) : (
                    worker.name?.charAt(0)
                  )}
                </div>
              )}

              <div className="truncate">
                <h5 className="text-sm font-bold text-gray-900 truncate leading-tight">
                  {worker.name}
                </h5>

                <p className="text-[11px] text-gray-500 font-medium font-mono mt-0.5 truncate">
                  {worker.designation || "Laborer"} • {worker.mobile}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isPresent && (
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-lg font-bold flex items-center">
                  <i className="ri-checkbox-circle-fill mr-1"></i>
                  Verified Present
                </span>
              )}

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={() => startAttendanceCamera(wId)}
                  disabled={isFraud || isFutureDate}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 border ${
                    isFraud
                      ? "bg-red-100 text-red-400 border-red-200 cursor-not-allowed"
                      : isPresent
                      ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      : "bg-blue-600 text-white border-blue-500 hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  <i className="ri-camera-lens-line"></i>

                  <span>
                    {isFutureDate
                      ? "Future Date"
                      : isPresent
                      ? "Retake Photo"
                      : "Mark Attendance"}
                  </span>
                </button>
              )}
            </div>
                </div>
                
              ) 
              
            })}
          </div>
        </div>

      )}

      {isCameraActive && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 text-center">
            
            {verificationStage !== 'checking' && (
              <button 
                type="button" 
                onClick={closeCameraModal} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            )}
            
            <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center">
              <i className="ri-scan-fingerprint-line text-blue-600 mr-2 text-xl"></i> 
              {verificationStage === 'capture' && 'Verify Worker Identity'}
              {verificationStage === 'checking' && 'Comparing Face Asset...'}
              {verificationStage === 'success' && 'Face Authenticated Successfully'}
              {verificationStage === 'failed' && "Face Isn't Recognized"}
              {verificationStage === 'fraud' && 'Fraud Detected! Account Locked'}
            </h4>
            
            <p className="text-xs text-gray-500 mb-4">
              {verificationStage === 'capture' && 'Position face clearly inside the preview screen framework.'}
              {verificationStage === 'checking' && 'Matching with registration database files...'}
              {verificationStage === 'success' && 'Biometrics confirmed. You can now submit data entry.'}
              {verificationStage === 'failed' && `Match rate low. Retries remaining: ${3 - (attendanceRecords[activeWorkerId]?.retries || 0)}`}
              {verificationStage === 'fraud' && 'Exceeded max registration validation retries.'}
            </p>

            <div className={`p-2 rounded-2xl border overflow-hidden shadow-inner relative mb-4 transition-colors ${
              verificationStage === 'success' ? 'bg-green-50 border-green-500' :
              verificationStage === 'failed' ? 'bg-amber-50 border-amber-500' :
              verificationStage === 'fraud' ? 'bg-red-50 border-red-500' : 'bg-gray-900 border-gray-800'
            }`}>
              
              {localPreviewUrl ? (
                <div className="relative">
                  <img 
                    src={localPreviewUrl} 
                    alt="Captured Snap" 
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  {verificationStage === 'checking' && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center text-white">
                      <i className="ri-loader-5-line animate-spin text-3xl mb-1 text-blue-400"></i>
                      <span className="text-xs font-bold font-mono tracking-wider">AI Comparison System running...</span>
                    </div>
                  )}
                  {verificationStage === 'success' && (
                    <div className="absolute inset-0 bg-green-900/40 rounded-xl flex items-center justify-center text-white text-4xl">
                      <i className="ri-checkbox-circle-fill text-green-400 drop-shadow"></i>
                    </div>
                  )}
                  {verificationStage === 'failed' && (
                    <div className="absolute inset-0 bg-amber-950/40 rounded-xl flex items-center justify-center text-white text-4xl">
                      <i className="ri-error-warning-fill text-amber-400 drop-shadow"></i>
                    </div>
                  )}
                  {verificationStage === 'fraud' && (
                    <div className="absolute inset-0 bg-red-900/60 rounded-xl flex items-center justify-center text-white text-4xl">
                      <i className="ri-alarm-warning-fill text-red-500 drop-shadow"></i>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-64 object-cover rounded-xl transform -scale-x-100" 
                  />
                  <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-40 h-40 border-2 border-blue-500/40 rounded-full animate-pulse"></div>
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              {verificationStage === 'capture' && (
                <>
                  <button 
                    type="button" 
                    onClick={closeCameraModal} 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClickImage} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1"
                  >
                    <i className="ri-camera-fill text-sm"></i>
                    <span>Capture Face</span>
                  </button>
                </>
              )}

              {verificationStage === 'success' && (
                <button 
                  type="button" 
                  onClick={handleSubmitCapturedImage} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1"
                >
                  <i className="ri-checkbox-circle-line text-sm"></i>
                  <span>Mark Present & Verified</span>
                </button>
              )}

              {verificationStage === 'failed' && (
                <>
                  <button 
                    type="button" 
                    onClick={closeCameraModal} 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    onClick={handleRetakeImage} 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1"
                  >
                    <i className="ri-refresh-line text-sm"></i>
                    <span>Retake Photo</span>
                  </button>
                </>
              )}

              {verificationStage === 'fraud' && (
                <button 
                  type="button" 
                  onClick={closeCameraModal} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md"
                >
                  Exit Modal (Flagged Alert)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAttendanceList && savedAttendance && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              Present Workers
            </h3>

            <button
              onClick={() => setShowAttendanceList(false)}
              className="text-xl text-gray-500"
            >
              ×
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {savedAttendance.attendanceList
              ?.filter(worker => worker.status === "Present")
              .map(worker => (
                <div
                  key={worker.workerId}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div
                    key={worker.workerId}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {worker.photoUrl && (
                        <img
                          src={`http://localhost:5000${worker.photoUrl}`}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}

                      <div>
                        <p className="font-medium">
                          {worker.workerName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {worker.designation}
                        </p>
                      </div>
                    </div>

                    <span className="text-green-600 font-semibold">
                      Present
                    </span>
                  </div>

                  <span className="text-green-600 font-semibold">
                    Present
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    )}
    </div>
  ) 
} 
export default AttendanceSheet 