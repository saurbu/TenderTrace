import React, { useEffect, useRef, useState } from "react";

const stateDistrictMap = {
  AndhraPradesh: [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
    "Kurnool", "Nellore", "Prakasam", "Srikakulam",
    "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],

  ArunachalPradesh: [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare",
    "Lower Subansiri", "Upper Subansiri", "West Siang",
    "East Siang", "Lower Dibang Valley", "Changlang"
  ],

  Assam: [
    "Baksa", "Barpeta", "Bongaigaon", "Cachar", "Darrang",
    "Dhubri", "Dibrugarh", "Goalpara", "Golaghat",
    "Jorhat", "Kamrup", "Nagaon", "Nalbari",
    "Sivasagar", "Tinsukia"
  ],

  Bihar: [
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur",
    "Darbhanga", "Nalanda", "Purnia", "Rohtas",
    "Saran", "Samastipur"
  ],

  UttarPradesh: [
    "Lucknow", "Kanpur", "Ghaziabad", "Noida",
    "Varanasi", "Agra", "Meerut", "Prayagraj",
    "Bareilly", "Aligarh", "Gorakhpur"
  ],

  Delhi: [
    "New Delhi", "Central", "North",
    "South", "East", "West"
  ],

  Maharashtra: [
    "Mumbai", "Pune", "Nagpur", "Thane",
    "Nashik", "Aurangabad", "Solapur", "Kolhapur"
  ],

  Karnataka: [
    "Bangalore Urban", "Mysore", "Mangalore",
    "Belgaum", "Hubli", "Dharwad"
  ],

  TamilNadu: [
    "Chennai", "Coimbatore", "Madurai",
    "Salem", "Tiruchirappalli", "Erode"
  ],

  Rajasthan: [
    "Jaipur", "Jodhpur", "Udaipur",
    "Kota", "Ajmer", "Bikaner"
  ]
};

const Rightcontenttop = () => {

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("tenders");

  const [tenders, setTenders] = useState([]);
  const [bills, setBills] = useState([]);

  const scrollRef = useRef(null);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      const [tRes, bRes] = await Promise.all([
        fetch("http://localhost:5000/api/tenders/all"),
        fetch("http://localhost:5000/api/bills/all"),
      ]);

      const tData = await tRes.json();
      const bData = await bRes.json();

      setTenders(Array.isArray(tData) ? tData : tData.data || []);
      setBills(Array.isArray(bData) ? bData : bData.data || []);
    };

    fetchData();
  }, []);

  // ---------------- SEARCH ----------------
  const handleSearch = () => {
    if (!selectedState || !selectedDistrict) {
      alert("Select State & District");
      return;
    }
    setSearched(true);
  };

  const data = activeTab === "tenders" ? tenders : bills;

  // ---------------- FILTER ----------------
  const filteredData = data.filter((item) => {
    const loc = (item.location || "").toLowerCase();

    return (
      loc.includes(selectedState.toLowerCase()) &&
      loc.includes(selectedDistrict.toLowerCase())
    );
  });

  // ---------------- SLIDER ----------------
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -380, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 380, behavior: "smooth" });
  };

  return (
    <section className="h-[520px] mt-10 rounded-2xl overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e')"
      }}
    >

      {/* HEADER */}
      <div className={`text-center mt-10 transition-all duration-300 ${
        searched ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
      }`}>
        <h1 className="text-[48px] font-bold text-white">
          Find Your Nearest Data
        </h1>
        <p className="text-white text-[20px]">
          Search Tenders & Bills
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-3 bg-white/60 backdrop-blur-md p-3 rounded-2xl shadow-lg">

          {/* STATE */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict("");
            }}
            className="w-[200px] px-4 py-3 rounded-2xl border bg-white"
          >
            <option value="" >Select State</option>
            {Object.keys(stateDistrictMap).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* DISTRICT */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            className="w-[200px] px-4 py-3 rounded-2xl border bg-white"
          >
            <option value="">Select District</option>
            {selectedState &&
              stateDistrictMap[selectedState].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
          </select>

          {/* BUTTON */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
          >
            Search
          </button>

        </div>
      </div>

      {/* TABS */}
      {searched && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setActiveTab("tenders")}
            className={`px-5 py-2 rounded-full ${
              activeTab === "tenders" ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            Tenders
          </button>

          <button
            onClick={() => setActiveTab("bills")}
            className={`px-5 py-2 rounded-full ${
              activeTab === "bills" ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            Bills
          </button>
        </div>
      )}

      {/* SLIDER (2 CARDS VIEW) */}
      {searched && (
        <div className="flex items-center justify-center mt-5 gap-4">

          {/* LEFT */}
          <button
            onClick={scrollLeft}
            className=" w-9 h-20 rounded-sm bg-white/70 backdrop-blur-md shadow-lg mt-10 ml-3"
          >
            ◀
          </button>

          {/* CARDS */}
          <div
  ref={scrollRef}
  className="flex gap-5 w-[760px] overflow-hidden scroll-smooth"
>
  {filteredData.length === 0 ? (
    <p className="text-white w-full text-center">
      No results found
    </p>
  ) : (
    filteredData.map((item, index) => (
      <div
        key={item._id || item.id || index}
        className="min-w-[340px] h-[290px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col"
      >
        <div className="p-3 flex flex-col h-full">

          {/* TOP */}
          <div className="flex justify-between items-center mb-1">

            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {item.id || item._id || "N/A"}
            </span>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              {item.status || "Active"}
            </span>

          </div>

          {/* TITLE */}
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
            {item.tenderName || item.billTitle}
          </h3>

          {/* COMPANY (compact but visible) */}
          <p className="text-[11px] text-blue-600 mb-1 font-semibold line-clamp-1">
            {item.companyName || item.department || "N/A"}
          </p>

          {/* SPECIFICATION (compact 2 lines only) */}
          <p className="text-[10px] text-gray-600 mb-2 line-clamp-2 leading-snug">
            {item.description ||
              item.specification ||
              "Specification not available. Click view details for more information."}
          </p>

          {/* INFO GRID (tight) */}
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mb-2 text-[11px]">

            <div className="flex justify-between">
              <span className="text-gray-500">Budget</span>
              <span className="font-bold">₹{item.budget || 0}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="text-gray-700 font-semibold">
                {item.location || "N/A"}
              </span>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-auto flex gap-2">

            <button
              className="flex-1 text-[11px] py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
            >
              Report
            </button>

            <button
              className="flex-1 text-[11px] py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              View Details
            </button>

          </div>

        </div>
      </div>
    ))
  )}
</div>
          {/* RIGHT */}
          <button
            onClick={scrollRight}
            className="w-9 h-20 rounded-sm bg-white/70 backdrop-blur-md shadow-lg mt-10 mr-3"
          >
            ▶
          </button>

        </div>
      )}

    </section>
  );
};

export default Rightcontenttop;