import { Button } from "@/components/landingPage/Button"
import { Container } from "@/components/landingPage/Container"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import heroImg from '../../assets/hero-bg.avif'
import "@/styles.css"
import { FcShop } from "react-icons/fc";


export const Hero = () => {
    const videoContainerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: videoContainerRef,
        offset: ["start start", "end end"]
    })
    const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0])

    return (
        <div className="relative bg-[#060606] text-white">
            <motion.div
                style={{ opacity }}
                className="absolute -top-[var(--header-height)] left-0 w-full h-[200vh]"
                ref={videoContainerRef}
            >
                <img className="sticky top-0 w-full object-cover" src={heroImg} alt="" />
            </motion.div>
            <Container className="relative pb-7 z-10 h-[--hero-height]">
                <motion.div
                    className="h-full flex flex-col items-start justify-end"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                    whileInView="visible"
                    exit="hidden"
                    animate="hidden"
                    viewport={{ amount: 0.98 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-10">
                        All Books Orginals. <br />
                        Only On Booklio.
                    </h1>
                    <a href="/shop">
                        <Button className="mb-16 text-white bg-blue-700 px-6 py-3 rounded-xl shadow-md flex items-center gap-2">
                            <span>Go To Shop</span>
                            <FcShop className="text-xl" />
                        </Button>
                    </a>
                    <p className="font-semibold">Buy it now from our 🛒 store.</p>
                </motion.div>
            </Container>
        </div>
    )
}