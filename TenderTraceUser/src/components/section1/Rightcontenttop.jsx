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
    "New Delhi", "Central Delhi", "North Delhi",
    "South Delhi", "East Delhi", "West Delhi"
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
import React, { useState } from 'react'

const stateCityData = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  "Karnataka": ["Bangalore", "Hubli-Dharwad", "Mysore", "Gulbarga", "Belgaum", "Mangalore"],
  "Kerala": ["Trivandrum", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Palakkad"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri-Chinchwad", "Nashik", "Kalyan-Dombivli"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  "Puducherry": ["Puducherry"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur"]
};

const Rightcontenttop = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!selectedState || !selectedCity) return;
    setIsSearching(true);
    try {
      const res = await fetch('http://localhost:5000/api/tenders/all');
      const data = await res.json();
      
      const filtered = data.filter(tender => 
        tender.locationInfo && 
        tender.locationInfo.toLowerCase().includes(selectedCity.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity(""); // Reset city when state changes
  }

  return (
    <section
      className="min-h-[520px] h-auto pb-8 pt-10 mt-10 flex justify-center items-start bg-cover bg-center rounded-2xl overflow-hidden bg-no-repeat transition-all duration-500"
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
            <option value="">Select State</option>
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
        <h1 className="text-[48px] font-bold text-white drop-shadow-lg">
          Find Your Nearest Tender Details
        </h1>

        {/* SEARCH BAR */}
        <div className="mt-8 flex w-[800px] h-[70px] bg-white/20 backdrop-blur-xl rounded-2xl items-center justify-center gap-4 p-4 border border-white/30 shadow-2xl">

          <select
            value={selectedState}
            onChange={handleStateChange}
            className="h-[45px] w-[280px] px-5 rounded-xl bg-white/95 border-none outline-none text-gray-800 font-medium shadow-inner focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Select State</option>
            {Object.keys(stateCityData).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            className={`h-[45px] w-[280px] px-5 rounded-xl border-none outline-none font-medium shadow-inner transition-all appearance-none ${
              selectedState ? 'bg-white/95 text-gray-800 cursor-pointer focus:ring-2 focus:ring-blue-500' : 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <option value="">Select City</option>
            {selectedState && stateCityData[selectedState].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="h-[45px] w-[140px] bg-blue-600 text-white rounded-xl font-bold shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-[1.05] active:scale-[0.95] cursor-pointer flex items-center justify-center gap-2">
            {isSearching ? <i className="ri-loader-4-line animate-spin text-xl"></i> : <><i className="ri-search-line"></i> Search</>}
          </button>

        </div>

        {/* Dynamic Search Results Pane */}
        {searchResults !== null && (
          <div className="mt-6 w-[800px] bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-left animate-fade-in-down mb-6">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
               <h3 className="font-bold text-gray-800">Results for: <span className="text-blue-600">{selectedCity}, {selectedState}</span></h3>
               <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">{searchResults.length} Tenders Found</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              {searchResults.length === 0 ? (
                 <div className="py-10 text-center text-gray-500 font-medium bg-white">No projects found currently matching this location.</div>
              ) : (
                <div className="divide-y divide-gray-100 bg-white">
                  {searchResults.map(tender => (
                    <div key={tender._id || tender.id} className="p-5 hover:bg-blue-50 transition-colors flex justify-between items-center group cursor-pointer">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${tender.status === 'Completed' ? 'text-green-600 bg-green-50 border-green-100' : 'text-blue-600 bg-blue-50 border-blue-100'} border px-2 py-0.5 rounded-md mb-1.5 inline-block`}>{tender.status}</span>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-sm line-clamp-1 pr-4">{tender.tenderName}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center font-medium"><i className="ri-building-4-line mr-1 text-gray-400"></i> {tender.companyName} <span className="mx-2 text-gray-300">|</span> <i className="ri-money-rupee-circle-line mr-1 text-gray-400"></i> {tender.budget}</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-2xl text-gray-300 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1"></i>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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