import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ConstructorLogin = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (e) => {

    e.preventDefault()
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tenders/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )
      let data = await res.json()
      if (data.success) {
        localStorage.setItem(
          "contractorEmail",
          data.user.email
        )
        localStorage.setItem(
          "loginType",
          "tender"
        )
        navigate("/constructor-dashboard")
        return
      }
      res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bills/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      data = await res.json()
      if (data.success) {
        localStorage.setItem(
          "contractorEmail",
          data.user.email
        )
        localStorage.setItem(
          "loginType",
          "bill"
        )
        navigate("/constructor-dashboard")
      } else {
        alert("Invalid Email or Password ❌")

      }

    } catch (error) {
      console.log(error)
      alert("Server Error ❌")
    }
  }
  return (
    <div className="w-full">
      <div >
        <h2 className="text-xl font-bold mb-4 text-center ">
          Constructor Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-2 mb-3 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-2 mb-3 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConstructorLogin