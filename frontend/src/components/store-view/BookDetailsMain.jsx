import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaBookOpen, FaStar, FaInfoCircle, FaFacebookF, FaInstagram, FaLinkedin, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import notAvailable from "@/assets/notAvailable.png";

const BookDetailsMain = ({ book, price, stock, sellerInfo, onPlaceOrderClick }) => {
  const [showMore, setShowMore] = useState(false);
  const [showSeller, setShowSeller] = useState(false);

  const volumeInfo = book?.volumeInfo || {};
  const {
    title,
    authors,
    publisher,
    publishedDate,
    description,
    categories,
    averageRating,
    ratingsCount,
    imageLinks,
    industryIdentifiers,
    language,
    previewLink,
    pageCount,
  } = volumeInfo;

  const trimmedDescription = description?.length > 250 ? description.slice(0, 250) + "..." : description;

  return (
    <div className="mb-20 px-4 sm:px-6 md:px-10 max-w-[1280px] mx-auto">
      <div className="relative bg-gradient-to-br from-[#000000] via-[#0d0b1e] to-[#000000] border border-gray-700 rounded-3xl shadow-[0_0_40px_rgba(56,189,248,0.15)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

        {/* LEFT: BOOK IMAGE + Price + Stock + Seller + Place Order */}
        <div className="flex flex-col items-center gap-4 relative w-full">
          <div className="relative w-fit">
            <img
              src={imageLinks?.thumbnail || notAvailable}
              alt={title || "Book Cover"}
              className="w-48 sm:w-64 h-auto object-cover rounded-xl border border-gray-600 shadow-xl"
            />

            {/* 🔴 OUT OF STOCK STICKER */}
            {stock <= 0 && (
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-800 to-red-400 text-white px-5 py-2 text-xs font-bold rounded-md shadow-lg rotate-[-8deg] z-10">
                OUT OF STOCK
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 w-full">

            <div className="flex items-center justify-center flex-wrap gap-3">
              {price && (
                <span className="bg-gradient-to-br from-yellow-400 to-yellow-200 text-gray-900 px-6 py-1.5 rounded-full text-base sm:text-lg font-bold shadow">
                  ₹{price.toLocaleString()}
                </span>
              )}
              <span
                className={`px-4 py-1 text-xs sm:text-sm font-semibold rounded-full shadow ring-1 ring-opacity-50 tracking-wide 
      ${stock > 0
                    ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400"
                    : "bg-red-400/10 text-red-300 ring-red-800"}`}
              >
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </span>
            </div>



            {sellerInfo && (
              <Button
                onClick={() => setShowSeller(true)}
                variant="ghost"
                className="mt-2 text-blue-300 border border-blue-500 hover:bg-blue-600/30 hover:text-white px-4 py-1.5 text-sm rounded-lg font-medium shadow-sm w-full"
              >
                <FaInfoCircle className="mr-2" />
                View Seller
              </Button>
            )}

            {stock > 0 && (
              <Button
                onClick={onPlaceOrderClick}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                <FaBookOpen className="mr-2" />
                Place Order
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:col-span-2 flex flex-col space-y-6 text-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
              {title || "Untitled"}
            </h1>
            {(averageRating || ratingsCount) && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <FaStar />
                <span>{averageRating || "N/A"} ({ratingsCount || 0} reviews)</span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-semibold text-sky-400 mb-1">Description</h2>
            <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
              {showMore ? description : trimmedDescription || "No description available."}
            </p>
            {description?.length > 350 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-1 text-blue-400 text-sm hover:underline"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {authors && <Meta label="Author(s)" value={authors.join(", ")} />}
            {publisher && <Meta label="Publisher" value={publisher} />}
            {publishedDate && <Meta label="Published" value={publishedDate} />}
            {categories && <Meta label="Categories" value={categories.join(", ")} />}
            {language && <Meta label="Language" value={language.toUpperCase()} />}
            {pageCount && <Meta label="Pages" value={pageCount} />}
            {industryIdentifiers?.length > 0 && (
              <Meta
                label="Identifiers"
                value={industryIdentifiers.map(id => `${id.type}: ${id.identifier}`).join(", ")}
              />
            )}
            {previewLink && (
              <Meta
                label="Preview"
                value={<a href={previewLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Books</a>}
              />
            )}
          </div>
        </div>
      </div>

      {/* Seller Dialog */}
      {sellerInfo && (
        <Dialog open={showSeller} onOpenChange={setShowSeller}>
          <DialogContent className="bg-black border border-white/10 rounded-2xl shadow-2xl max-w-sm sm:max-w-2xl w-[90vw] h-[90vh] overflow-y-auto z-[9999] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
            <DialogHeader className="relative pb-2">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white tracking-wide pr-10">
                {sellerInfo.storeName}
              </DialogTitle>
              <Button
                onClick={() => setShowSeller(false)}
                variant="ghost"
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
              >
                <FaTimes size={16} />
              </Button>
            </DialogHeader>

            <div className="flex justify-center mt-4 mb-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur opacity-20"></div>
                <img
                  src={sellerInfo.image}
                  alt={sellerInfo.storeName}
                  loading="lazy"
                  className="relative w-24 sm:w-28 h-24 sm:h-28 object-cover rounded-full border-4 border-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-white text-sm px-1">
              <InfoCard title="Seller Name" content={sellerInfo.name} />
              <InfoCard title="Email" content={sellerInfo.email} />
              <InfoCard title="UPI ID" content={sellerInfo.upiId} />
              <InfoCard title="Store Description" content={sellerInfo.storeDescription} />
              <InfoCard
                title="Location"
                content={`${sellerInfo.address.street}, ${sellerInfo.address.city}, ${sellerInfo.address.state}, ${sellerInfo.address.zipCode}`}
              />
            </div>

            <div className="flex justify-center mt-5 gap-6">
              <SocialMediaIcon
                href={sellerInfo.socialMediaLinks.facebook}
                icon={<FaFacebookF size={18} />}
                color="text-blue-500 hover:text-blue-400"
              />
              <SocialMediaIcon
                href={sellerInfo.socialMediaLinks.instagram}
                icon={<FaInstagram size={18} />}
                color="text-pink-500 hover:text-pink-400"
              />
              <SocialMediaIcon
                href={sellerInfo.socialMediaLinks.linkedin}
                icon={<FaLinkedin size={18} />}
                color="text-blue-400 hover:text-blue-300"
              />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => alert(`Contacting ${sellerInfo.name}`)}
                className="w-32 mt-5 bg-white text-black hover:bg-gray-200 py-2 rounded-xl text-sm"
              >
                Contact Seller
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showSeller && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          onClick={() => setShowSeller(false)}
        />
      )}
    </div>
  );
};

const Meta = ({ label, value }) => (
  <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700 text-sm">
    <p className="font-semibold text-blue-400 mb-1">{label}</p>
    <p className="text-gray-300 break-words">{value || "Not available"}</p>
  </div>
);

const InfoCard = ({ title, content }) => (
  <div className="bg-[#1a1333]/60 p-4 rounded-xl border border-[#2e2948] shadow-inner">
    <p className="text-gray-300">
      <span className="font-semibold text-sky-400">{title}:</span> {content}
    </p>
  </div>
);

const SocialMediaIcon = ({ href, icon, color }) => (
  <motion.a
    whileHover={{ scale: 1.2, rotate: 10 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${color} transition-colors duration-300`}
  >
    {icon}
  </motion.a>
);

export default BookDetailsMain;
