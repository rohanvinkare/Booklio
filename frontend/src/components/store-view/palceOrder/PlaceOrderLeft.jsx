import { Package, CreditCard, MapPin } from "lucide-react";

const PlaceOrderLeft = ({ book, price, stock }) => {
    const { title, imageLinks, authors, pageCount, publisher } = book?.volumeInfo || {};

    return (
        <div className="w-full">
            <div className=" bg-gray-900/50 border border-gray-700/40 backdrop-blur-xl rounded-3xl shadow-xl  sm:rounded-2xl p-4 sm:p-6 md:p-8 ">

                {/* Book Info Row */}
                <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
                    {/* Image */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                        <img
                            src={imageLinks?.thumbnail}
                            alt={title}
                            className="w-32 h-48 rounded-xl object-cover border border-gray-700 shadow-md hover:scale-105 transition-transform"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2 text-white">
                        <h2 className="text-xl font-semibold leading-tight line-clamp-2">{title || "Untitled"}</h2>
                        {authors && <p className="text-sm text-gray-300">by {authors.join(", ")}</p>}
                        {publisher && <p className="text-sm text-gray-400">Publisher: {publisher}</p>}
                        {pageCount && <p className="text-sm text-gray-400">{pageCount} pages</p>}

                        {/* Price + Stock */}
                        <div className="pt-4">
                            {price && <p className="text-xl font-bold text-yellow-400">₹{price.toLocaleString()}</p>}
                            <p className={`text-sm font-medium mt-1 ${stock > 0 ? "text-green-400" : "text-red-500"}`}>
                                {stock > 0 ? `${stock} in stock` : "Out of stock"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature Icons */}
                <div className="pt-4 space-y-4">
                    <InfoRow
                        icon={<Package className="w-5 h-5" />}
                        title="Order Summary"
                        desc="Review book details before checkout"
                    />
                    <InfoRow
                        icon={<CreditCard className="w-5 h-5" />}
                        title="Secure Payment"
                        desc="Transactions are encrypted end-to-end"
                    />
                    <InfoRow
                        icon={<MapPin className="w-5 h-5" />}
                        title="Fast Delivery"
                        desc="Ships across India within 3–5 days"
                    />
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, title, desc }) => (
    <div className="flex items-center gap-4 group">
        <div className="p-3 bg-gradient-to-br from-purple-700/10 to-blue-500/10 rounded-full text-blue-300 group-hover:shadow-[0_0_8px_#7f5af0] transition">
            {icon}
        </div>
        <div>
            <p className="text-white font-medium text-sm sm:text-base">{title}</p>
            <p className="text-gray-400 text-xs sm:text-sm">{desc}</p>
        </div>
    </div>
);

export default PlaceOrderLeft;
