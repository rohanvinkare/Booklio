import { useLocation } from "react-router-dom";
import PlaceOrderLeft from "@/components/store-view/palceOrder/PlaceOrderLeft";
import PlaceOrderForm from "@/components/store-view/palceOrder/PlaceOrderForm";

const PlaceOrder = () => {
    const location = useLocation();
    const {
        sellerUniqueId,
        isbnId,
        book,
        price,
        stock,
        sellerInfo,
    } = location.state || {};

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0b1e] to-black text-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 🔮 Aurora Header */}
                <div className="text-center mb-12 pt-20">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-sm">
                        Complete Your Order
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mt-4 shadow-md" />
                </div>

                {/* 📚 Order Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT: Book Summary */}
                    <PlaceOrderLeft book={book} price={price} stock={stock} />

                    {/* RIGHT: Shipping Form */}
                    <PlaceOrderForm
                        book={book}
                        price={price}
                        stock={stock}
                        sellerInfo={sellerInfo}
                        sellerUniqueId={sellerUniqueId}
                        isbnId={isbnId}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
