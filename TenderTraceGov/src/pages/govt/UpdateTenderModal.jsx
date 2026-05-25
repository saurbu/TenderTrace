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

  Delhi: ["New Delhi","Central","North","South","East","West"],

  UttarPradesh: [
    "Lucknow","Kanpur","Ghaziabad","Noida","Varanasi","Agra","Meerut"
  ],

  Maharashtra: [
    "Mumbai","Pune","Nagpur","Nashik","Thane","Aurangabad","Solapur",
    "Kolhapur","Nanded","Sangli","Jalgaon","Latur"
  ]
}

const UpdateTenderModal = ({ isOpen, onClose, onSubmit }) => {

  const [loading, setLoading] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  const [tenderId, setTenderId] = useState("")

  if (!isOpen) return null

  // GENERATE TENDER ID
  const handleGenerateId = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/tenders/generate-id"
      )

      const data = await res.json()

      if (res.ok) {
        setTenderId(data.tenderId)
      } else {
        alert("Failed to generate Tender ID ❌")
      }

    } catch (err) {
      console.log(err)
      alert("Server Error ❌")
    }
  }

  // CREATE TENDER
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!tenderId) {
      alert("Please generate Tender ID first")
      return
    }

    setLoading(true)

    const formData = new FormData(e.target)

    const payload = {
      id: tenderId,
      tenderName: formData.get("tenderName"),
      companyName: formData.get("companyName"),
      email: formData.get("email"),
      budget: Number(formData.get("budget")),
      timePeriod: Number(formData.get("timePeriod")),
      location: `${formData.get("state")} - ${formData.get("district")}`
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/tenders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      )

      const result = await res.json()

      if (res.ok) {

        alert(
          `✅ Tender Created Successfully\n\n` +
          `Tender ID: ${result.tenderId}\n` +
          `Password: ${result.password}\n` +
          `PIN: ${result.pin}`
        )

        if (onSubmit) {
          onSubmit(result)
        }

        onClose()

      } else {

        alert(result.message || result.error || "Something went wrong ❌")

      }

    } catch (error) {

      console.log(error)
      alert("Server Error ❌")

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 overflow-y-auto">

      {/* Floating bubbles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-52 h-52 bg-sky-400/10 rounded-full blur-3xl"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-white/40">

        {/* HEADER */}
        <div className="px-5 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Create Tender
            </h2>

            <p className="text-xs text-cyan-100 mt-1">
              Government Project Tender Creation
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>

        </div>

        {/* BODY */}
        <div className="max-h-[78vh] overflow-y-auto p-5">

          <form
            id="tenderForm"
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Tender Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Tender Name
                </label>

                <input
                  type="text"
                  name="tenderName"
                  required
                  placeholder="Road Construction Project"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Company */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="ABC Infrastructure Ltd."
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Tender ID */}
              <div className="md:col-span-2 flex gap-3 items-end">

                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Tender ID
                  </label>

                  <input
                    type="text"
                    value={tenderId}
                    readOnly
                    placeholder="Generate Tender ID"
                    className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 outline-none font-semibold"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateId}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:scale-105 transition shadow-lg"
                >
                  Generate
                </button>

              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Contractor Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="contractor@gmail.com"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Budget (₹)
                </label>

                <input
                  type="number"
                  name="budget"
                  required
                  placeholder="5000000"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Time Period (Months)
                </label>

                <input
                  type="number"
                  name="timePeriod"
                  required
                  placeholder="12"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  State
                </label>

                <select
                  name="state"
                  required
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                >
                  <option value="">Select State</option>

                  {Object.keys(stateDistrictMap).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  District
                </label>

                <select
                  name="district"
                  required
                  disabled={!selectedState}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                >
                  <option value="">Select District</option>

                  {selectedState &&
                    stateDistrictMap[selectedState].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))
                  }

                </select>
              </div>

            </div>

          </form>

        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 bg-gray-50 border-t flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-gray-300 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="tenderForm"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition shadow-lg"
          >
            {loading ? "Creating..." : "Create Tender"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default UpdateTenderModal