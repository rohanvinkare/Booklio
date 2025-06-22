
// import { lazy } from "react";
// import { motion, useInView } from "motion/react";
// import { FcShop } from "react-icons/fc";
// import { Button } from "@/components/landingPage/Button"
// import { useRef } from "react";
// import { Link } from "react-router-dom";


// const World = lazy(() =>
//     import("@/components/ui/globe.jsx").then((m) => ({ default: m.World }))
// );

// export function GlobeDemo() {

//     const ref = useRef(null);
//     const isInView = useInView(ref, { once: true, margin: "-100px" });

//     const globeConfig = {
//         pointSize: 4,
//         globeColor: "#062056",
//         showAtmosphere: true,
//         atmosphereColor: "#FFFFFF",
//         atmosphereAltitude: 0.1,
//         emissive: "#062056",
//         emissiveIntensity: 0.1,
//         shininess: 0.9,
//         polygonColor: "rgba(255,255,255,0.7)",
//         ambientLight: "#38bdf8",
//         directionalLeftLight: "#ffffff",
//         directionalTopLight: "#ffffff",
//         pointLight: "#ffffff",
//         arcTime: 1000,
//         arcLength: 0.9,
//         rings: 1,
//         maxRings: 3,
//         initialPosition: { lat: 22.3193, lng: 114.1694 },
//         autoRotate: true,
//         autoRotateSpeed: 0.5,
//     };
//     const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
//     const sampleArcs = [
//         {
//             order: 1,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -22.9068,
//             endLng: -43.1729,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 1,
//             startLat: 28.6139,
//             startLng: 77.209,
//             endLat: 3.139,
//             endLng: 101.6869,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 1,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -1.303396,
//             endLng: 36.852443,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 2,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: 35.6762,
//             endLng: 139.6503,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 2,
//             startLat: 51.5072,
//             startLng: -0.1276,
//             endLat: 3.139,
//             endLng: 101.6869,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 2,
//             startLat: -15.785493,
//             startLng: -47.909029,
//             endLat: 36.162809,
//             endLng: -115.119411,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 3,
//             startLat: -33.8688,
//             startLng: 151.2093,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 3,
//             startLat: 21.3099,
//             startLng: -157.8581,
//             endLat: 40.7128,
//             endLng: -74.006,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 3,
//             startLat: -6.2088,
//             startLng: 106.8456,
//             endLat: 51.5072,
//             endLng: -0.1276,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 4,
//             startLat: 11.986597,
//             startLng: 8.571831,
//             endLat: -15.595412,
//             endLng: -56.05918,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 4,
//             startLat: -34.6037,
//             startLng: -58.3816,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 4,
//             startLat: 51.5072,
//             startLng: -0.1276,
//             endLat: 48.8566,
//             endLng: -2.3522,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 5,
//             startLat: 14.5995,
//             startLng: 120.9842,
//             endLat: 51.5072,
//             endLng: -0.1276,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 5,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: -33.8688,
//             endLng: 151.2093,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 5,
//             startLat: 34.0522,
//             startLng: -118.2437,
//             endLat: 48.8566,
//             endLng: -2.3522,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 6,
//             startLat: -15.432563,
//             startLng: 28.315853,
//             endLat: 1.094136,
//             endLng: -63.34546,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 6,
//             startLat: 37.5665,
//             startLng: 126.978,
//             endLat: 35.6762,
//             endLng: 139.6503,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 6,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: 51.5072,
//             endLng: -0.1276,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 7,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -15.595412,
//             endLng: -56.05918,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 7,
//             startLat: 48.8566,
//             startLng: -2.3522,
//             endLat: 52.52,
//             endLng: 13.405,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 7,
//             startLat: 52.52,
//             startLng: 13.405,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 8,
//             startLat: -8.833221,
//             startLng: 13.264837,
//             endLat: -33.936138,
//             endLng: 18.436529,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 8,
//             startLat: 49.2827,
//             startLng: -123.1207,
//             endLat: 52.3676,
//             endLng: 4.9041,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 8,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: 40.7128,
//             endLng: -74.006,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 9,
//             startLat: 51.5072,
//             startLng: -0.1276,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 9,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: -22.9068,
//             endLng: -43.1729,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 9,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: -34.6037,
//             endLng: -58.3816,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 10,
//             startLat: -22.9068,
//             startLng: -43.1729,
//             endLat: 28.6139,
//             endLng: 77.209,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 10,
//             startLat: 34.0522,
//             startLng: -118.2437,
//             endLat: 31.2304,
//             endLng: 121.4737,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 10,
//             startLat: -6.2088,
//             startLng: 106.8456,
//             endLat: 52.3676,
//             endLng: 4.9041,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 11,
//             startLat: 41.9028,
//             startLng: 12.4964,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 11,
//             startLat: -6.2088,
//             startLng: 106.8456,
//             endLat: 31.2304,
//             endLng: 121.4737,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 11,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: 1.3521,
//             endLng: 103.8198,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 12,
//             startLat: 34.0522,
//             startLng: -118.2437,
//             endLat: 37.7749,
//             endLng: -122.4194,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 12,
//             startLat: 35.6762,
//             startLng: 139.6503,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 12,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 13,
//             startLat: 52.52,
//             startLng: 13.405,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 13,
//             startLat: 11.986597,
//             startLng: 8.571831,
//             endLat: 35.6762,
//             endLng: 139.6503,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 13,
//             startLat: -22.9068,
//             startLng: -43.1729,
//             endLat: -34.6037,
//             endLng: -58.3816,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 14,
//             startLat: -33.936138,
//             startLng: 18.436529,
//             endLat: 21.395643,
//             endLng: 39.883798,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//     ];

//     return (
//         <section
//             ref={ref}
//             className="min-h-screen mt-0 mb-0 w-full flex items-center justify-center bg-[#060606] text-white px-4 sm:px-6 md:px-8 py-10 transition-all duration-500"
//         >
//             <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//                 {/* Left: Hero Text */}
//                 <motion.div
//                     initial={{ opacity: 0, x: -40 }}
//                     animate={isInView ? { opacity: 1, x: 0 } : {}}
//                     transition={{ duration: 0.8, ease: "easeOut" }}
//                     className="flex flex-col justify-center text-center md:text-left"
//                 >
//                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-snug">
//                         Discover the World of Original Books. <br />
//                         Only on{" "}
//                         <span className="bg-gradient-to-r from-blue-600 via-[#00acf5] to-[#00a0f5] bg-clip-text text-transparent">
//                             Booklio
//                         </span>
//                         .
//                     </h1>

//                     <Link to="/shop" className="mx-auto md:mx-0">
//                         <Button className="mb-6 text-white bg-blue-700 px-6 py-3 rounded-xl shadow-md flex items-center gap-2">
//                             <span>Explore Store</span>
//                             <FcShop className="text-xl" />
//                         </Button>
//                     </Link>

//                     <p className="font-medium text-neutral-300 max-w-md mx-auto md:mx-0">
//                         Dive into handpicked originals, delivered right to your shelf 🌍📚
//                     </p>
//                 </motion.div>

//                 {/* Right: Globe */}
//                 <motion.div
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={isInView ? { opacity: 1, x: 0 } : {}}
//                     transition={{ duration: 1, ease: "easeOut" }}
//                     className="relative w-full h-[20rem] sm:h-[28rem] md:h-[36rem] z-10"
//                 >
//                     <World data={sampleArcs} globeConfig={globeConfig} />
//                 </motion.div>
//             </div>
//         </section>
//     );


// }











// import { lazy, useEffect, useRef, useState } from "react";
// import { motion, useInView } from "motion/react";
// import { FcShop } from "react-icons/fc";
// import { Button } from "@/components/landingPage/Button";
// import { Link } from "react-router-dom";


// const World = lazy(() =>
//     import("@/components/ui/globe.jsx").then((m) => ({ default: m.World }))
// );

// const GlobeDemo = () => {
//     const ref = useRef(null);
//     const isInView = useInView(ref, { once: true, margin: "-100px" });

//     const [showGlobe, setShowGlobe] = useState(false);

//     // useEffect(() => {
//     //     const timer = setTimeout(() => setShowGlobe(true), 2500); // Lazy load globe after delay
//     //     return () => clearTimeout(timer);
//     // }, []);

//     useEffect(() => {
//         const handle = requestIdleCallback(() => {
//             setShowGlobe(true);
//         });
//         return () => cancelIdleCallback(handle);
//     }, []);

//     const globeConfig = {
//         pointSize: 4,
//         globeColor: "#062056",
//         showAtmosphere: true,
//         atmosphereColor: "#FFFFFF",
//         atmosphereAltitude: 0.1,
//         emissive: "#062056",
//         emissiveIntensity: 0.1,
//         shininess: 0.9,
//         polygonColor: "rgba(255,255,255,0.7)",
//         ambientLight: "#38bdf8",
//         directionalLeftLight: "#ffffff",
//         directionalTopLight: "#ffffff",
//         pointLight: "#ffffff",
//         arcTime: 1000,
//         arcLength: 0.9,
//         rings: 1,
//         maxRings: 3,
//         initialPosition: { lat: 22.3193, lng: 114.1694 },
//         autoRotate: true,
//         autoRotateSpeed: 0.5,
//     };


//     const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

//     const sampleArcs = [
//         {
//             order: 1,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -22.9068,
//             endLng: -43.1729,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 1,
//             startLat: 28.6139,
//             startLng: 77.209,
//             endLat: 3.139,
//             endLng: 101.6869,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 1,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -1.303396,
//             endLng: 36.852443,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 2,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: 35.6762,
//             endLng: 139.6503,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 2,
//             startLat: 51.5072,
//             startLng: -0.1276,
//             endLat: 3.139,
//             endLng: 101.6869,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 2,
//             startLat: -15.785493,
//             startLng: -47.909029,
//             endLat: 36.162809,
//             endLng: -115.119411,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 3,
//             startLat: -33.8688,
//             startLng: 151.2093,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 3,
//             startLat: 21.3099,
//             startLng: -157.8581,
//             endLat: 40.7128,
//             endLng: -74.006,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 3,
//             startLat: -6.2088,
//             startLng: 106.8456,
//             endLat: 51.5072,
//             endLng: -0.1276,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 4,
//             startLat: 11.986597,
//             startLng: 8.571831,
//             endLat: -15.595412,
//             endLng: -56.05918,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 4,
//             startLat: -34.6037,
//             startLng: -58.3816,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 4,
//             startLat: 51.5072,
//             startLng: -0.1276,
//             endLat: 48.8566,
//             endLng: -2.3522,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 5,
//             startLat: 14.5995,
//             startLng: 120.9842,
//             endLat: 51.5072,
//             endLng: -0.1276,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 5,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: -33.8688,
//             endLng: 151.2093,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 5,
//             startLat: 34.0522,
//             startLng: -118.2437,
//             endLat: 48.8566,
//             endLng: -2.3522,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 6,
//             startLat: -15.432563,
//             startLng: 28.315853,
//             endLat: 1.094136,
//             endLng: -63.34546,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 6,
//             startLat: 37.5665,
//             startLng: 126.978,
//             endLat: 35.6762,
//             endLng: 139.6503,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 6,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: 51.5072,
//             endLng: -0.1276,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 7,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -15.595412,
//             endLng: -56.05918,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 7,
//             startLat: 48.8566,
//             startLng: -2.3522,
//             endLat: 52.52,
//             endLng: 13.405,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 7,
//             startLat: 52.52,
//             startLng: 13.405,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 8,
//             startLat: -8.833221,
//             startLng: 13.264837,
//             endLat: -33.936138,
//             endLng: 18.436529,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 8,
//             startLat: 49.2827,
//             startLng: -123.1207,
//             endLat: 52.3676,
//             endLng: 4.9041,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 8,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: 40.7128,
//             endLng: -74.006,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 9,
//             startLat: 51.5072,
//             startLng: -0.1276,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 9,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: -22.9068,
//             endLng: -43.1729,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 9,
//             startLat: 1.3521,
//             startLng: 103.8198,
//             endLat: -34.6037,
//             endLng: -58.3816,
//             arcAlt: 0.5,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 10,
//             startLat: -22.9068,
//             startLng: -43.1729,
//             endLat: 28.6139,
//             endLng: 77.209,
//             arcAlt: 0.7,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 10,
//             startLat: 34.0522,
//             startLng: -118.2437,
//             endLat: 31.2304,
//             endLng: 121.4737,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 10,
//             startLat: -6.2088,
//             startLng: 106.8456,
//             endLat: 52.3676,
//             endLng: 4.9041,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 11,
//             startLat: 41.9028,
//             startLng: 12.4964,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 11,
//             startLat: -6.2088,
//             startLng: 106.8456,
//             endLat: 31.2304,
//             endLng: 121.4737,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 11,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: 1.3521,
//             endLng: 103.8198,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 12,
//             startLat: 34.0522,
//             startLng: -118.2437,
//             endLat: 37.7749,
//             endLng: -122.4194,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 12,
//             startLat: 35.6762,
//             startLng: 139.6503,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.2,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 12,
//             startLat: 22.3193,
//             startLng: 114.1694,
//             endLat: 34.0522,
//             endLng: -118.2437,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 13,
//             startLat: 52.52,
//             startLng: 13.405,
//             endLat: 22.3193,
//             endLng: 114.1694,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 13,
//             startLat: 11.986597,
//             startLng: 8.571831,
//             endLat: 35.6762,
//             endLng: 139.6503,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 13,
//             startLat: -22.9068,
//             startLng: -43.1729,
//             endLat: -34.6037,
//             endLng: -58.3816,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         {
//             order: 14,
//             startLat: -33.936138,
//             startLng: 18.436529,
//             endLat: 21.395643,
//             endLng: 39.883798,
//             arcAlt: 0.3,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//     ];

