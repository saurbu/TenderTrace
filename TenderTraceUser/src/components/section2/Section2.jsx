import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Section2 = ({ tenders }) => {
  const stateKeywords = {
  "Uttar Pradesh": "taj mahal agra india",
  "Maharashtra": "mumbai gateway of india city",
  "Bihar": "ganga river patna india",
  "Assam": "tea garden assam landscape",
  "Himachal Pradesh": "himachal mountains manali snow",
  "Delhi": "india gate delhi city",
  "Karnataka": "bengaluru city tech india",
  "Tamil Nadu": "chennai temple india",
  "Rajasthan": "jaipur fort desert india",
  "Gujarat": "statue of unity gujarat india"
}
  const navigate = useNavigate()
  const sliderRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const getStateName = (location = "") => {
    return location.split('-')[0].trim()
  }

  const states = [
    ...new Set(tenders.map(t => getStateName(t.location)))
  ].filter(Boolean)

  const loopStates = [...states, ...states]
  useEffect(() => {

    const slider = sliderRef.current
    if (!slider) return

    let pos = 0
    let frame

    const animate = () => {

      if (!paused) {
        pos += 0.7

        if (pos >= slider.scrollWidth / 2) {
          pos = 0
        }

        slider.scrollLeft = pos
      }

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)

  }, [paused])

  return (
    <div className='h-screen w-full px-10 md:px-18 scroll-mt-24'>

      <h4 className='text-4xl md:text-5xl py-6 font-semibold'>
        Active States with Tenders
      </h4>

      <div className='w-full overflow-hidden'>

        <div
          ref={sliderRef}
          className='flex gap-6 overflow-x-auto scroll-smooth select-none
                     [-ms-overflow-style:none]
                     [scrollbar-width:none]
                     [&::-webkit-scrollbar]:hidden'
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {loopStates.map((state, idx) => {

          const query =stateKeywords[state] || `${state} india city landscape`

          const img = `https://images.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${state + idx}`            
            return (
              <div
                key={idx}
                onClick={() => navigate(`/state/${state}`)}
                className='relative w-72 h-96 flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer group shadow-lg'
              >

                <img
                  src={img}
                  alt={state}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800"
                  }}
                />

                <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition'></div>

                <div className='absolute bottom-0 p-5 text-white'>
                  <h2 className='text-2xl font-bold'>{state}</h2>
                </div>

              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}

export default Section2