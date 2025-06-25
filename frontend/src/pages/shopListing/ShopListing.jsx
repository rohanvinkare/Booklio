// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { booksData } from "@/store/user/books";

// import GenreFilter from "@/components/shopListing/GenreFilter";
// import SearchAndFilter from "@/components/shopListing/SearchAndFilter";
// import BookGrid from "@/components/shopListing/BookGrid";
// import BookDialog from "@/components/shopListing/BookDialog";
// import LoadingSpinner from "@/components/shopListing/LoadingSpinner";

// const shopListing = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const bookData = useSelector((state) => state.booksListing.value);
//     const [selectedGenres, setSelectedGenres] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedBook, setSelectedBook] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [books, setBooks] = useState([]);

//     useEffect(() => {
//         if (Object.keys(bookData).length === 0) {
//             setIsLoading(true);
//             fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (data.success) dispatch(booksData(data.bookData));
//                 })
//                 .catch(console.error)
//                 .finally(() => setIsLoading(false));
//         } else {
//             setIsLoading(false);
//         }
//     }, [dispatch, bookData]);

//     useEffect(() => {
//         const updatedBooks = selectedGenres.length === 0
//             ? Object.values(bookData).flat()
//             : selectedGenres.flatMap((genre) => bookData[genre] || []);
//         setBooks(updatedBooks);
//     }, [selectedGenres, bookData]);

//     const filteredBooks = books.filter((book) => {
//         const title = book.data.volumeInfo?.title?.toLowerCase() || "";
//         const authors = book.data.volumeInfo?.authors?.join(", ").toLowerCase() || "";
//         return title.includes(searchQuery.toLowerCase()) || authors.includes(searchQuery.toLowerCase());
//     });

//     const handleBuyNowClick = (isbn, sellerId, event) => {
//         event.stopPropagation();
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         navigate(`/seller/${sellerId}/isbn/${isbn}`);
//     };

//     return (
//         <div className="flex bg-[#060606]/80 border-blue-950/60 min-h-screen">
//             <div className="hidden md:block fixed w-1/4 xl:w-1/5 h-full overflow-auto">
//                 <GenreFilter bookData={bookData} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
//             </div>

//             <div className="w-full md:w-3/4 md:ml-[25%] xl:w-4/5 xl:ml-[20%] p-4 md:p-10 mt-[4rem] pb-16">
//                 <SearchAndFilter
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     bookData={bookData}
//                     selectedGenres={selectedGenres}
//                     setSelectedGenres={setSelectedGenres}
//                 />

//                 <h2 className="text-2xl font-bold mb-6 text-white">
//                     {selectedGenres.length > 0
//                         ? `Books in ${selectedGenres.join(", ")}`
//                         : "All Books"}
//                 </h2>

//                 {isLoading
//                     ? <LoadingSpinner />
//                     : <BookGrid books={filteredBooks} handleBuyNowClick={handleBuyNowClick} setSelectedBook={setSelectedBook} />
//                 }

//                 <BookDialog book={selectedBook} onClose={() => setSelectedBook(null)} handleBuyNowClick={handleBuyNowClick} />
//             </div>
//         </div>

//     );
// };

// export default shopListing;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/user/books";

import GenreFilter from "@/components/shopListing/GenreFilter";
import SearchAndFilter from "@/components/shopListing/SearchAndFilter";
import BookGrid from "@/components/shopListing/BookGrid";
import BookDialog from "@/components/shopListing/BookDialog";
import LoadingSpinner from "@/components/shopListing/LoadingSpinner";
import ShoppingHeader from "@/components/store-view/ShopHeader.jsx";

const shopListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const bookData = useSelector((state) => state.booksListing.value);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (Object.keys(bookData).length === 0) {
            setIsLoading(true);
            fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) dispatch(booksData(data.bookData));
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [dispatch, bookData]);

    useEffect(() => {
        const updatedBooks = selectedGenres.length === 0
            ? Object.values(bookData).flat()
            : selectedGenres.flatMap((genre) => bookData[genre] || []);
        setBooks(updatedBooks);
    }, [selectedGenres, bookData]);

    const filteredBooks = books.filter((book) => {
        const title = book.data.volumeInfo?.title?.toLowerCase() || "";
        const authors = book.data.volumeInfo?.authors?.join(", ").toLowerCase() || "";
        return title.includes(searchQuery.toLowerCase()) || authors.includes(searchQuery.toLowerCase());
    });

    const handleBuyNowClick = (isbn, sellerId, event) => {
        event.stopPropagation();
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate(`/seller/${sellerId}/isbn/${isbn}`);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-black via-[#0d0b1e] to-black text-white">

            <ShoppingHeader />

            {/* Genre Filter Sidebar */}
            <div className="hidden md:block fixed w-1/4 xl:w-1/5 h-full overflow-auto backdrop-blur-sm border-r border-[#1a1a1a] shadow-md">
                <GenreFilter
                    bookData={bookData}
                    selectedGenres={selectedGenres}
                    setSelectedGenres={setSelectedGenres}
                />
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 md:ml-[25%] xl:w-4/5 xl:ml-[20%] p-4 md:p-10 mt-[4rem] pb-16">
                <SearchAndFilter
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    bookData={bookData}
                    selectedGenres={selectedGenres}
                    setSelectedGenres={setSelectedGenres}
                />

                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#38bdf8]">
                    {selectedGenres.length > 0
                        ? `Books in ${selectedGenres.join(", ")}`
                        : "All Books"}
                </h2>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <BookGrid
                        books={filteredBooks}
                        handleBuyNowClick={handleBuyNowClick}
                        setSelectedBook={setSelectedBook}
                    />
                )}

                <BookDialog
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    handleBuyNowClick={handleBuyNowClick}
                />
            </div>
        </div>
    );
};

export default shopListing;