//     return (
//         <section
//             ref={ref}
//             className="min-h-screen mt-0 mb-0 w-full flex items-center justify-center bg-[#060606] text-white px-4 sm:px-6 md:px-8 py-10 transition-all duration-500"
//         >
//             <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//                 {/* Left: Hero Text */}
//                 <div className="flex flex-col justify-center text-center md:text-left">
//                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-snug text-white">
//                         Discover the World of Original Books. <br />
//                         Only on{" "}
//                         <span className="text-blue-400">Booklio</span>.
//                     </h1>

//                     <Link to="/shop" className="mx-auto md:mx-0">
//                         <Button className="mb-6 text-white bg-blue-700 px-6 py-3 rounded-xl shadow-md flex items-center gap-2">
//                             <span>Explore Store</span>
//                             <FcShop className="text-xl" />
//                         </Button>
//                     </Link>

//                     <p className="font-medium text-neutral-300 max-w-md mx-auto md:mx-0">
//                         Dive into handpicked originals, delivered right to your shelf 🌍📚
//                     </p>
//                 </div>

//                 {/* Right: Globe - Delayed Render */}
//                 {showGlobe && (
//                     <motion.div
//                         initial={{ opacity: 0, x: 40 }}
//                         animate={isInView ? { opacity: 1, x: 0 } : {}}
//                         transition={{ duration: 1, ease: "easeOut" }}
//                         className="relative w-full h-[20rem] sm:h-[28rem] md:h-[36rem] z-10"
//                     >
//                         <World data={sampleArcs} globeConfig={globeConfig} />
//                     </motion.div>
//                 )}
//             </div>
//         </section>
//     );
// }

// export default GlobeDemo;




import { useEffect, useRef, useState, lazy } from "react";
import { FcShop } from "react-icons/fc";
import { Button } from "@/components/landingPage/Button";
import { Link } from "react-router-dom";


const GlobeDemo = () => {
    const ref = useRef(null);
    const [showGlobe, setShowGlobe] = useState(false);
    const [WorldComponent, setWorldComponent] = useState(null);
    const [sampleArcs, setSampleArcs] = useState([]);

    useEffect(() => {
        const loadGlobe = () => {
            requestIdleCallback(() => {
                import("@/components/ui/globe.jsx").then((mod) => {
                    setWorldComponent(() => mod.World);
                    import("../../data/sampleArcs.js").then((data) => {
                        setSampleArcs(data.sampleArcs);
                    });
                    setShowGlobe(true);
                });
            });
        };

        if (document.readyState === "complete") {
            // If already loaded, run immediately
            loadGlobe();
        } else {
            // Otherwise wait for the 'load' event
            window.addEventListener("load", loadGlobe);
            return () => window.removeEventListener("load", loadGlobe);
        }
    }, []);


    const globeConfig = {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };

    return (
        <section
            ref={ref}
            className="min-h-screen mt-0 mb-0 w-full flex items-center justify-center bg-[#060606] text-white px-4 sm:px-6 md:px-8 py-10 transition-all duration-500"
        >
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Hero Text */}
                <div className="flex flex-col justify-center text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-snug text-white">
                        Discover the World of Original Books. <br />
                        Only on <span className="text-blue-400">Booklio</span>.
                    </h1>

                    <Link to="/shop" className="mx-auto md:mx-0">
                        <Button className="mb-6 text-white bg-blue-700 px-6 py-3 rounded-xl shadow-md flex items-center gap-2">
                            <span>Explore Store</span>
                            <FcShop className="text-xl" />
                        </Button>
                    </Link>

                    <p className="font-medium text-neutral-300 max-w-md mx-auto md:mx-0">
                        Dive into handpicked originals, delivered right to your shelf 🌍📚
                    </p>
                </div>

                {/* Right: Globe */}
                {showGlobe && WorldComponent && sampleArcs.length > 0 && (
                    <div
                        className="relative w-full h-[20rem] sm:h-[28rem] md:h-[36rem] z-10 transition-opacity duration-1000 opacity-100 transform translate-x-0"
                    >
                        <WorldComponent data={sampleArcs} globeConfig={globeConfig} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default GlobeDemo;
