import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComplaintModal from "../components/ComplaintModal";

const ProjectDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  // const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [materialHistory, setMaterialHistory] = useState([]);
  const [dailyReport, setDailyReport] = useState(null);

  const [attendance, setAttendance] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {

  const fetchProjectDetails = async () => {
  try {
    setLoading(true);
    setAttendance(null);
    setDailyReport(null);

    const formattedDate = formatDate(selectedDate);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/project/${id}/details-by-date/${formattedDate}`
    );

    const result = await res.json();

    if (result.success) {
      setProject(result.data.project);
      setMaterialHistory(result.data.materialHistory);
      setDailyReport(result.data.dailyReport);
      setAttendance(result.data.attendance);
    } else {
      console.log("Project:", project);

      console.log("itemId:",
        project?.tenderId ||
        project?.id ||
        project?._id
      );

      console.log("itemTitle:",
        project?.tenderName ||
        project?.billTitle
      );

      console.log("isBill:", !!project?.billTitle);
      const billRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bills/${id}`
      );
      const billData = await billRes.json();

      if (billData.success) {
        setProject(billData.data);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  fetchProjectDetails();

}, [id, selectedDate]);


  const formatDate = (date) => {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const totalSpent = materialHistory.reduce(
    (sum, item) =>
      sum + Number(item.totalSpend || 0),
    0
  );

  const budgetLeft =
    Number(project?.budget || 0) -
    totalSpent;


  const handleDateClick = (day) => {

    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    setSelectedDate(clickedDate);
  };

  const changeMonth = (direction) => {

    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1
      )
    );
  };


  const getStatusColor = (status) => {

    switch (status) {

      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Pending":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">

        <h2 className="text-3xl font-bold mb-4">
          Project Not Found
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Go Back
        </button>

      </div>
    );
  }
  const handleComplaintSubmit = async (formData) => {
  try {

    const isBill = !!project?.billTitle;

    formData.append(
      "itemId",
      isBill
        ? project?.id
        : project?.tenderId || project?._id
    );

    formData.append(
      "itemTitle",
      isBill
        ? project?.billTitle
        : project?.tenderName
    );

    formData.append(
      "itemType",
      isBill ? "bill" : "tender"
    );
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/complaints`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to submit complaint"
      );
    }

    alert("Complaint Submitted Successfully");
    setIsComplaintModalOpen(false);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
  <>
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Budget</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{Number(project.budget || 0).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold text-red-600">
            ₹{totalSpent.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Budget Left</p>
          <h2 className="text-2xl font-bold text-blue-600">
            ₹{budgetLeft.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Reports Submitted</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {materialHistory.length}
          </h2>
        </div>

      </div>

      <div className="grid lg:grid-cols-12 gap-6">

        <div className="lg:col-span-3 space-y-6">

          <div className="bg-white rounded-3xl p-6 shadow">

            <div className="flex justify-between items-start mb-4">

              <h2 className="font-bold text-xl">
                {project?.id ||
                  project?.tenderId ||
                  project?.projectId ||
                  "N/A"}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>

            </div>

            <h3 className="font-bold text-lg mb-2">
              {project.tenderName || project.billTitle}
            </h3>

            <p className="text-blue-600 font-semibold mb-4">
              {project.companyName || project.department}
            </p>

            <div className="space-y-3 text-sm">

              <div>
                <span className="text-gray-500">
                  Location
                </span>
                <p className="font-semibold">
                  {project.location}
                </p>
              </div>

              <div>
                <span className="text-gray-500">
                  Created On
                </span>
                <p className="font-semibold">
                  {project.createdAt
                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

            </div>

            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="w-full mt-5 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition"
            >
              <i className="ri-error-warning-line mr-2"></i>
              Report Project
            </button>

          </div>

          <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800">

            <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-4">

              <h3 className="text-xl font-bold text-white flex items-center">
                <i className="ri-calendar-todo-line text-blue-500 mr-2"></i>
                Calendar
              </h3>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    changeMonth(-1)
                  }
                  className="text-gray-400 hover:text-white p-1 bg-gray-800 rounded"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>

                <button
                  onClick={() =>
                    changeMonth(1)
                  }
                  className="text-gray-400 hover:text-white p-1 bg-gray-800 rounded"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>

              </div>

            </div>

            <div className="text-center text-blue-400 font-bold mb-3">
              {monthNames[currentDate.getMonth()]}{" "}
              {currentDate.getFullYear()}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-1">

              {Array.from({
                length: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1
                ).getDay(),
              }).map((_, index) => (
                <div
                  key={index}
                  className="p-2"
                />
              ))}

              {Array.from({
                length: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  0
                ).getDate(),
              }).map((_, index) => {

                const day = index + 1;

                const isSelected =
                  selectedDate &&
                  day ===
                    selectedDate.getDate() &&
                  currentDate.getMonth() ===
                    selectedDate.getMonth() &&
                  currentDate.getFullYear() ===
                    selectedDate.getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() =>
                      handleDateClick(day)
                    }
                    className={`p-2 rounded-lg text-white text-sm ${
                      isSelected
                        ? "bg-blue-500"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}

            </div>

          </div>

        </div>

        <div className="lg:col-span-6">

          <div className="bg-white rounded-3xl p-6 shadow">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-2xl font-bold">
                  Project Detail
                </h2>

                <p className="text-gray-500">
                  {selectedDate.toLocaleDateString()}
                </p>
              </div>

              <div className="bg-blue-100 px-4 py-2 rounded-xl">
                <span className="text-blue-700 font-bold">
                  Daily Spend:
                  ₹
                  {dailyReport?.totalSpend || 0}
                </span>
              </div>

            </div>

            {!dailyReport ? (

              <div className="text-center py-20 text-gray-500">
                No Material Report Found
              </div>

            ) : (

              <div className="space-y-4">

                {dailyReport.materials?.map(
                  (material, index) => (

                    <div
                      key={index}
                      className="border rounded-2xl p-4"
                    >

                      <div className="flex justify-between">

                        <div>
                          <h3 className="font-bold text-lg">
                            {material.name}
                          </h3>

                          <p className="text-gray-500">
                            Quantity:
                            {" "}
                            {material.quantity}
                          </p>

                          <p className="text-gray-500">
                            Price:
                            {" "}
                            ₹{material.price}
                          </p>

                          <p className="font-bold text-green-600">
                            Total:
                            {" "}
                            ₹{material.total}
                          </p>
                        </div>

                      </div>

                      <div className="grid md:grid-cols-3 gap-3 mt-4">

                        {material.images?.product && (
                          <img
                            src={material.images.product}
                            alt="Product"
                            className="h-40 w-full object-cover rounded-xl cursor-pointer hover:scale-105 transition"
                            onClick={() => setSelectedImage(material.images.product)}
                          />
                        )}

                        {material.images?.bill && (
                          <img
                            src={material.images.bill}
                            alt="Bill"
                            className="h-40 w-full object-cover rounded-xl cursor-pointer hover:scale-105 transition"
                            onClick={() => setSelectedImage(material.images.bill)}
                          />
                        )}

                        {material.images?.barcode && (
                          <img
                            src={material.images.barcode}
                            alt="Barcode"
                            className="h-40 w-full object-cover rounded-xl cursor-pointer hover:scale-105 transition"
                            onClick={() => setSelectedImage(material.images.barcode)}
                          />
                        )}
                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </div>

        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-bold text-lg mb-4">Morning Shift</h3>
            {attendance?.morning ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <h4 className="text-xl font-bold">{attendance.morning.total}</h4>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Present</p>
                  <h4 className="text-xl font-bold text-green-600">{attendance.morning.present}</h4>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Absent</p>
                  <h4 className="text-xl font-bold text-red-600">
                    {attendance.morning.total - attendance.morning.present}
                  </h4>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic text-center py-4">No attendance recorded</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-bold text-lg mb-4">Evening Shift</h3>
            {attendance?.evening ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <h4 className="text-xl font-bold">{attendance.evening.total}</h4>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Present</p>
                  <h4 className="text-xl font-bold text-green-600">{attendance.evening.present}</h4>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Absent</p>
                  <h4 className="text-xl font-bold text-red-600">
                    {attendance.evening.total - attendance.evening.present}
                  </h4>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic text-center py-4">No attendance recorded</p>
            )}
          </div>

        </div>
      </div>
    </div>
    <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        tenderId={
          project?.tenderId ||
          project?.billId ||
          project?._id
        }
        tenderName={
          project?.tenderName ||
          project?.billTitle ||
          project?.title ||
          "Unknown Project"
        }
        itemType={project?.billId ? "bill" : "tender"}
      />
    {selectedImage && (
      <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">

        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-6 right-6 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          ✕ Close
        </button>

        <img
          src={selectedImage}
          alt="Preview"
          className="max-w-[95vw] max-h-[90vh] rounded-xl shadow-2xl"
        />
      </div>
    )}
  </>
);
};
export default ProjectDetails;