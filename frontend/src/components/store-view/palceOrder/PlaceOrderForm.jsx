import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";
import { clearOrderData } from "@/store/user/order";

const PlaceOrder = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sellerUniqueId, isbnId } = location.state || {};
  const sellerId = sellerUniqueId;
  const isbn = isbnId;

  const [quantity, setQuantity] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchCitySuggestions = async (query) => {
    if (!query) return setCitySuggestions([]);
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "61d308e8f0mshebcadb1bf23b06ep1a52d1jsnf7a26506bf60",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      const data = await res.json();
      setCitySuggestions(data.data || []);
    } catch {
      toast.error("Failed to fetch city suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchZipCodes = async (city, state) => {
    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/zipcode?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`,
        {
          headers: {
            "X-Api-Key": "g/XH35t8rJorF+ptvoEy5Q==2efm8QTyNYurMobR",
          },
        }
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const debouncedFetchSuggestions = debounce(fetchCitySuggestions, 300);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setValue("city", value);
    debouncedFetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleCitySelect = async (suggestion) => {
    const cityName = suggestion.city;
    const state = suggestion.region || "";
    const country = suggestion.country || "";

    setValue("city", cityName);
    setValue("state", state);
    setValue("country", country);

    const zipCodes = await fetchZipCodes(cityName, state);
    if (zipCodes.length > 0) {
      setValue("zipCode", zipCodes[0]["zip"] || "");
    } else {
      setValue("zipCode", "");
    }

    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("User is not authenticated. Please log in.");

    setIsOrderPlacing(true);
    setIsOrderSuccess(false);

    const requestBody = {
      token: `Bearer ${token}`,
      sellerId,
      isbn,
      quantity: parseInt(quantity, 10),
      shippingAddress: data,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/order/api/v1/order-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsOrderSuccess(true);
        toast.success("Order placed successfully!");

        // ✅ Clear Redux store order list
        dispatch(clearOrderData());

        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/user");
      } else {
        toast.error(`Order failed: ${result.message || "Unknown error"}`);
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsOrderPlacing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-gray-900/50 border border-gray-700/40 backdrop-blur-xl rounded-3xl shadow-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField id="street" label="Street Address" placeholder="Enter your street" register={register} errors={errors} required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input
                  id="city"
                  type="text"
                  onChange={handleCityChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm"
                  placeholder="Enter your city"
                />
                {isLoading && (
                  <div className="absolute right-3 top-10 animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                )}
                {showSuggestions && citySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {citySuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-700/50 cursor-pointer text-white text-sm"
                        onClick={() => handleCitySelect(suggestion)}
                      >
                        {suggestion.city}, {suggestion.region}, {suggestion.country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <InputField id="state" label="State" placeholder="Enter your state" register={register} errors={errors} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField id="zipCode" label="Zip Code" placeholder="Enter your pincode" register={register} errors={errors} required />
              <InputField id="country" label="Country" placeholder="Enter your country" register={register} errors={errors} required />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={decrement} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg">
                  <Minus size={20} />
                </button>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 sm:w-24 text-center px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm"
                />
                <button type="button" onClick={increment} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isOrderPlacing}
              className={`w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-all duration-300 ${isOrderPlacing ? "cursor-not-allowed" : "hover:scale-105"}`}
            >
              <span className={`${isOrderPlacing ? "opacity-0" : "opacity-100"} flex items-center justify-center gap-2`}>
                Place Order
              </span>
              {isOrderPlacing && !isOrderSuccess && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {isOrderSuccess && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, placeholder, register, errors, required, pattern }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      id={id}
      type="text"
      {...register(id, {
        required: required ? `${label} is required` : false,
        pattern: pattern || undefined,
      })}
      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
      placeholder={placeholder}
    />
    {errors[id] && <p className="text-red-400 text-sm mt-1">{errors[id].message}</p>}
  </div>
);

export default PlaceOrder;
