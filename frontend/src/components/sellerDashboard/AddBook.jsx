import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    // Retrieve the token from local storage
    const token = localStorage.getItem("accessToken");

    // Check for token availability
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    // Prepare the request payload
    const requestBody = {
      token: `Bearer ${token}`,
      isbn: data.isbn,
      price: data.price,
      stock: data.stock
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      console.log(responseData);

      if (response.ok) {
        toast.success("Book added successfully!");
        reset(); // Clear form inputs
      } else {
        // Display backend error message
        toast.error(responseData.msg || "Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("An error occurred while adding the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#232323] shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Add a New Book</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="isbn">
            ISBN:
          </label>
          <input
            type="text"
            id="isbn"
            {...register("isbn", {
              required: "ISBN is required",
              pattern: {
                value: /^[A-Za-z0-9]{10}$/,
                message: "ISBN must be exactly 10 digits",
              },
            })}
            className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ISBN"
          />
          {errors.isbn && <p className="text-sm text-red-500">{errors.isbn.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="price">
            Price (₹):
          </label>
          <input
            type="number"
            id="price"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Price"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="stock">
            Stock :
          </label>
          <input
            type="number"
            id="stock"
            {...register("stock", {
              required: "stock is required",
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Available Stock"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
