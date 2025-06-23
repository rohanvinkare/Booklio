import { Suspense, lazy } from "react";
import { Usps } from "@/components/landingPage/desktop/Usps";
import VideoCarousel from "@/components/landingPage/desktop/VideoCarousel";
import { Faqs } from "@/components/landingPage/Faqs";
import Testimonials from "@/components/landingPage/desktop/Testimonials";
// import { Footer } from "@/components/landingPage/Footer";
import { useIsMobile } from "@/hooks/useIsMobile";

// Desktop
const HeroParallaxDemo = lazy(() => import("@/components/store-view/HeroParallaxDemo"));
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
    <main className="bg-[#060606]">
      <div className="bg-[#060606] relative z-10 mb-6">
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

            <Usps />
            <VideoCarousel />

            <div className="mt-24 mb-12">
              <Testimonials />
            </div>


            <Faqs />

          </>
        )}



        {isMobile && (
          <>
            <Suspense fallback={<div className="h-[600px]" />}>
              <div className="relative z-10 isolate bg-white dark:bg-[#0B0B0F]">
                <Mobile_HeroSection />
              </div>
            </Suspense>

            <Suspense fallback={<div className="h-[500px]" />}>
              <FeaturesSection />
            </Suspense>

            <Suspense fallback={<div className="h-[500px]" />}>
              <BooklioMobileCards />
            </Suspense>

            <Suspense fallback={<div className="h-[500px]" />}>
              <MobileReviews />
            </Suspense>

            <Suspense fallback={<div className="h-[600px]" />}>
              <Faqs />
            </Suspense>

          </>
        )}

      </div>

      {/* ============ Footer in format.jsx =============== */}



    </main>
  );
}

export default Landing;
