import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { addAdminData } from "@/store/authSlice/admin"; // Import addAdminData
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to check token validity for admin
  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/token-check`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success && result.data.credDecode.role === "admin") {
        // console.log("Role",result.data.credDecode.role)
        localStorage.setItem("role", result.data.credDecode.role);
        toast.success("Redirecting...");
        // Store admin data in Redux
        // console.log(result.data.credDecode);
        dispatch(addAdminData(result.data.credDecode));
        navigate("/admin");
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

  // On component mount, check if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      checkTokenValidity(token);
    }
  }, []);

  // Login submission logic for admin
  const onSubmit = async (data) => {
    try {
      // console.log("Submitting Admin Login Data:", data);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/management/api/v1/management/member-login`, {
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
      // console.log("Response from API:", result);

      // Check for the accessToken in the response
      if (result.accessToken) {
        // console.log("Role",result?.role)
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("role", result.memberData.role);
        dispatch(addAdminData(result)); // Dispatch admin data
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        throw new Error("Access token not found in the response.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-md rounded-lg">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center text-gray-800">Login as Admin</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-600">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter your email"
                className="mt-2 text-white"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-600">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                placeholder="Enter your password"
                className="mt-2 text-white"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 mt-4">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminLogin;
