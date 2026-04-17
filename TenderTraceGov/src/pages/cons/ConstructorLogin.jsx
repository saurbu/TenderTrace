import React from 'react'
// import { useNavigate } from 'react-router-dom'

const ConstructorLogin = () => {
  // const navigate = useNavigate()

  const [email, setEmail] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault() // stop reload
    localStorage.setItem('contractorEmail', email)
    window.location.href = '/constructor-dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Constructor Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Assigned Email ID"
            className="w-full border px-4 py-2 mb-4 rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border px-4 py-2 mb-4 rounded-lg"
            required
          />

          <button 
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConstructorLogin