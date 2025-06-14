import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import GradientText from '@/components/ui/GradientText'
import TrueFocus from '@/components/ui/TrueFocus';

function AuthRegisters() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("Data being sent to backend:", data);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/api/v4/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Ensure the payload matches backend expectations
      });

      console.log("Response from server:", response);

      if (!response.ok) {
        // Attempt to parse error details from the server
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        throw new Error(errorData.message || "Registration failed.");
      }

      const result = await response.json();
      console.log("Registration successful:", result);

      // Show success toast and redirect
      toast.success("Mail sent successfully. Verify your account through the mail.", {
        duration: 4000,
      });
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (error) {
      console.error("Registration error:", error.message);

      // Show error toast
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    // <div className="w-full flex flex-col justify-center items-center max-w-md space-y-6">
    //   <a href="/">
    //     <p className="text-[4rem] text-blue-500 font-bold font-unbounded">Booklio</p>
    //   </a>
    //   <div className="bg-white w-[140%] shadow-md rounded-lg">
    //     <Card>
    //       <CardHeader>
    //         <h2 className="text-2xl font-semibold text-center text-gray-800">Register User</h2>
    //       </CardHeader>
    //       <CardContent>
    //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    //           <div>
    //             <Label htmlFor="name" className="text-gray-600">
    //               Name
    //             </Label>
    //             <Input
    //               type="text"
    //               id="name"
    //               placeholder="Enter your name"
    //               {...register("name", { required: "Name is required" })}
    //               className="mt-2 text-white"
    //             />
    //             {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
    //           </div>

    //           <div>
    //             <Label htmlFor="email" className="text-gray-600">
    //               Email
    //             </Label>
    //             <Input
    //               type="email"
    //               id="email"
    //               placeholder="Enter your email"
    //               {...register("email", {
    //                 required: "Email is required",
    //                 pattern: {
    //                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //                   message: "Invalid email format",
    //                 },
    //               })}
    //               className="mt-2 text-white"
    //             />
    //             {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
    //           </div>

    //           <div>
    //             <Label htmlFor="mobile" className="text-gray-600">
    //               Mobile
    //             </Label>
    //             <Input
    //               type="tel"
    //               id="mobile"
    //               placeholder="Enter your mobile number"
    //               {...register("mobile", {
    //                 required: "Mobile number is required",
    //                 pattern: {
    //                   value: /^[0-9]{10}$/,
    //                   message: "Mobile number must be 10 digits",
    //                 },
    //               })}
    //               className="mt-2 text-white"
    //             />
    //             {errors.mobile && <p className="text-sm text-red-500">{errors.mobile.message}</p>}
    //           </div>

    //           <div>
    //             <Label htmlFor="password" className="text-gray-600">
    //               Password
    //             </Label>
    //             <Input
    //               type="password"
    //               id="password"
    //               placeholder="Enter your password"
    //               {...register("password", {
    //                 required: "Password is required",
    //                 minLength: {
    //                   value: 6,
    //                   message: "Password must be at least 6 characters long",
    //                 },
    //               })}
    //               className="mt-2 text-white"
    //             />
    //             {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
    //           </div>

    //           <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 mt-4">
    //             Register
    //           </Button>
    //         </form>
    //       </CardContent>
    //       <CardFooter className="text-center text-sm text-gray-600">
    //         <p>
    //           Already have an account?{" "}
    //           <Link to="/auth/login" className="font-medium text-blue-600 hover:underline">
    //             Login here
    //           </Link>
    //         </p>
    //       </CardFooter>
    //     </Card>
    //   </div>
    // </div>

    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 bg-[#000003] space-y-6">
      <Link to="/" className="text-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={10}
          showBorder={false}
          className="font-unbounded text-4xl sm:text-5xl md:text-[4rem] font-bold bg-blue-500 bg-clip-text text-transparent"
        >
          Booklio
        </GradientText>
      </Link>

      <div className="w-full max-w-md">
        <Card className="bg-[#000003] border-2 border-[#40ffaa] shadow-lg shadow-[#000003]/20">

          <CardHeader className="my-6 text-center text-lg font-darker-grotesque  text-white">
            {/* Animated Welcome Text */}
            <TrueFocus
              sentence="Register User"
              manualMode={false}
              blurAmount={3}
              borderColor="#4079ff"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
          </CardHeader>

          {/* <CardHeader className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#40ffaa] to-[#4079ff] bg-clip-text text-transparent">
              Register User
            </h2>
          </CardHeader> */}

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#40ffaa]">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  {...register("name", { required: "Name is required" })}
                  className="bg-black/50 border-2 border-[#4079ff] text-white placeholder:text-gray-400 focus:border-[#40ffaa] focus:outline-none transition-all mt-2"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#40ffaa]">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="bg-black/50 border-2 border-[#4079ff] text-white placeholder:text-gray-400 focus:border-[#40ffaa] focus:outline-none transition-all mt-2"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-[#40ffaa]">
                  Mobile
                </Label>
                <Input
                  type="tel"
                  id="mobile"
                  placeholder="Enter your mobile number"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be 10 digits",
                    },
                  })}
                  className="bg-black/50 border-2 border-[#4079ff] text-white placeholder:text-gray-400 focus:border-[#40ffaa] focus:outline-none transition-all mt-2"
                />
                {errors.mobile && (
                  <p className="text-sm text-red-500 mt-1">{errors.mobile.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#40ffaa]">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  className="bg-black/50 border-2 border-[#4079ff] text-white placeholder:text-gray-400 focus:border-[#40ffaa] focus:outline-none transition-all mt-2"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-[50%] ml-[25%] bg-white font-semibold text-lg hover:bg-white/90 hover:opacity-90 text-black  py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Register
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center text-sm text-white">
            <p>
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-[#40ffaa] hover:text-red-700 transition-colors font-medium"
              >
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>

  );
}

export default AuthRegisters;
