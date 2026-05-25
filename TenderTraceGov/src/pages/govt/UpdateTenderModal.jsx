import React, { useState } from 'react'

const stateDistrictMap = {

  AndhraPradesh: [
    "Anantapur","Chittoor","East Godavari","Guntur","Krishna",
    "Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam",
    "Vizianagaram","West Godavari","YSR Kadapa"
  ],

  ArunachalPradesh: [
    "Tawang","West Kameng","East Kameng","Papum Pare","Kurung Kumey",
    "Kra Daadi","Lower Subansiri","Upper Subansiri","West Siang",
    "East Siang","Siang","Upper Siang","Lower Siang","Lower Dibang Valley",
    "Dibang Valley","Anjaw","Lohit","Namsai","Changlang","Tirap","Longding"
  ],

  Assam: [
    "Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo",
    "Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao",
    "Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup",
    "Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar",
    "Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar",
    "Sonitpur","South Salmara","Tinsukia","Udalguri","West Karbi Anglong"
  ],

  Bihar: [
    "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur",
    "Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui",
    "Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai",
    "Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada",
    "Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura",
    "Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"
  ],

  Chhattisgarh: [
    "Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur",
    "Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir-Champa",
    "Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya",
    "Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon",
    "Sukma","Surajpur","Surguja"
  ],

  Goa: ["North Goa","South Goa"],

  Gujarat: [
    "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar",
    "Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar",
    "Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana",
    "Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot",
    "Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"
  ],

  Haryana: [
    "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurgaon",
    "Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh",
    "Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"
  ],

  HimachalPradesh: [
    "Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu",
    "Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"
  ],

  Jharkhand: [
    "Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum",
    "Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti",
    "Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh",
    "Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"
  ],

  Karnataka: [
    "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban",
    "Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga",
    "Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri",
    "Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur",
    "Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"
  ],

  Kerala: [
    "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam",
    "Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta",
    "Thiruvananthapuram","Thrissur","Wayanad"
  ],

  MadhyaPradesh: [
    "Bhopal","Indore","Gwalior","Jabalpur","Ujjain","Sagar","Rewa","Satna"
  ],

  Maharashtra: [
    "Mumbai","Pune","Nagpur","Nashik","Thane","Aurangabad","Solapur",
    "Kolhapur","Nanded","Sangli","Jalgaon","Latur"
  ],

  Manipur: [
    "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West",
    "Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl",
    "Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"
  ],

  Meghalaya: [
    "East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills",
    "Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills",
    "West Garo Hills","West Jaintia Hills","West Khasi Hills"
  ],

  Mizoram: [
    "Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit",
    "Saiha","Serchhip"
  ],

  Nagaland: [
    "Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon",
    "Peren","Phek","Tuensang","Wokha","Zunheboto"
  ],

  Odisha: [
    "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh",
    "Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur",
    "Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara",
    "Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj",
    "Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur",
    "Subarnapur","Sundargarh"
  ],

  Punjab: [
    "Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka",
    "Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala",
    "Ludhiana","Mansa","Moga","Muktsar","Pathankot","Patiala",
    "Rupnagar","Sangrur","Tarn Taran"
  ],

  Rajasthan: [
    "Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner","Alwar"
  ],

  Sikkim: [
    "East Sikkim","North Sikkim","South Sikkim","West Sikkim"
  ],

  TamilNadu: [
    "Chennai","Coimbatore","Madurai","Salem","Trichy","Tirunelveli"
  ],

  Telangana: [
    "Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam"
  ],

  Tripura: [
    "Dhalai","Gomati","Khowai","North Tripura",
    "Sepahijala","South Tripura","Unakoti","West Tripura"
  ],

  UttarPradesh: [
    "Lucknow","Kanpur","Ghaziabad","Noida","Varanasi","Agra","Meerut"
  ],

  Uttarakhand: [
    "Dehradun","Haridwar","Nainital","Almora","Pithoragarh"
  ],

  WestBengal: [
    "Kolkata","Howrah","Darjeeling","Siliguri","Malda"
  ],

  // 🔻 UNION TERRITORIES

  Delhi: ["New Delhi","Central","North","South","East","West"],

  Chandigarh: ["Chandigarh"],

  JammuKashmir: ["Srinagar","Jammu"],

  Ladakh: ["Leh","Kargil"],

  Puducherry: ["Puducherry","Karaikal","Mahe","Yanam"],

  AndamanNicobar: ["Nicobar","North Middle Andaman","South Andaman"],

  DadraNagarHaveliDamanDiu: ["Daman","Diu","Silvassa"],

  Lakshadweep: ["Kavaratti","Agatti","Minicoy"]
};

