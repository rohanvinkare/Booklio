import useMeasure from 'react-use-measure';
import Card from '@/components/landingPage/Card';
import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useScroll
} from 'framer-motion';
import { useEffect, useState } from 'react';


const variants = {
    active: { opacity: 1, scale: 1 },
    inactive: { opacity: 0.8, scale: 0.95 },
};


const VideoCarousel = () => {


    const images = [
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068113/atomicHabits_exuqua.png',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068109/bhagwatGeeta_o3dgri.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068106/ikigai_uulma7.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068102/psychologyOfMoney_ejsqmy.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068104/richDadPoorDad_rvsg9w.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068099/steveJobs_lzu4jd.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068101/thatNight_q8r8qo.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068101/subhashChandraBose_krikk1.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068110/dontLookBack_z8nw20.png',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068111/albertEinstein_lokpse.jpg',
        'https://res.cloudinary.com/djwfg6dgl/image/upload/v1750068099/thePowerOfSubconsciousMind_mppef8.jpg',
    ];

    const FAST_DURATION = 25;
    const SLOW_DURATION = 75;

    const [duration, setDuration] = useState(FAST_DURATION);
    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [ref, { width }] = useMeasure();

    const xTranslation = useMotionValue(0);

    const { scrollYProgress } = useScroll();
    const [carouselVariant, setCarouselVariant] = useState("inactive");

    useEffect(() => {
        const finalPosition = -width / 2 - 8;
        let controls;

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

        return () => controls?.stop(); // Clean up animation
    }, [width, mustFinish, duration, rerender]);

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        if (progress >= 0.67) setCarouselVariant("active");
        else setCarouselVariant("inactive");
    });

    return (
        <motion.div
            variants={variants}
            initial="inactive"
            animate={carouselVariant}
            className="bg-[#060606] text-black"
        >

            <div className="relative overflow-hidden h-[300px] w-full bg-[#060606]">
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
    );
}

export default VideoCarousel;
