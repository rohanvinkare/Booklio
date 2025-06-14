import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

function SellerRegister() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      storeName: '',
      upiId: '',
      storeDescription: '',
      gstNumber: '',
      socialMediaLinks: {
        facebook: '',
        instagram: '',
        linkedin: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  });

  const handleNextPage = async (nextPage) => {
    let fieldsToValidate = [];

    // Define fields to validate for each page
    if (currentPage === 1) {
      fieldsToValidate = ["name", "email", "mobile", "password"];
    } else if (currentPage === 2) {
      fieldsToValidate = ["storeName", "upiId", "storeDescription", "gstNumber"];
    }

    // Trigger validation for current page fields
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const onSubmit = async (data) => {
    try {
      console.log("Seller Registration Data:", data);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/seller/api/v4/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
          storeName: data.storeName,
          upiId: data.upiId,
          storeDescription: data.storeDescription,
          gstNumber: data.gstNumber,
          socialMediaLinks: data.socialMediaLinks,
          address: data.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Iterate through errorData (array of error objects) and display each error
        if (Array.isArray(errorData.error)) {
          errorData.error.forEach((err) => {
            toast.error(err.msg || "An error occurred while processing your request.");
          });
        } else {
          throw new Error(errorData.msg || errorData.error || "Registration failed.");
        }
        return;
      }

      const result = await response.json();
      console.log("Registration Response:", result);

      // Show success toast for 3 seconds
      toast.success("Registration successful! \nPlease verify your email to activate your account.", {
        autoClose: 4000, // Duration in milliseconds
      });

      // Navigate to login page after 3 seconds
      setTimeout(() => navigate("/auth/seller/login"), 3000);
    } catch (error) {
      console.error("Registration error:", error.message);
      // Show error toast
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  // First page - Personal Information
  const renderPageOne = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="name" className="text-gray-600">Name</Label>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="Enter your name"
                className="mt-2 text-white"
              />
            )}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="w-1/2">
          <Label htmlFor="email" className="text-gray-600">Email</Label>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                placeholder="Enter your email"
                className="mt-2 text-white"
              />
            )}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="mobile" className="text-gray-600">Mobile</Label>
        <Controller
          control={control}
          name="mobile"
          rules={{
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid mobile number",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              id="mobile"
              placeholder="Enter your mobile number"
              className="mt-2 text-white"
            />
          )}
        />
        {errors.mobile && <p className="text-sm text-red-500">{errors.mobile.message}</p>}
      </div>

      <div>
        <Label htmlFor="password" className="text-gray-600">Password</Label>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2 text-white"
            />
          )}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex justify-center mt-4">
        <Button
          type="button"
          onClick={() => handleNextPage(2)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Next
        </Button>
      </div>
    </div>
  );

  // Second page - Store Information
  const renderPageTwo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Store Information</h3>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="storeName" className="text-gray-600">Store Name</Label>
          <Controller
            control={control}
            name="storeName"
            rules={{ required: "Store name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="storeName"
                placeholder="Enter your store name"
                className="mt-2 text-white"
              />
            )}
          />
          {errors.storeName && <p className="text-sm text-red-500">{errors.storeName.message}</p>}
        </div>
        <div className="w-1/2">
          <Label htmlFor="upiId" className="text-gray-600">UPI ID</Label>
          <Controller
            control={control}
            name="upiId"
            rules={{ required: "UPI ID is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="upiId"
                placeholder="Enter your UPI ID"
                className="mt-2 text-white"
              />
            )}
          />
          {errors.upiId && <p className="text-sm text-red-500">{errors.upiId.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="storeDescription" className="text-gray-600">Store Description</Label>
        <Controller
          control={control}
          name="storeDescription"
          rules={{ required: "Store description is required" }}
          render={({ field }) => (
            <Input
              {...field}
              id="storeDescription"
              placeholder="Enter your store description"
              className="mt-2 text-white"
            />
          )}
        />
        {errors.storeDescription && <p className="text-sm text-red-500">{errors.storeDescription.message}</p>}
      </div>

      <div>
        <Label htmlFor="gstNumber" className="text-gray-600">GST Number</Label>
        <Controller
          control={control}
          name="gstNumber"
          rules={{ required: "GST number is required" }}
          render={({ field }) => (
            <Input
              {...field}
              id="gstNumber"
              placeholder="Enter your GST number"
              className="mt-2 text-white"
            />
          )}
        />
        {errors.gstNumber && <p className="text-sm text-red-500">{errors.gstNumber.message}</p>}
      </div>

      <div className="flex justify-between space-x-4 mt-4">
        <Button
          type="button"
          onClick={handlePrevPage}
          className="w-1/2 bg-gray-500 text-white hover:bg-gray-600"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => handleNextPage(3)}
          className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"
        >
          Next
        </Button>
      </div>
    </div>
  );

  // Third page - Social Media & Address
  const renderPageThree = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Social Media & Address</h3>

      {/* Social Media Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["facebook", "instagram", "linkedin"].map((social) => (
          <div key={social}>
            <Label htmlFor={`socialMediaLinks.${social}`} className="text-gray-600">
              {social.charAt(0).toUpperCase() + social.slice(1)}
            </Label>
            <Controller
              control={control}
              name={`socialMediaLinks.${social}`}
              rules={{ required: `${social.charAt(0).toUpperCase() + social.slice(1)} link is required` }}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`socialMediaLinks.${social}`}
                  placeholder={`Enter ${social} link`}
                  className="mt-2 text-white"
                />
              )}
            />
            {errors.socialMediaLinks && errors.socialMediaLinks[social] && (
              <p className="text-sm text-red-500">{errors.socialMediaLinks[social]?.message}</p>
            )}
          </div>
        ))}
      </div>

      {/* Address fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["street", "city", "state", "country", "zipCode"].map((addressField) => (
          <div key={addressField}>
            <Label htmlFor={`address.${addressField}`} className="text-gray-600">
              {addressField.charAt(0).toUpperCase() + addressField.slice(1)}
            </Label>
            <Controller
              control={control}
              name={`address.${addressField}`}
              rules={{ required: `${addressField.charAt(0).toUpperCase() + addressField.slice(1)} is required` }}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`address.${addressField}`}
                  placeholder={`Enter ${addressField}`}
                  className="mt-2 text-white"
                />
              )}
            />
            {errors.address && errors.address[addressField] && (
              <p className="text-sm text-red-500">{errors.address[addressField]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between space-x-4 mt-4">
        <Button
          type="button"
          onClick={handlePrevPage}
          className="w-1/2 bg-gray-500 text-white hover:bg-gray-600"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"
        >
          Register
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-center items-center max-w-md space-y-2">
      <Link to="/">
        <p className="text-[4rem] text-blue-500 font-bold font-unbounded">Booklio</p>
      </Link>
      <div className="bg-white w-[140%] shadow-md rounded-lg">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-center text-gray-800">Register as Seller</h2>
            <div className="flex justify-center">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
                <div className={`w-10 h-1 ${currentPage >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
                <div className={`w-10 h-1 ${currentPage === 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentPage === 1 && renderPageOne()}
              {currentPage === 2 && renderPageTwo()}
              {currentPage === 3 && renderPageThree()}
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/auth/seller/login" className="text-blue-600 hover:underline">Login here</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SellerRegister;