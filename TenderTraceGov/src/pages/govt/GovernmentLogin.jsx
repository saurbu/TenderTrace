import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const GovernmentLogin = ({ embedded = false }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("email", email)

    alert("Government Login Success ✅")
    navigate("/gov-dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">

      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
        Government Login
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <button className="w-full bg-blue-700 text-white py-2 rounded">
        Login
      </button>

    </form>
  )
}

export default GovernmentLogin