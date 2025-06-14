
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { addSellerData } from "@/store/authSlice/seller";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import GradientText from '@/components/ui/GradientText'
import TrueFocus from '@/components/ui/TrueFocus';
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SellerLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to check token validity for seller
  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/token-check`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      // console.log("Token check response:", result);


      if (result.success && result.data.credDecode.role === "seller") {
        toast.success("Redirecting...");
        localStorage.setItem("role", result.data.credDecode.role);
        // Store seller data in Redux
        // console.log(result.data.credDecode)
        dispatch(addSellerData(result.data.credDecode));
        navigate("/seller");
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
      }
    } catch (error) {
      console.error("Error during token validation:", error.message);
      toast.error("Error validating token. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
    }
  };

  // to see password
  const [showPassword, setShowPassword] = useState(false);

  // On component mount, check if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      checkTokenValidity(token);
    }
  }, []);

  // Login submission logic for seller
  const onSubmit = async (data) => {
    try {
      // console.log("Submitting Seller Login Data:", data);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/seller/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Login failed.");
      }

      const result = await response.json();
      console.log("Response from API:", result);

      // Check for the accessToken in the response
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        // console.log(result);
        localStorage.setItem("role", result.sellerData.role);
        dispatch(addSellerData(result));
        toast.success("Login successful!");
        navigate("/seller");
      } else {
        throw new Error("Access token not found in the response.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 bg-[#000003]">
      {/* Brand / Logo */}
      <Link to="/" className="mb-6 text-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={10}
          showBorder={false}
          className="font-unbounded text-4xl sm:text-5xl md:text-[4rem] font-bold bg-blue-500 bg-clip-text text-transparent"
        >
          Booklio
        </GradientText>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <Card className="bg-[#000003] border-2 border-[#40ffaa] shadow-lg shadow-[#000003]/20">
          <CardHeader className="my-6 text-center text-white">
            <TrueFocus
              sentence="Login Seller"
              manualMode={false}
              blurAmount={3}
              borderColor="#4079ff"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
            <div className="h-5" />
            <p className="text-white text-base sm:text-lg">Access your seller account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#40ffaa]">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className="bg-black/50 border-2 border-[#4079ff] text-white placeholder:text-gray-400 focus:border-[#40ffaa] focus:outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-[#40ffaa]">
                  Password
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  className="bg-black/50 border-2 border-[#4079ff] text-white placeholder:text-gray-400 focus:border-[#40ffaa] focus:outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-red-500 hover:text-blue-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-1/3 ml-[33%] bg-white hover:bg-white/70 hover:opacity-90 text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Login
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-white/80 text-sm sm:text-base">
              Don’t have an account?{" "}
              <Link
                to="/auth/seller/register"
                className="text-[#40ffaa] hover:text-red-600 transition-colors font-medium"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>

  );
}

export default SellerLogin;