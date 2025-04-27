import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const SellerAccount = () => {
  const { sellerData } = useOutletContext();

  const getInitials = (name) =>
    name?.split(" ").map((word) => word[0]).join("").toUpperCase();

  if (!sellerData) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      {/* Profile Section */}
      <Card>
        <CardContent className="p-6 flex justify-start items-center gap-20">
          <Avatar className="w-40 h-40">
            {sellerData?.image ? (
              <AvatarImage src={sellerData.image} alt={sellerData.name} />
            ) : (
              <AvatarFallback className="bg-white text-[#232323] text-[10vh] font-bold">
                {getInitials(sellerData?.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col gap-2 justify-around">
            <h2 className="text-5xl font-helvetica-neue font-semibold">{sellerData?.name}</h2>
            <p className="text-4xl text-blue-500">{sellerData?.storeName}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Contact Info</h3>
          <p>📧 Email: {sellerData?.email}</p>
          <p>📞 Mobile: {sellerData?.mobile}</p>
          <p>💳 UPI ID: {sellerData?.upiId || "N/A"}</p>
          <p>🧾 GST Number: {sellerData?.gstNumber || "N/A"}</p>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h3 className="text-lg font-semibold">Address</h3>
          <p>{sellerData?.address?.street}</p>
          <p>
            {sellerData?.address?.city}, {sellerData?.address?.state}
          </p>
          <p>
            {sellerData?.address?.country} - {sellerData?.address?.zipCode}
          </p>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardContent className="p-6 flex space-x-4">
          {sellerData?.socialMediaLinks?.facebook && (
            <a href={sellerData.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-blue-600 text-2xl" />
            </a>
          )}
          {sellerData?.socialMediaLinks?.instagram && (
            <a href={sellerData.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-pink-500 text-2xl" />
            </a>
          )}
          {sellerData?.socialMediaLinks?.linkedin && (
            <a href={sellerData.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-blue-700 text-2xl" />
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAccount;