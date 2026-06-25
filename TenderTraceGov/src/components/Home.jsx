import React, { useState } from "react"
import ConstructorLogin from "../pages/cons/ConstructorLogin"
import GovernmentLogin from "../pages/govt/GovernmentLogin"

const Home = () => {
  const [activeTab, setActiveTab] = useState("gov")

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-100 ">

      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-10 bg-gradient-to-br from-blue-300 to-blue-500 text-white">

        <h1 className="text-3xl font-bold mb-4 text-red-500 shadow-amber-500">
          Please read how this works...
        </h1>
        <h2 className="text-3xl font-bold mb-4">
          TenderTrace System 
        </h2>

        <p className="text-lg opacity-90 mb-6">
          <span className="text-2xl font-semibold">login : </span><br />
          • In government login you can login with any email or password <br />
          • In constructor login, the login credentials will come in alert when you created tender/bill in government dashboard
        </p>

        <ul className="space-y-2 text-sm opacity-90">
          <li>✔ Then you can manage your tender in constructor dashboard and for accessing the tender the pin is also provided in alert with login credentials.</li>
          <li>✔ You can only access your project with given pin,  pin cannot be changed or updated in future password is combination of first 4 words of ur email and last 4 digit of tender Id.</li>
          <li>✔ In tender dashboard You can Add worker details, take attendence daily with wace recognization twice in a day, and update daily spends with materials details including images of (product, bill, and barcode on product).</li>
          <li>✔ And all these data will display on user Portal for making <span className="font-bold text-lg text-red-600">Transperancy </span>between Government and people of India.</li>
        </ul>

      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">

        <div className="bg-white shadow-xl rounded-2xl w-[380px] p-6">

          <div className="flex bg-gray-100 p-2 rounded-full mb-6">

            <button
              onClick={() => setActiveTab("gov")}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === "gov"
                  ? "bg-blue-700 text-white"
                  : "text-gray-600"
              }`}
            >
              Government
            </button>

            <button
              onClick={() => setActiveTab("cons")}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === "cons"
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Constructor
            </button>

          </div>

          {activeTab === "gov" ? (
            <GovernmentLogin embedded />
          ) : (
            <ConstructorLogin embedded />
          )}

        </div>
      </div>
    </div>
  )
}

export default Home