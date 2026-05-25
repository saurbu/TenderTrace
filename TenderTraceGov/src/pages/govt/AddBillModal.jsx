import React, { useState } from 'react'

const AddBillModal = ({ isOpen, onClose, onSubmit }) => {

  const [loading, setLoading] = useState(false)
  const [billId, setBillId] = useState("")

  if (!isOpen) return null

  // GENERATE BILL ID
  const handleGenerateId = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/bills/generate-id"
      )

      const data = await res.json()

      if (res.ok) {

        setBillId(data.billId)

      } else {

        alert("Failed to generate Bill ID ❌")

      }

    } catch (error) {

      console.log(error)
      alert("Server Error ❌")

    }
  }

  // CREATE BILL
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!billId) {
      alert("Please generate Bill ID first ❗")
      return
    }

    setLoading(true)

    const formData = new FormData(e.target)

    const payload = {

  id: billId,

  billTitle: formData.get("billTitle"),

  department: formData.get("department"),

  status: formData.get("status"),

  location: formData.get("location"),

  wardNo: formData.get("wardNo"),

  targetDate: formData.get("targetDate"),

  budget: Number(formData.get("budget")),

  timePeriod: 12,

  summary: formData.get("summary"),

  email: formData.get("email")

}

    try {

      const res = await fetch(
        "http://localhost:5000/api/bills/create",
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
          `✅ Bill Created Successfully\n\n` +
          `Bill ID: ${result.billId}\n` +
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

      {/* Bubble Background */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-52 h-52 bg-sky-400/10 rounded-full blur-3xl"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-white/40">

        {/* HEADER */}
        <div className="px-5 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Create Bill
            </h2>

            <p className="text-xs text-cyan-100 mt-1">
              Government Bill Management System
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
            id="billForm"
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Bill Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Bill Title
                </label>

                <input
                  type="text"
                  name="billTitle"
                  required
                  placeholder="Infrastructure Modernization Bill"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Department
                </label>

                <select
                  name="department"
                  required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                >
                  <option value="">Select Department</option>
                  <option value="Transportation">Transport Ministry</option>
                  <option value="Finance">Finance Ministry</option>
                  <option value="Power">Power Ministry</option>
                  <option value="Urban">Urban Affairs</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                >
                  <option value="">Select Status</option>
                  <option value="Introduced">Introduced</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Passed">Passed</option>
                </select>
              </div>

              {/* Bill ID */}
              <div className="md:col-span-2 flex gap-3 items-end">

                <div className="flex-1">

                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Bill ID
                  </label>

                  <input
                    type="text"
                    value={billId}
                    readOnly
                    placeholder="Generate Bill ID"
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
                  Official Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="gov@gmail.com"
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
                  placeholder="50000000"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  required
                  placeholder="Delhi Sector 12"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Ward No
                </label>

                <input
                  type="text"
                  name="wardNo"
                  required
                  placeholder="45-B"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Target Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Target Date
                </label>

                <input
                  type="date"
                  name="targetDate"
                  required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
                />
              </div>

              {/* Summary */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Bill Summary
                </label>

                <textarea
                  rows="4"
                  name="summary"
                  required
                  placeholder="Provide a summary..."
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm resize-none"
                ></textarea>
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
            form="billForm"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition shadow-lg"
          >
            {loading ? "Creating..." : "Create Bill"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default AddBillModal