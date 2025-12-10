import { Suspense, lazy } from "react";
import { Usps } from "@/components/landingPage/desktop/Usps";
import VideoCarousel from "@/components/landingPage/desktop/VideoCarousel";
import { Faqs } from "@/components/landingPage/Faqs";
import Testimonials from "@/components/landingPage/desktop/Testimonials";
// import { Footer } from "@/components/landingPage/Footer";
import { useIsMobile } from "@/hooks/useIsMobile";

// Desktop
const HeroParallaxDemo = lazy(() => import("@/components/landingPage/desktop/HeroParallaxDemo"));
const LampDemo = lazy(() => import("@/components/landingPage/desktop/LampDemo.jsx"));
const TimelineDemo = lazy(() => import("@/components/landingPage/desktop/TimelineDemo"));

// Mobile
const Mobile_HeroSection = lazy(() => import("@/components/landingPage/mobile/Mobile_HeroSection"));
const BooklioMobileCards = lazy(() => import("@/components/landingPage/mobile/BooklioMobileCards.jsx"));
const FeaturesSection = lazy(() => import("@/components/landingPage/mobile/FeaturesSection.jsx"));
const MobileReviews = lazy(() => import("@/components/landingPage/mobile/MobileReviews.jsx"));

function Landing() {
  const isMobile = useIsMobile();

  return (
    <main className="bg-black">
      <div className="relative z-10 mb-6">

        {/*===================== For laptop ========================= */}

        {!isMobile && (
          <>
            <Suspense fallback={<div style={{ height: "100vh" }} />}>
              <HeroParallaxDemo />
            </Suspense>

            <Suspense fallback={<div className="h-[60vh]" />}>
              <LampDemo />
            </Suspense>

            <Suspense fallback={<div className="h-[60vh]" />}>
              <TimelineDemo />
            </Suspense>


            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              {/* Blurry gradient background layer */}
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#000000]/50 via-[#0d0b1e]/40 to-[#000000]/60 backdrop-blur-md" />

              {/* Content */}
              <div className="relative z-10">
                <Usps />
              </div>
            </section>


            <VideoCarousel />


            <div className="bg-gradient-to-b from-black via-[#0d0b1e] to-black py-24">
              <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">

                <Testimonials />
                <div className="mt-24">
                  <Faqs />
                </div>
              </div>
            </div>


          </>
        )}


        {/*===================== For Mobile ========================= */}
        {isMobile && (
          <>
            <Suspense fallback={<div className="h-[600px]" />}>


              <div className="relative z-10 isolate bg-[#060606] dark:bg-[#0B0B0F]">
                <Mobile_HeroSection />
              </div>
            </Suspense>

            <Suspense fallback={<div className="h-[500px]" />}>
              <FeaturesSection />
            </Suspense>


            <Suspense fallback={<div className="h-[500px]" />}>
              <BooklioMobileCards />
            </Suspense>


            <div className="bg-gradient-to-b from-black via-[#0d0b1e] to-black py-24">
              <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">

                <Suspense fallback={<div className="h-[500px]" />}>
                  <MobileReviews />
                </Suspense>

                <Suspense fallback={<div className="h-[600px]" />}>
                  <Faqs />
                </Suspense>

              </div>
            </div>

          </>
        )}

      </div>

      {/* ============ Footer in format.jsx =============== */}



    </main>
  );
}

export default Landing;
