import { Outlet } from "react-router-dom";


// import backgroundImage from "/loginSideImage.avif"; // Import the image correctly
// import backgroundImage from "/loginpage3.png";


// function AuthLayout() {
//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Left Section (Welcome Message) */}
//       <div className="hidden lg:flex w-1/2 relative">
//         {/* Background Image */}
//         <div
//           className="absolute inset-0 ml-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${backgroundImage})` }}
//         />

//         {/* Overlay for opacity */}
//         <div className="absolute inset-0 bg-black opacity-50" />

//         {/* Content */}
//         {/* <div className="relative z-10 flex items-center justify-center w-full px-12">
//           <div className="max-w-md space-y-6 text-center text-white">
//             <h1 className="text-4xl  tracking-tight">
//               Welcome to Booklio
//             </h1>
//           </div>
//         </div> */}
//       </div>

//       {/* Right Section (Login Form) */}
//       <div className="flex flex-1 items-center justify-center bg-[#060606] px-4 py-4 sm:px-6 lg:px-8">
//         <Outlet />
//       </div>
//     </div>
//   );
// }


function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full ">
      {/* Left Section (Welcome Message with background image) */}
      <div className="hidden lg:flex w-[55%] relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://res.cloudinary.com/djwfg6dgl/image/upload/v1750067506/loginpage3_ukjijd.png)` }}
        />

        {/* Overlay for opacity (adjust opacity as needed) */}
        <div className="absolute inset-0 bg-black opacity-40" />

        {/* Optional content on top of image */}
        {/* <div className="relative z-10 flex items-center justify-center w-full px-12">
          <div className="max-w-md space-y-6 text-center text-white">
            <h1 className="text-4xl tracking-tight">Welcome to Booklio</h1>
          </div>
        </div> */}
      </div>

      {/* Right Section (Login Form) */}
      <div className="flex flex-col flex-1 items-center justify-center bg-[#000003] px-4 py-4 sm:px-6 lg:px-8" style={{ width: '30%' }}>
        <Outlet />
      </div>
    </div>
  );
}


export default AuthLayout;
