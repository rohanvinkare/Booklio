import { useState, useEffect } from 'react'
import { Hero } from "@/components/landingPage/Hero"
import { Usps } from "@/components/landingPage/Usps"
import VideoCarousel from "@/components/landingPage/VideoCarousel"
import { Faqs } from '@/components/landingPage/Faqs'
import "@/index.css"
import "@/styles.css"
import { GlobeDemo } from "@/components/landingPage/GlobeDemo.jsx"

function Landing() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(35);

    setTimeout(() => {
      setProgress(100);
    }, 1000);
  }, []);

  return (
    <>
      <main className='bg-[#060606]' >
        <div className="bg-[#060606] relative z-10">
          {/* <Hero /> */}
          <GlobeDemo />
          <Usps />
        </div>

        <VideoCarousel />
        <Faqs />
      </main>
    </>
  )
}

export default Landing
