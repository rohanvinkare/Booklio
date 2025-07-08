import { useState, useEffect, Suspense } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { Header } from '@/components/landingPage/Header';
import { ScrollToTopBtn } from '../common/ScrollToTop';
import { Outlet } from 'react-router-dom';
import '@/styles.css';
import { Footer } from "@/components/landingPage/Footer";

export const Format = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(35);
        const timer = setTimeout(() => setProgress(100), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <LoadingBar
                color="#3B82F6"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />

            <div className="flex flex-col min-h-screen text-white">
                {/* Sticky header will work now */}
                <Header />


                <main className="flex-grow flex flex-col">
                    <Outlet />
                    <Suspense fallback={<div className="min-h-[360px] w-full" />}>
                        <Footer />
                    </Suspense>
                </main>
            </div>

            <ScrollToTopBtn />
        </>
    );
};


export default Format;
