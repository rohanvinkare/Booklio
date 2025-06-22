// import { useState, useEffect } from "react";
// import { Usps } from "@/components/landingPage/Usps";
// import VideoCarousel from "@/components/landingPage/VideoCarousel";
// import { Faqs } from "@/components/landingPage/Faqs";
// import GlobeDemo from "@/components/landingPage/GlobeDemo.jsx";
// import TimelineDemo from "@/components/landingPage/TimelineDemo";
// import LampDemo from "@/components/landingPage/LampDemo.jsx";
// import Testimonials from "@/components/landingPage/Testimonials";
// import { useIsMobile } from "@/hooks/useIsMobile";

// function Landing() {
//   const [progress, setProgress] = useState(0);
//   const isMobile = useIsMobile();

//   useEffect(() => {
//     setProgress(35);
//     setTimeout(() => {
//       setProgress(100);
//     }, 1000);
//   }, []);

//   return (
//     <main className="bg-[#060606]">
//       <div className="bg-[#060606] relative z-10  mb-6  ">
//         <GlobeDemo />
//         {!isMobile && <LampDemo />} {/* conditionally rendered */}
//         <TimelineDemo />
//         <Usps />
//       </div>

//       <VideoCarousel />

//       <div className="mt-24 mb-12">
//         <Testimonials />
//       </div>

//       <Faqs />
//     </main>
//   );
// }

// export default Landing;


import { Suspense, lazy } from "react";
import { Usps } from "@/components/landingPage/Usps";
import VideoCarousel from "@/components/landingPage/VideoCarousel";
import { Faqs } from "@/components/landingPage/Faqs";
import Testimonials from "@/components/landingPage/Testimonials";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HeroParallaxDemo } from "@/components/store-view/HeroParallaxDemo";

const LampDemo = lazy(() => import("@/components/landingPage/LampDemo.jsx"));
const TimelineDemo = lazy(() => import("@/components/landingPage/TimelineDemo"));

function Landing() {

  const isMobile = useIsMobile();


  return (
    <main className="bg-[#060606]">
      <div className="bg-[#060606] relative z-10 mb-6">

  

        <Suspense fallback={<div style={{ height: "100vh" }} />}>
          <HeroParallaxDemo />
        </Suspense>

        {!isMobile && (
          <Suspense fallback={<div className="h-[60vh]" />}>
            <LampDemo />
          </Suspense>
        )}

        <Suspense fallback={<div className="h-[60vh]" />}>
          <TimelineDemo />
        </Suspense>

        <Usps />
      </div>

      <VideoCarousel />

      <div className="mt-24 mb-12">
        <Testimonials />
      </div>

      <Faqs />
    </main>
  );
}

export default Landing;
