import useMeasure from 'react-use-measure';
import Card from '@/components/landingPage/Card';
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';  // Import useScroll
import { useEffect, useState } from 'react';
import ZoomOutCarousel from './ZoomOutCarousel';

export default function VideoCarousel() {

    // Infinite Carousel
    const images = [
        'booksCoverPage/atomicHabits.png',
        'booksCoverPage/bhagwatGeeta.jpeg',
        'booksCoverPage/ikigai.jpeg',
        'booksCoverPage/psychologyOfMoney.jpeg',
        'booksCoverPage/richDadPoorDad.jpeg',
        'booksCoverPage/steveJobs.jpg',
        'booksCoverPage/thatNight.jpeg',
        'booksCoverPage/thePowerOfSubconsciousMind.jpeg',
    ];

    const FAST_DURATION = 25;
    const SLOW_DURATION = 75;

    const [duration, setDuration] = useState(FAST_DURATION);

    let [ref, { width }] = useMeasure();

    const xTranslation = useMotionValue(0);

    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        let controls;
        let finalPosition = -width / 2 - 8;

        if (mustFinish) {
            controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
                ease: 'linear',
                duration: duration * (1 - xTranslation.get() / finalPosition),
                onComplete: () => {
                    setMustFinish(false);
                    setRerender(!rerender);
                }
            });
        } else {
            controls = animate(xTranslation, [0, finalPosition], {
                ease: 'linear',
                duration: duration,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0
            });
        }
    });

    const { scrollYProgress } = useScroll();

    const [carouselVariant, setCarouselVariant] = useState("inactive");

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        if (progress >= 0.67) setCarouselVariant("active");
        else setCarouselVariant("inactive");
    });

    return (
        <>
            <motion.div animate={carouselVariant} className="bg-background">
                {/* zoom out carousel */}
                <ZoomOutCarousel />

                <div className='relative overflow-hidden h-[300px] w-full bg-background'>
                    <motion.div
                        className="absolute left-0 top-0 flex gap-4"
                        ref={ref}
                        style={{ x: xTranslation }}
                        onHoverStart={() => {
                            setMustFinish(true);
                            setDuration(SLOW_DURATION);
                        }}
                        onHoverEnd={() => {
                            setMustFinish(true);
                            setDuration(FAST_DURATION);
                        }}
                    >
                        {[...images, ...images].map((item, idx) => (
                            <Card image={item} key={idx} />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
