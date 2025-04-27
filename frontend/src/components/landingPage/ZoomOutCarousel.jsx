import { useWindowSize } from "react-use";
import { booksPoster } from "@/components/books";
import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ZoomOutCarousel() {

    // Zoom out carousel

    const { width, height } = useWindowSize();
    const carouselWrapperRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: carouselWrapperRef,
        offset: ["start start", "end start"]
    });

    const maximumScale = useMemo(() => {
        const windowYRatio = height / width;
        const xScale = 1.66667;
        const yScale = xScale * (16 / 9) * windowYRatio;
        return Math.max(xScale, yScale);
    }, [width, height]);

    const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.66], [maximumScale * 1.1, maximumScale, 1]);

    const postersOpacity = useTransform(scrollYProgress, [0.64, 0.66], [0, 1]);
    const posterTranslateXLeft = useTransform(scrollYProgress, [0.64, 0.66], [-240, 0]);
    const posterTranslateXRight = useTransform(scrollYProgress, [0.64, 0.66], [240, 0]);

    return (
        <div ref={carouselWrapperRef} className="mt-[-180vh] overflow-clip h-[300vh]">
            <div className="h-screen sticky top-[320vh] flex items-center">
                <div className="flex relative gap-5 left-1/2 -translate-x-1/2">
                    <motion.div
                        style={{ opacity: postersOpacity, x: posterTranslateXLeft }}
                        className="shrink-0 w-[300px] md:w-[60vw] aspect-[9/16] md:aspect-video rounded-2xl overflow-clip"
                    >
                        <img
                            className="w-full h-full object-cover"
                            src={booksPoster[0].poster}
                            alt={booksPoster[0].name}
                        />
                    </motion.div>
                    <motion.div
                        style={{ scale }}
                        className="shrink-0 w-[300px] md:w-[60vw] aspect-[9/16] md:aspect-video rounded-2xl overflow-clip"
                    >
                        <img
                            className="w-full h-full object-cover"
                            src={booksPoster[1].poster}
                            alt={booksPoster[1].name}
                        />
                    </motion.div>
                    <motion.div
                        style={{ opacity: postersOpacity, x: posterTranslateXRight }}
                        className="shrink-0 w-[300px] md:w-[60vw] aspect-[9/16] md:aspect-video rounded-2xl overflow-clip"
                    >
                        <img
                            className="w-full h-full object-cover"
                            src={booksPoster[2].poster}
                            alt={booksPoster[2].name}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}