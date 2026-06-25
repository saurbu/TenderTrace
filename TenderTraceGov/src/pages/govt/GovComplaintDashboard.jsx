import React, { useEffect, useState } from "react";

const GovComplaintDashboard = ({ onClose }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTender, setSelectedTender] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complaint Management
            </h1>

            <p className="text-gray-500 mt-1">
              View citizen complaints and evidence photos
            </p>
          </div>

          {/* <button
            onClick={onClose}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition shadow"
          >
            Back to Dashboard
          </button> */}

        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Complaints Found
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {complaints.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl shadow border hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>

                <div className="p-5">

                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">
                      Complaint
                    </span>

                    <span className="text-xs text-gray-500">
                      {c.images?.length || 0} Photos
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {c.itemTitle}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      ID: {c.itemCode}
                    </span>

                    <span
                      className={`px-2 py-1 rounded font-medium ${
                        c.itemType === "bill"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {c.itemType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2">

                    {c.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt="complaint"
                        className="h-28 w-full rounded-lg object-cover cursor-pointer hover:scale-105 transition"
                        onClick={() => {
                          setSelectedImage(img.url);
                          setSelectedTender(c.tenderName);
                        }}
                      />
                    ))}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6">

          <div className="w-full max-w-5xl flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold">
              {selectedTender}
            </h2>

            <button
              onClick={() => setSelectedImage(null)}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Close Image
            </button>
          </div>

          <img
            src={selectedImage}
            alt="Complaint Evidence"
            className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default GovComplaintDashboard;