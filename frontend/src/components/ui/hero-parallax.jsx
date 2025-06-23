"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Link } from "react-router-dom";


export const HeroParallax = ({
  products
}) => {
  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 17);
  const thirdRow = products.slice(17, 26);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="">
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};




export const Header = () => {
  const [mounted, setMounted] = useState(true); // ← mount immediately

  return (
    <div className="max-w-7xl relative mx-auto py-24 md:py-48 px-4 w-full">
      <h1
        className={`text-3xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight ${mounted ? "animate-fade-up" : "opacity-0"
          }`}
      >
        What will you discover today?
      </h1>
      <p
        className={`mt-6 max-w-xl text-base md:text-xl text-gray-200 drop-shadow-md ${mounted ? "animate-fade-up delay-200" : "opacity-0"
          }`}
      >
        Your shelf is alive — full of ideas, adventures, and voices waiting to be heard. Scroll down. Flip through. Let Booklio surprise you.
      </p>
    </div>
  );
};


// export const ProductCard = ({
//   product,
//   translate
// }) => {
//   return (
//     <motion.div
//       style={{
//         x: translate,
//       }}
//       whileHover={{
//         y: -20,
//       }}
//       key={product.title}
//       className="group/product h-[24rem] w-[16rem] relative shrink-0 rounded-xl overflow-hidden shadow-md">
//       <Link to={product.link} className="block group-hover/product:shadow-2xl">
//         <img
//           src={product.thumbnail}
//           alt={product.title}
//           loading="lazy"
//           decoding="async"
//           className="object-cover absolute h-full w-full inset-0 rounded-xl"
//         />
//       </Link>
//       <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black/60 pointer-events-none transition-opacity duration-300"></div>
//       <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-lg transition-opacity duration-300">
//         {product.title}
//       </h2>
//     </motion.div>

//   );
// };



export const ProductCard = ({ product, translate, index }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSoulCard = product.title === "Soul";
  const shouldPrioritize = isSoulCard && isMobile;

  return (
    <motion.div
      key={product.title}
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product relative shrink-0 w-[14rem] sm:w-[16rem] h-[22rem] sm:h-[24rem] rounded-xl overflow-hidden shadow-md"
    >
      <Link to={product.link} className="block group-hover/product:shadow-2xl h-full w-full">
        <picture className="block h-full w-full">
          <source srcSet={product.thumbnail} type="image/webp" />
          <img
            src={product.thumbnail}
            alt={product.title}
            loading={shouldPrioritize ? "eager" : "lazy"}
            fetchpriority={shouldPrioritize ? "high" : "auto"}
            decoding="async"
            width="256"
            height="384"
            className="h-full w-full object-cover rounded-xl"
            style={{ display: "block" }}
          />
        </picture>
      </Link>

      {/* Hover Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover/product:opacity-80 bg-black/60 transition-opacity duration-300 pointer-events-none" />

      {/* Title */}
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-base sm:text-lg transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};

