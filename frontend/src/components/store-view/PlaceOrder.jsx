import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import placeOrder from "../../assets/placeOrder.png";
import { Minus, Plus, MapPin, Package, CreditCard} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PlaceOrder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const location = useLocation();
  const { sellerUniqueId, isbnId } = location.state || {};
  const navigate = useNavigate();
  const sellerId = sellerUniqueId;
  const isbn = isbnId;

  const [quantity, setQuantity] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [zipCodeSuggestions, setZipCodeSuggestions] = useState([]);
  const [showZipCodeSuggestions, setShowZipCodeSuggestions] = useState(false);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch city suggestions
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setCitySuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setCitySuggestions(data);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      toast.error("Failed to fetch city suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ZIP codes for a city
  const fetchZipCodes = async (country, city) => {
    try {
      const response = await fetch(
        `https://api.zippopotam.us/${country.toLowerCase()}/${city.toLowerCase()}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.places || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching ZIP codes:", error);
      return [];
    }
  };

  // Debounced version of fetchCitySuggestions
  const debouncedFetchSuggestions = debounce(fetchCitySuggestions, 300);

  // Handle city input change
  const handleCityChange = (e) => {
    const value = e.target.value;
    setValue("city", value);
    debouncedFetchSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle city selection
  const handleCitySelect = async (suggestion) => {
    const cityName = suggestion.display_name.split(",")[0];
    const country = suggestion.address.country || "";
    const state = suggestion.address.state || "";
    
    setValue("city", cityName);
    setValue("state", state);
    setValue("country", country);
    
    // Fetch ZIP codes for the selected city
    const zipCodes = await fetchZipCodes(country, cityName);
    if (zipCodes.length > 0) {
      // If multiple ZIP codes exist, show them in a dropdown
      setZipCodeSuggestions(zipCodes);
      setShowZipCodeSuggestions(true);
    } else {
      // If no ZIP codes found, use the one from OpenStreetMap
      setValue("zipCode", suggestion.address.postcode || "");
    }
    
    setCitySuggestions([]);
    setShowSuggestions(false);
  };


  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    setIsOrderPlacing(true);
    setIsOrderSuccess(false);

    const requestBody = {
      token: `Bearer ${token}`,
      sellerId,
      isbn,
      quantity,
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
        setIsOrderSuccess(true);
        toast.success("Order placed successfully!");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/user");
      } else {
        toast.error(`Order failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Error placing order:", error);
    } finally {
      setIsOrderPlacing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isOrderPlacing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800/90 p-8 rounded-2xl shadow-2xl text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Processing Your Order</h3>
              <p className="text-gray-400">Please wait while we process your order...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent pt-20 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Complete Your Order
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Order Summary */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl px-8 pb-8 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                <img 
                  src={placeOrder} 
                  alt="Place Order" 
                  className="w-100 h-80 object-contain"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order Summary</h3>
                    <p className="text-gray-400">Review your order details</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Secure Payment</h3>
                    <p className="text-gray-400">Safe and encrypted transaction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <MapPin className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Fast Delivery</h3>
                    <p className="text-gray-400">Quick and reliable shipping</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Shipping Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {/* Street */}
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
                      Street Address
                    </label>
                    <input
                      id="street"
                      type="text"
                      {...register("street", { required: "Street is required" })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your street address"
                    />
                    {errors.street && (
                      <p className="text-red-400 text-sm mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  {/* City with Autocomplete */}
                  <div className="relative">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      onChange={handleCityChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your city"
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-10">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    {showSuggestions && citySuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg">
                        {citySuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-700/50 cursor-pointer text-white"
                            onClick={() => handleCitySelect(suggestion)}
                          >
                            {suggestion.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      {...register("state", { required: "State is required" })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  {/* Zip Code with Suggestions */}
                  <div className="relative">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
                      Zip Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      {...register("zipCode", { 
                        required: "Zip Code is required",
                        pattern: {
                          value: /^[1-9][0-9]{5}$/,
                          message: "Please enter a valid 6-digit pincode"
                        }
                      })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your zip code"
                    />
                    {errors.zipCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      {...register("country", { required: "Country is required" })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter your country"
                    />
                    {errors.country && (
                      <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={decrement}
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-300"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        id="quantity"
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-16 text-center px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                      />
                      <button
                        type="button"
                        onClick={increment}
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isOrderPlacing}
                  className={`w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform ${
                    isOrderPlacing ? "cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  <span className={`flex items-center justify-center gap-2 ${isOrderPlacing ? "opacity-0" : "opacity-100"}`}>
                    Place Order
                  </span>
                  
                  {/* Loading Spinner */}
                  {isOrderPlacing && !isOrderSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Success Checkmark */}
                  {isOrderSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceOrder;