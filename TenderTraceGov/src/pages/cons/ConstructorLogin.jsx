import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ConstructorLogin = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      /* -----------------------------
         TRY TENDER LOGIN
      ----------------------------- */

      let res = await fetch(
        "http://localhost:5000/api/tenders/login",
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

      /* -----------------------------
         IF TENDER LOGIN SUCCESS
      ----------------------------- */

      if (data.success) {

        localStorage.setItem(
          "contractorEmail",
          data.user.email
        )

        localStorage.setItem(
          "loginType",
          "tender"
        )

        alert("Tender Login Successful ✅")

        navigate("/constructor-dashboard")

        return
      }

      /* -----------------------------
         TRY BILL LOGIN
      ----------------------------- */

      res = await fetch(
        "http://localhost:5000/api/bills/login",
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

        alert("Bill Login Successful ✅")

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

    <div className="min-h-screen flex items-center justify-center bg-green-100 pt-20">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Constructor Login
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border px-4 py-2 mb-4 rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border px-4 py-2 mb-4 rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default ConstructorLogin