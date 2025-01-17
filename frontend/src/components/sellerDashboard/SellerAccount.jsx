import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar"; // ShadCN Avatar for profile picture
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const SellerAccount = () => {
  const { sellerData } = useOutletContext(); // Access nested sellerData

  // Function to extract initials from the name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const capitalize = (word) => {
    return word?.toUpperCase();
  };

  // If seller data is not provided, show a loading or fallback message
  if (!sellerData) {
    return (
      <div className="text-center p-8 text-2xl font-semibold text-slate-700">
        Loading seller data...
      </div>
    );
  }

  return (
    <Card className="shadow-2xl rounded-xl bg-white p-8 max-w-4xl w-full mx-auto">
      <CardHeader className="flex items-center space-x-6">
        {/* Avatar or initials */}
        <div className="flex justify-center items-center gap-20">
          <Avatar className="w-32 h-32 bg-black text-4xl font-bold text-white shadow-lg flex items-center justify-center">
            {sellerData?.image ? (
              <img
                src={sellerData.image}
                alt={sellerData.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl">{getInitials(sellerData?.name)}</span>
            )}
          </Avatar>

          {/* Seller Info */}
          <div className="space-y-2 ">
            <h2 className="text-slate-900">
              <span className="font-medium font-mono text-xl">SELLER: </span>
              <span className="text-2xl font-sans-serif ">{capitalize(sellerData?.name)}</span>
            </h2>
            <h2 className="text-slate-900">
              <span className="font-medium font-mono text-xl">STORE: </span>
              <span className="text-2xl font-sans-serif">{capitalize(sellerData?.storeName)}</span>
            </h2>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex w-full md:flex-row justify-center items-center gap-8 mt-6">
        {/* Contact Information */}
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-slate-800 mb-2">Contact Information</h4>
          <p className="text-slate-600">📧 <span className="font-semibold">Email:</span> {sellerData?.email}</p>
          <p className="text-slate-600">📞 <span className="font-semibold">Mobile:</span> {sellerData?.mobile}</p>
          <p className="text-slate-600">💳 <span className="font-semibold">UPI ID:</span> {sellerData?.upiId || "N/A"}</p>
          <p className="text-slate-600">🧾 <span className="font-semibold">GST Number:</span> {sellerData?.gstNumber || "N/A"}</p>
        </div>

        {/* Address */}
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-slate-800 mb-2">Address</h4>
          <p className="text-slate-600">{sellerData?.address.street}</p>
          <p className="text-slate-600">
            {sellerData.address.city}, {sellerData?.address.state}
          </p>
          <p className="text-slate-600">
            {sellerData.address.country} - {sellerData?.address.zipCode}
          </p>
        </div>
      </CardContent>

      {/* Social Media Links */}
      <CardFooter className="flex space-x-6 justify-center mt-6">
        {sellerData.socialMediaLinks?.facebook && (
          <a
            href={sellerData.socialMediaLinks.facebook}
            target="_blank"
            className="text-white"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="p-3 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
            >
              <FaFacebookF size={20} />
            </Button>
          </a>
        )}
        {sellerData.socialMediaLinks?.instagram && (
          <a
            href={sellerData.socialMediaLinks.instagram}
            target="_blank"
            className="text-white"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="p-3 rounded-full hover:bg-pink-500 hover:text-white transition duration-300"
            >
              <FaInstagram size={20} />
            </Button>
          </a>
        )}
        {sellerData.socialMediaLinks?.linkedin && (
          <a
            href={sellerData.socialMediaLinks.linkedin}
            target="_blank"
            className="text-white"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="p-3 rounded-full hover:bg-blue-700 hover:text-white transition duration-300"
            >
              <FaLinkedinIn size={20} />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default SellerAccount;
