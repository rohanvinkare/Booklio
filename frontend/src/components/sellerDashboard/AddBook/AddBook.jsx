import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Papa from 'papaparse';
import { FaUpload, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { clearSellerBookData } from "@/store/sellerSlice";

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
          icon = processedBook.status === 'success'
            ? <FaCheck className="text-green-400" />
            : <FaTimes className="text-red-400" />;
          message = processedBook.error || 'Added successfully';
        }

        return (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg ${status === 'success' ? 'bg-green-500/10'
              : status === 'failed' ? 'bg-red-500/10'
                : status === 'skipped' ? 'bg-yellow-500/10'
                  : 'bg-gray-700/50'
              }`}
          >
            <div className="flex items-center space-x-2">
              {icon || <div className="w-4 h-4" />}
              <div>
                <span className="text-sm text-gray-300">ISBN: {book.isbn}</span>
                {message && (
                  <p className={`text-xs ${status === 'success' ? 'text-green-400'
                    : status === 'failed' ? 'text-red-400'
                      : status === 'skipped' ? 'text-yellow-400'
                        : 'text-gray-400'} mt-1`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
            <span className={`text-xs font-medium ${status === 'success' ? 'text-green-400'
              : status === 'failed' ? 'text-red-400'
                : status === 'skipped' ? 'text-yellow-400'
                  : 'text-gray-400'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const dispatch = useDispatch();


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setBooks([]);
      setProcessedBooks([]);
      setCurrentProgress({ current: 0, total: 0 });
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const validateISBN = (isbn) => /^[0-9]{10}$/.test(isbn.replace(/[\s-]/g, ''));

  const addSingleBook = async (bookData) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Authentication token not found");

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/add-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: `Bearer ${token}`,
        isbn: bookData.isbn,
        price: parseFloat(bookData.price),
        stock: parseInt(bookData.stock)
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || "Failed to add book");

    return data;
  };

  const addBooksFromCSV = () => {
    if (!csvFile) return toast.error('Please select a CSV file first');
    setLoading(true);
    setShowProgress(true);

    Papa.parse(csvFile, {
      header: true,
      complete: async ({ data }) => {
        setBooks(data);
        const validBooks = data.filter(b => validateISBN(b.isbn) && b.price > 0 && b.stock > 0);
        setCurrentProgress({ current: 0, total: validBooks.length });

        const thirteenDigitISBNs = data.filter(b => b.isbn && b.isbn.replace(/[\s-]/g, '').length === 13);
        if (thirteenDigitISBNs.length > 0) {
          toast.custom(() => (
            <div className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded-md">
              <FaExclamationTriangle className="mr-2" /> {thirteenDigitISBNs.length} books skipped (13-digit ISBNs)
            </div>
          ), { duration: 4000 });
        }

        let success = 0, failure = 0;
        for (let i = 0; i < validBooks.length; i++) {
          setCurrentProgress(prev => ({ ...prev, current: i + 1 }));
          try {
            await addSingleBook(validBooks[i]);
            success++;
            setProcessedBooks(p => [...p, { isbn: validBooks[i].isbn, status: 'success' }]);
          } catch (e) {
            failure++;
            setProcessedBooks(p => [...p, { isbn: validBooks[i].isbn, status: 'failed', error: e.message }]);
          }
        }

        toast.success(`Success: ${success}, Failed: ${failure}`);
        dispatch(clearSellerBookData());
        setCsvFile(null);
        setLoading(false);

      },
      error: err => {
        console.error("CSV parse error:", err);
        toast.error("Failed to parse CSV");
        setLoading(false);
        setShowProgress(false);
      }
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addSingleBook(data);
      toast.success("Book added successfully!");
      dispatch(clearSellerBookData());
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 bg-transparent backdrop-blur-lg rounded-xl shadow-xl text-white">
      <h2 className="text-2xl font-semibold text-center mb-8">Add Books to Inventory</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Manual Form */}
        <div className="bg-[#1a1a1a]/60 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Add Single Book</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {["isbn", "price", "stock"].map((field, idx) => (
              <div key={idx}>
                <label className="block mb-2 capitalize">{field}</label>
                <input
                  type={field === "isbn" ? "text" : "number"}
                  {...register(field, {
                    required: `${field} is required`,
                    pattern: field === "isbn" ? { value: /^[0-9]{10}$/, message: "Must be 10 digits" } : undefined,
                    min: field !== "isbn" ? { value: 1, message: "Must be > 0" } : undefined
                  })}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent text-white font-semibold placeholder:text-gray-400 focus:ring focus:ring-blue-500"
                  placeholder={`Enter ${field}`}
                />
                {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field].message}</p>}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </form>
        </div>

        {/* Right: CSV Import */}
        <div className="bg-[#1a1a1a]/60 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Import from CSV</h3>
          <p className="text-sm text-gray-400 mb-4">Columns: <span className="text-gray-200">isbn, price, stock</span></p>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-[#2a2a2a]/60 transition">
            <div className="flex flex-col items-center">
              <FaUpload className="text-gray-400 text-3xl mb-2" />
              <p className="text-sm">Click or drag CSV here</p>
            </div>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {csvFile && <p className="text-sm mt-2 text-gray-300">Selected: <span className="font-semibold">{csvFile.name}</span></p>}

          <div className="mt-4">
            <button
              onClick={addBooksFromCSV}
              disabled={!csvFile || loading}
              className="w-full py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Import from CSV"}
            </button>
          </div>

          {/* Example CSV */}
          <div className="mt-6 p-4 bg-black/20 border border-gray-600 rounded-lg text-sm font-mono">
            <p className="text-gray-400 mb-1">Example CSV Format:</p>
            <pre className="text-white font-semibold">
              isbn,price,stock <br />
              0439708184,299,15 <br />
              0451524934,200,20 <br />
              0261102214,149,17<br />
              0743273567,249,8<br />
            </pre>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="max-w-2xl bg-[#2a2a2a] border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Processing Books</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex justify-between mb-2 text-sm text-gray-300">
              <span>Book {currentProgress.current} / {currentProgress.total}</span>
              <span>{Math.round((currentProgress.current / currentProgress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
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



