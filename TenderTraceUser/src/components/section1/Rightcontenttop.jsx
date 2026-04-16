
const Rightcontenttop = () => {
  return (
    <section
      className="h-[520px] mt-10 flex justify-center items-center bg-cover bg-center rounded-2xl overflow-hidden bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29uc3RydWN0aW9ufGVufDB8fDB8fHww')"
      }}
    >
      <div className="text-center max-w-[800px] flex flex-col items-center  rounded-2xl overflow-hidden">

        <h1 className="text-[48px] font-bold text-white">
          Find Your Nearest Tender Details
        </h1>

        <p className="mt-4 text-white text-[24px]">
          From Black Holes to Glass Walls
        </p>

        {/* SEARCH BAR */}
        <div className="mt-8 flex w-[800px] h-[60px] bg-white/60 backdrop-blur-md rounded-xl items-center justify-center gap-3">

          <input
            type="text"
            placeholder="Enter State"
            className="h-[40px] w-[300px] px-4 rounded-full bg-white border border-black outline-none"
          />

          <input
            type="text"
            placeholder="Enter City"

            className="h-[40px] w-[300px] px-4 rounded-full bg-white border border-black outline-none"
          />

          <button className="h-[40px] w-[150px] bg-gray-400 text-white rounded-full transition-all duration-200 hover:bg-white hover:text-black hover:border hover:border-black cursor-pointer">
            Search
          </button>

        </div>
      </div>
    </section>
  )
}

export default Rightcontenttop
