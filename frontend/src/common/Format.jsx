import { useState, useEffect } from 'react'
import LoadingBar from 'react-top-loading-bar'
import { Header } from "@/components/landingPage/Header"
import { ScrollToTopBtn } from "../common/ScrollToTop";
import { Footer } from '@/components/landingPage/Footer'
import { Outlet } from 'react-router-dom'
import "@/styles.css"

export const Format = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setProgress(35);

        setTimeout(() => {
            setProgress(100);
        }, 1000);
    }, []);
    return (
        <>
            <LoadingBar
                color="#3B82F6"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Header />

            <Outlet />

            <ScrollToTopBtn />
            
            <Footer />
        </>
    );
}

export default Format;