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

            <div className="min-h-screen bg-[#060606] text-white flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Outlet />
                </main>

                <Suspense fallback={<div className="min-h-[360px] w-full" />}>
                    <Footer />
                </Suspense>

            </div>

            <ScrollToTopBtn />
        </>
    );
};

export default Format;
