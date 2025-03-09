import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const PlaceOrder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const { sellerUniqueId, isbnId } = location.state || {};
  const navigate = useNavigate();
  const sellerId = sellerUniqueId;
  const isbn = isbnId;
  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    const requestBody = {
      token: `Bearer ${token}`,
      sellerId,
      isbn,
      shippingAddress: data,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/order/api/v1/order-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Order placed successfully!");
      } else {
        toast.error(`Order failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Error placing order:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate("/user/orders");
  };

  return (
    <div className="p-6">
      <p className="text-4xl px-80 font-bold mb-4">Ordering Book</p>
      <h2 className="text-2xl px-80 font-bold mb-4">Shipping Address</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-80">
        {/* Street */}
        <div>
          <label htmlFor="street" className="block text-sm font-semibold">
            Street
          </label>
          <input
            id="street"
            type="text"
            {...register("street", { required: "Street is required" })}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.street && (
            <p className="text-red-600 text-xs">{errors.street.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-semibold">
            City
          </label>
          <input
            id="city"
            type="text"
            {...register("city", { required: "City is required" })}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.city && (
            <p className="text-red-600 text-xs">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-semibold">
            State
          </label>
          <input
            id="state"
            type="text"
            {...register("state", { required: "State is required" })}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.state && (
            <p className="text-red-600 text-xs">{errors.state.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-semibold">
            Country
          </label>
          <input
            id="country"
            type="text"
            {...register("country", { required: "Country is required" })}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.country && (
            <p className="text-red-600 text-xs">{errors.country.message}</p>
          )}
        </div>

        {/* Zip Code */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-semibold">
            Zip Code
          </label>
          <input
            id="zipCode"
            type="text"
            {...register("zipCode", { required: "Zip Code is required" })}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.zipCode && (
            <p className="text-red-600 text-xs">{errors.zipCode.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Place Order
        </button>
      </form>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
};

export default PlaceOrder;
