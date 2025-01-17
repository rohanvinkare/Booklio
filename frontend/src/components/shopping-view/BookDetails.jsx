import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const BookDetails = () => {
  const { isbn, sellerId } = useParams(); // Extract isbn and sellerId from params
  const isbnId = isbn;
  const sellerUniqueId = sellerId;
  const [book, setBook] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);

  const navigate = useNavigate();


  const handlePlaceOrderClick = () => {
    navigate("/placeOrder", {
      state: { sellerUniqueId, isbnId },
    });
  };

  useEffect(() => {
    // Fetch book details
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/sellers-by-book/${isbn}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBook(data.book);
          setSellers(data.sellers);
        } else {
          console.error("Failed to fetch data:", data.msg);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [isbn]);

  useEffect(() => {
    if (sellerId) {
      // Fetch seller details using sellerId
      fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/${sellerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSellerInfo(data.seller);
          } else {
            console.error("Failed to fetch seller info:", data.msg);
          }
        })
        .catch((error) => console.error("Error fetching seller data:", error));
    }
  }, [sellerId]);

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div className="p-10">
      <p className="text-3xl px-10 font-extrabold font-helvetica">
        Book Details
      </p>
      {/* Book Details Section */}
      <div className="p-6">
        <Card className="shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col mx-20 md:flex-row gap-6">
            {/* Book Cover */}
            <div className="w-full md:w-1/3">
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="w-80 h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            {/* Book Info */}
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{book.volumeInfo.title}</h1>
              <p className="text-lg text-gray-600 mb-4">
                <strong>Author(s):</strong> {book.volumeInfo.authors?.join(", ")}
              </p>
              <p className="text-gray-700 mb-4">{book.volumeInfo.description}</p>
              <div className="text-gray-600 space-y-2">
                <p>
                  <strong>Publisher:</strong> {book.volumeInfo.publisher}
                </p>
                <p>
                  <strong>Categories:</strong>{" "}
                  {book.volumeInfo.categories?.join(", ")}
                </p>
                <p>
                  <strong>Published Date:</strong> {book.volumeInfo.publishedDate}
                </p>
                <p>
                  <strong>ISBN:</strong>{" "}
                  {book.volumeInfo.industryIdentifiers[0]?.identifier}
                </p>
              </div>
              <div>
                <Button onClick={handlePlaceOrderClick} className="p-4 bg-blue-600 text-white my-5">
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Seller Info Section */}
      {sellerInfo && (
        <div className="mb-6 m-5">
          <p className="text-3xl px-10 p-5 font-extrabold font-helvetica">
            Seller Information
          </p>
          <Card className="shadow-lg flex items-center justify-center p-6">
            <CardHeader>
              <img
                src={sellerInfo.image}
                alt={sellerInfo.storeName}
                className="w-full h-80 object-cover rounded-lg mb-4"
              />
              <CardTitle className="text-lg font-bold">{sellerInfo.storeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">
                <strong>Seller:</strong> {sellerInfo.name}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Description:</strong> {sellerInfo.storeDescription}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong>{" "}
                {`${sellerInfo.address.street}, ${sellerInfo.address.city}, ${sellerInfo.address.state}, ${sellerInfo.address.zipCode}`}
              </p>
              <div className="flex space-x-2 mt-2">
                {/* Facebook Icon */}
                <a
                  href={sellerInfo.socialMediaLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaFacebookF size={24} />
                </a>

                {/* Instagram Icon */}
                <a
                  href={sellerInfo.socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800"
                >
                  <FaInstagram size={24} />
                </a>

                {/* LinkedIn Icon */}
                <a
                  href={sellerInfo.socialMediaLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-gray-600 mb-2">
                <strong>Contact:</strong> {sellerInfo.email}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>UPI ID:</strong> {sellerInfo.upiId}
              </p>
              <Button
                onClick={() => alert(`Contacting ${sellerInfo.name}`)}
                className="bg-blue-500 text-white"
              >
                Contact Seller
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Sellers List Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 m-5">Other Sellers Selling This Book</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <Card key={seller.sellerId} className="shadow-lg p-4 m-5">
              <CardHeader>
                <img
                  src={seller.image}
                  alt={seller.storeName}
                  className="w-full h-80 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-lg font-bold">{seller.storeName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  <strong>Seller:</strong> {seller.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Description:</strong> {seller.storeDescription}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Location:</strong>{" "}
                  {`${seller.address.street}, ${seller.address.city}, ${seller.address.state}, ${seller.address.zipCode}`}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-gray-600 mb-2">
                  <strong>Contact:</strong> {seller.email}
                </p>
                <Button
                  onClick={() => alert(`Contacting ${seller.name}`)}
                  className="bg-blue-500 text-white"
                >
                  Contact Seller
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