const UpdateTenderModal = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  const [tenderId, setTenderId] = useState("")

  if (!isOpen) return null;

  // 🔹 Generate ID from backend
  const handleGenerateId = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tender/generate-id");
      const data = await res.json();

      if (res.ok) {
        setTenderId(data.tenderId);
      } else {
        alert("Failed to generate ID ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenderId) {
      alert("Please generate Tender ID first ❗");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.target);

    const data = {
      id: tenderId,
      tenderName: formData.get('tenderName'),
      companyName: formData.get('companyName'),
      email: formData.get('email'),
      budget: formData.get('budget'),
      timePeriod: formData.get('timePeriod'),
      location: `${formData.get('state')} - ${formData.get('district')}`
    };

    try {
      const res = await fetch("http://localhost:5000/api/tender/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          `✅ Tender Created!\n\n` +
          `Tender ID: ${result.tenderId}\n` +
          `Password: ${result.password}`
        );

        if (onSubmit) onSubmit(result);
        onClose();
      } else {
        alert(result.message || "Something went wrong ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create Tender</h2>
          <button onClick={onClose}>
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 overflow-y-auto">
          <form id="tenderForm" onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Tender Name */}
              <div className="col-span-2">
                <label className="text-sm font-semibold">Tender Name</label>
                <input type="text" name="tenderName" required className="w-full border px-4 py-2 rounded-md" />
              </div>

              {/* Company */}
              <div className="col-span-2">
                <label className="text-sm font-semibold">Company Name</label>
                <input type="text" name="companyName" required className="w-full border px-4 py-2 rounded-md" />
              </div>

              {/* 🔥 UNIQUE ID FIELD + BUTTON */}
              <div className="col-span-2 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-sm font-semibold">Tender ID</label>
                  <input
                    type="text"
                    value={tenderId}
                    readOnly
                    placeholder="Click Generate ID"
                    className="w-full border px-4 py-2 rounded-md bg-gray-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateId}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Generate ID
                </button>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input type="email" name="email" required className="w-full border px-4 py-2 rounded-md" />
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-semibold">Budget (₹)</label>
                <input type="number" name="budget" required className="w-full border px-4 py-2 rounded-md" />
              </div>

              {/* Time */}
              <div>
                <label className="text-sm font-semibold">Time (Months)</label>
                <input type="number" name="timePeriod" required className="w-full border px-4 py-2 rounded-md" />
              </div>

              {/* LOCATION */}
              <div className="col-span-2">
                <label className="text-sm font-semibold">Location</label>

                <div className="grid grid-cols-2 gap-4 mt-1">

                  <select
                    name="state"
                    required
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full border px-4 py-2 rounded-md"
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateDistrictMap).map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>

                  <select
                    name="district"
                    required
                    disabled={!selectedState}
                    className="w-full border px-4 py-2 rounded-md"
                  >
                    <option value="">Select District</option>
                    {selectedState &&
                      stateDistrictMap[selectedState].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                  </select>

                </div>
              </div>

            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>

          <button
            type="submit"
            form="tenderForm"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Creating..." : "Create Tender"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateTenderModal;