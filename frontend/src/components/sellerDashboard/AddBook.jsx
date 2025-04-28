import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Papa from 'papaparse';
import { FaUpload, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BookStatusList = ({ books, processedBooks }) => {
  return (
    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
      {books.map((book, index) => {
        const processedBook = processedBooks.find(pb => pb.isbn === book.isbn);
        const isThirteenDigit = book.isbn.replace(/[\s-]/g, '').length === 13;
        
        let status = 'pending';
        let icon = null;
        let message = '';
        
        if (isThirteenDigit) {
          status = 'skipped';
          icon = <FaExclamationTriangle className="text-yellow-400" />;
          message = '13-digit ISBN not accepted';
        } else if (processedBook) {
          status = processedBook.status;
          icon = processedBook.status === 'success' ? 
            <FaCheck className="text-green-400" /> : 
            <FaTimes className="text-red-400" />;
          message = processedBook.error || 'Added successfully';
        }

        return (
          <div 
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg ${
              status === 'success' ? 'bg-green-500/10' : 
              status === 'failed' ? 'bg-red-500/10' :
              status === 'skipped' ? 'bg-yellow-500/10' :
              'bg-gray-700/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              {icon || <div className="w-4 h-4" />}
              <div>
                <span className="text-sm text-gray-300">ISBN: {book.isbn}</span>
                {message && (
                  <p className={`text-xs ${
                    status === 'success' ? 'text-green-400' :
                    status === 'failed' ? 'text-red-400' :
                    status === 'skipped' ? 'text-yellow-400' :
                    'text-gray-400'
                  } mt-1`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
            <span className={`text-xs ${
              status === 'success' ? 'text-green-400' :
              status === 'failed' ? 'text-red-400' :
              status === 'skipped' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {status === 'success' ? 'Added' :
               status === 'failed' ? 'Failed' :
               status === 'skipped' ? 'Skipped' :
               'Pending'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [books, setBooks] = useState([]);
  const [processedBooks, setProcessedBooks] = useState([]);
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0 });
  const [showProgress, setShowProgress] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      // Reset states when new file is uploaded
      setBooks([]);
      setProcessedBooks([]);
      setCurrentProgress({ current: 0, total: 0 });
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const validateISBN = (isbn) => {
    const cleanISBN = isbn.replace(/[\s-]/g, '');
    return /^[0-9]{10}$/.test(cleanISBN);
  };

  const addSingleBook = async (bookData) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/add-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `Bearer ${token}`,
        isbn: bookData.isbn,
        price: parseFloat(bookData.price),
        stock: parseInt(bookData.stock)
      }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.msg || "Failed to add book");
    }

    return responseData;
  };

  const addBooksFromCSV = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setShowProgress(true);
    try {
      // Parse CSV file
      Papa.parse(csvFile, {
        header: true,
        complete: async (results) => {
          if (!results.data || results.data.length === 0) {
            toast.error('CSV file is empty');
            setLoading(false);
            setShowProgress(false);
            return;
          }

          // Store all books
          setBooks(results.data);

          // Filter valid books
          const validBooks = results.data.filter(book => {
            if (!book.isbn || !book.price || !book.stock) return false;
            if (isNaN(book.price) || isNaN(book.stock)) return false;
            if (parseFloat(book.price) <= 0 || parseInt(book.stock) <= 0) return false;
            return validateISBN(book.isbn);
          });

          if (validBooks.length === 0) {
            toast.error('No valid books found in the CSV file');
            setLoading(false);
            setShowProgress(false);
            return;
          }

          // Count 13-digit ISBNs
          const thirteenDigitISBNs = results.data.filter(book => {
            if (!book.isbn) return false;
            const cleanISBN = book.isbn.replace(/[\s-]/g, '');
            return /^[0-9]{13}$/.test(cleanISBN);
          });

          if (thirteenDigitISBNs.length > 0) {
            toast((t) => (
              <div className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg">
                <FaExclamationTriangle className="text-white" />
                <span>{thirteenDigitISBNs.length} books with 13-digit ISBNs were skipped</span>
              </div>
            ), {
              duration: 4000,
            });
          }

          setCurrentProgress({ current: 0, total: validBooks.length });

          // Process each book
          let successCount = 0;
          let failureCount = 0;

          for (let i = 0; i < validBooks.length; i++) {
            const book = validBooks[i];
            setCurrentProgress(prev => ({ ...prev, current: i + 1 }));

            try {
              await addSingleBook(book);
              successCount++;
              setProcessedBooks(prev => [...prev, { isbn: book.isbn, status: 'success' }]);
            } catch (error) {
              failureCount++;
              setProcessedBooks(prev => [...prev, { 
                isbn: book.isbn, 
                status: 'failed',
                error: error.message
              }]);
            }
          }

          if (successCount > 0) {
            toast.success(`Successfully added ${successCount} books. Failed to add ${failureCount} books.`);
          } else {
            toast.error('Failed to add any books. Please check the data and try again.');
          }

          setCsvFile(null);
          setLoading(false);
          // Don't close the progress dialog automatically
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.error("Error parsing CSV file");
          setLoading(false);
          setShowProgress(false);
        }
      });
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("An error occurred while processing the CSV file.");
      setLoading(false);
      setShowProgress(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addSingleBook(data);
      toast.success("Book added successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-[#232323] shadow-md rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-semibold text-center mb-8">Add Books to Inventory</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Single Book Form */}
        <div className="space-y-6">
          <div className="p-6 border border-gray-600 rounded-lg bg-[#2a2a2a]">
            <h3 className="text-xl font-semibold text-white mb-6">Add Single Book</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-white mb-2 font-medium" htmlFor="isbn">
                  ISBN:
                </label>
                <input
                  type="text"
                  id="isbn"
                  {...register("isbn", {
                    required: "ISBN is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "ISBN must be exactly 10 digits",
                    },
                  })}
                  className="w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Enter ISBN"
                />
                {errors.isbn && <p className="mt-1 text-sm text-red-500">{errors.isbn.message}</p>}
              </div>

              <div>
                <label className="block text-white mb-2 font-medium" htmlFor="price">
                  Price (₹):
                </label>
                <input
                  type="number"
                  id="price"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Price must be greater than 0"
                    }
                  })}
                  className="w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Enter Price"
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-white mb-2 font-medium" htmlFor="stock">
                  Stock:
                </label>
                <input
                  type="number"
                  id="stock"
                  {...register("stock", {
                    required: "Stock is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Stock must be greater than 0"
                    }
                  })}
                  className="w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Available Stock"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Book"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - CSV Upload */}
        <div className="space-y-6">
          <div className="p-6 border border-gray-600 rounded-lg bg-[#2a2a2a]">
            <h3 className="text-xl font-semibold text-white mb-3">Import from CSV</h3>
            <p className="text-sm text-gray-400 mb-4">
              Upload a CSV file with the following columns:
              <br />
              <span className="text-gray-300">isbn, price, stock</span>
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV files only</p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {csvFile && (
                <div className="text-sm text-gray-300">
                  Selected file: <span className="font-medium">{csvFile.name}</span>
                </div>
              )}

              <button
                onClick={addBooksFromCSV}
                disabled={!csvFile || loading}
                className={`w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none transition-colors ${
                  (!csvFile || loading) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Import from CSV"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dialog */}
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="max-w-2xl bg-[#2a2a2a] border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Processing Books
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span className="font-medium">Processing book {currentProgress.current} of {currentProgress.total}</span>
              <span className="font-medium">{Math.round((currentProgress.current / currentProgress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
              ></div>
            </div>
            
            <BookStatusList books={books} processedBooks={processedBooks} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBook;

