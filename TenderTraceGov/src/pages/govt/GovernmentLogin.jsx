import React from 'react'
import { useNavigate } from 'react-router-dom'

const GovernmentLogin = () => {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/gov-dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 border-b pb-4">
          Government Official Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter Government Email"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
             <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 mt-4 rounded-lg transition duration-200 shadow-md"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default GovernmentLogin