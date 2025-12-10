// "use client";
// import { useRef, useEffect, useState } from "react";
// import { motion, useScroll, useTransform, useSpring } from "motion/react";
// import { Link } from "react-router-dom";

// export const HeroParallax = ({ products }) => {
//   const ref = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });

//   const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
//   const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
//   const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
//   const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
//   const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
//   const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
//   const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

//   const firstRow = products.slice(0, 8);
//   const secondRow = products.slice(8, 17);
//   const thirdRow = products.slice(17, 26);

//   return (
//     // <div
//     //   ref={ref}
//     //   className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col [perspective:1000px] [transform-style:preserve-3d]"
//     // >

//     <div
//       ref={ref}
//       className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-black via-[#0d0b1e] to-black"
//     >
//       <Header />

//       <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
//         {/* First Row */}
//         <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
//           {firstRow.map((product, index) => (
//             <ProductCard
//               product={product}
//               translate={translateX}
//               key={product.id || product.title?.en || product.title || index}
//             />
//           ))}
//         </motion.div>

//         {/* Second Row */}
//         <motion.div className="flex flex-row mb-20 space-x-20">
//           {secondRow.map((product, index) => (
//             <ProductCard
//               product={product}
//               translate={translateXReverse}
//               key={product.id || product.title?.en || product.title || index}
//             />
//           ))}
//         </motion.div>

//         {/* Third Row */}
//         <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
//           {thirdRow.map((product, index) => (
//             <ProductCard
//               product={product}
//               translate={translateX}
//               key={product.id || product.title?.en || product.title || index}
//             />
//           ))}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };



// export const Header = () => (
//   <div className="max-w-7xl relative mx-auto py-24 md:py-48 px-4 w-full">
//     <h1 className="text-3xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight animate-fade-up">
//       What will you discover today?
//     </h1>
//     <p className="mt-6 max-w-xl text-base md:text-xl text-gray-200 drop-shadow-md animate-fade-up delay-200">
//       Your shelf is alive — full of ideas, adventures, and voices waiting to be heard. Scroll down. Flip through. Let Booklio surprise you.
//     </p>
//   </div>
// );



// export const ProductCard = ({ product, translate }) => {
//   const imgRef = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect(); // load only once
//         }
//       },
//       { rootMargin: "300px" } // preload just before it scrolls into view
//     );

//     if (imgRef.current) observer.observe(imgRef.current);
//     return () => {
//       if (imgRef.current) observer.unobserve(imgRef.current);
//     };
//   }, []);

//   return (
//     <motion.div
//       ref={imgRef}
//       style={{ x: translate }}
//       whileHover={{ y: -20 }}
//       className="group/product relative shrink-0 w-[14rem] sm:w-[16rem] h-[22rem] sm:h-[24rem] rounded-xl overflow-hidden shadow-md"
//     >
//       <Link to={product.link} className="block group-hover/product:shadow-2xl h-full w-full">
//         <picture className="block h-full w-full">
//           <source
//             type="image/webp"
//             srcSet={isVisible ? product.thumbnail : undefined}
//           />
//           <img
//             src={isVisible ? product.thumbnail : undefined}
//             alt={typeof product.title === "string" ? product.title : product.title?.en || "Book"}
//             loading="lazy"
//             decoding="async"
//             fetchpriority="low"  // deprioritize loading
//             width="256"
//             height="384"
//             className="h-full w-full object-cover rounded-xl transition-opacity duration-300"
//             style={{ display: "block", opacity: isVisible ? 1 : 0 }}
//           />
//         </picture>
//       </Link>

//       <div className="absolute inset-0 opacity-0 group-hover/product:opacity-80 bg-black/60 transition-opacity duration-300 pointer-events-none" />
//       <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-base sm:text-lg transition-opacity duration-300">
//         {typeof product.title === "string" ? product.title : product.title?.en || "Untitled"}
//       </h2>
//     </motion.div>
//   );
// };














"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Link } from "react-router-dom";
export const HeroParallax = ({ products }) => {
  const ref = useRef(null);

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

  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 17);
  const thirdRow = products.slice(17, 26);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-black via-[#0d0b1e] to-black"
    >
      <Header />

      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateX}
              index={index}
              key={index}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              index={index + 8}
              key={index + 8}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateX}
              index={index + 17}
              key={index + 17}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};




export const Header = () => (
  <div className="max-w-7xl relative mx-auto py-24 md:py-48 px-4 w-full">
    <h1 className="text-3xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight animate-fade-up">
      What will you discover today?
    </h1>
    <p className="mt-6 max-w-xl text-base md:text-xl text-gray-200 drop-shadow-md animate-fade-up delay-200">
      Your shelf is alive — full of ideas, adventures, and voices waiting to be heard. Scroll down. Flip through. Let Booklio surprise you.
    </p>
  </div>
);

export const ProductCard = ({ product, translate, index }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  // 👉 First image only: eager load + high priority
  const isFirstImage = index === 0;

  return (
    <motion.div
      ref={imgRef}
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product relative shrink-0 w-[14rem] sm:w-[16rem] h-[22rem] sm:h-[24rem] rounded-xl overflow-hidden shadow-md"
    >
      <Link to={product.link} className="block group-hover/product:shadow-2xl h-full w-full">
        <picture className="block h-full w-full">
          <source type="image/webp" srcSet={isVisible ? product.thumbnail : undefined} />
          <img
            src={isVisible ? product.thumbnail : undefined}
            alt={typeof product.title === "string" ? product.title : product.title?.en || "Book"}
            loading={isFirstImage ? "eager" : "lazy"}
            fetchpriority={isFirstImage ? "high" : "low"}
            decoding="async"
            width="256"
            height="384"
            className="h-full w-full object-cover rounded-xl transition-opacity duration-300"
            style={{ display: "block", opacity: isVisible ? 1 : 0 }}
          />
        </picture>
      </Link>

      <div className="absolute inset-0 opacity-0 group-hover/product:opacity-80 bg-black/60 transition-opacity duration-300 pointer-events-none" />
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-base sm:text-lg transition-opacity duration-300">
        {typeof product.title === "string" ? product.title : product.title?.en || "Untitled"}
      </h2>
    </motion.div>
  );
};
