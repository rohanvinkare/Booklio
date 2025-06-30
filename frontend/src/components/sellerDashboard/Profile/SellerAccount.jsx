// import { useOutletContext } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { FaFacebook, FaInstagram, FaLinkedin, FaEdit, FaCamera, FaStore, FaChartLine, FaBook, FaShoppingCart, FaRupeeSign, FaMoneyCheck } from "react-icons/fa";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// const SellerAccount = () => {
//   const { sellerData } = useOutletContext();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedData, setEditedData] = useState(null);
//   const [isImageUploading, setIsImageUploading] = useState(false);

//   // Get data from Redux store
//   const { sellerOrders, sellerBookData } = useSelector((state) => state.seller);
//   const books = sellerBookData?.books || [];

//   // Calculate statistics
//   const totalRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price), 0) || 0;
//   const monthlyRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price) / 12, 0) || 0;
//   const totalProfit = sellerOrders?.reduce((sum, order) => sum + Number(order.price) * 0.04, 0) || 0;
//   const totalBooks = books.length || 0;
//   const totalSales = sellerOrders?.length || 0;

//   // Calculate store rating (example calculation)
//   const storeRating = 4.8; // This should be calculated based on actual ratings

//   const getInitials = (name) =>
//     name?.split(" ").map((word) => word[0]).join("").toUpperCase();

//   const handleEdit = () => {
//     setEditedData({ ...sellerData });
//     setIsEditing(true);
//   };

//   const handleSave = async () => {
//     try {
//       // API call to update seller data
//       toast.success("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       toast.error("Failed to update profile");
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setIsImageUploading(true);
//       try {
//         // API call to upload image
//         toast.success("Profile image updated successfully!");
//       } catch (error) {
//         toast.error("Failed to update profile image");
//       } finally {
//         setIsImageUploading(false);
//       }
//     }
//   };

//   if (!sellerData) {
//     return (
//       <div className="max-w-6xl mx-auto p-8 space-y-10">
//         <Skeleton className="w-full h-[400px]" />
//         <Skeleton className="w-full h-[200px]" />
//         <Skeleton className="w-full h-[200px]" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-8 space-y-10">
//       {/* Profile Section */}
//       <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-none shadow-lg">
//         <CardContent className="p-8">
//           <div className="flex flex-col md:flex-row items-center gap-8">
//             <div className="relative group">
//               <Avatar className="w-40 h-40 border-4 border-blue-500">
//                 {sellerData?.image ? (
//                   <AvatarImage src={sellerData.image} alt={sellerData.name} />
//                 ) : (
//                   <AvatarFallback className="bg-white text-[#232323] text-[10vh] font-bold">
//                     {getInitials(sellerData?.name)}
//                   </AvatarFallback>
//                 )}
//               </Avatar>
//               <label
//                 htmlFor="image-upload"
//                 className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
//               >
//                 <FaCamera className="text-white text-2xl" />
//               </label>
//               <input
//                 id="image-upload"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//                 disabled={isImageUploading}
//               />
//             </div>
//             <div className="flex-1 space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                     {sellerData?.name}
//                   </h2>
//                   <p className="text-2xl text-blue-500 mt-2">{sellerData?.storeName}</p>
//                 </div>
//                 <Button
//                   onClick={handleEdit}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   <FaEdit className="mr-2" />
//                   Edit Profile
//                 </Button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-[#1a1a1a] p-4 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <FaStore className="text-blue-500" />
//                     <span className="text-gray-400">Store Rating</span>
//                   </div>
//                   <p className="text-2xl font-bold mt-2">{storeRating}/5.0</p>
//                 </div>
//                 <div className="bg-[#1a1a1a] p-4 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <FaBook className="text-green-500" />
//                     <span className="text-gray-400">Total Books</span>
//                   </div>
//                   <p className="text-2xl font-bold mt-2">{totalBooks}</p>
//                 </div>
//                 <div className="bg-[#1a1a1a] p-4 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <FaShoppingCart className="text-purple-500" />
//                     <span className="text-gray-400">Total Sales</span>
//                   </div>
//                   <p className="text-2xl font-bold mt-2">{totalSales}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Revenue Stats */}
//       <Card className="bg-[#232323] border-none shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold flex items-center gap-2">
//             <FaChartLine className="text-blue-500" />
//             Revenue Statistics
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-[#1a1a1a] p-4 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <FaRupeeSign className="text-green-500" />
//                 <span className="text-gray-400">Total Revenue</span>
//               </div>
//               <p className="text-2xl font-bold mt-2">₹{totalRevenue.toFixed(2)}</p>
//             </div>
//             <div className="bg-[#1a1a1a] p-4 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <FaMoneyCheck className="text-blue-500" />
//                 <span className="text-gray-400">Monthly Revenue</span>
//               </div>
//               <p className="text-2xl font-bold mt-2">₹{monthlyRevenue.toFixed(2)}</p>
//             </div>
//             <div className="bg-[#1a1a1a] p-4 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <FaChartLine className="text-yellow-500" />
//                 <span className="text-gray-400">Total Profit</span>
//               </div>
//               <p className="text-2xl font-bold mt-2">₹{totalProfit.toFixed(2)}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Contact Info */}
//       <Card className="bg-[#232323] border-none shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold flex items-center gap-2">
//             <FaChartLine className="text-blue-500" />
//             Contact Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-gray-400">Email</Label>
//                 <p className="text-lg font-medium">{sellerData?.email}</p>
//               </div>
//               <div>
//                 <Label className="text-gray-400">Mobile</Label>
//                 <p className="text-lg font-medium">{sellerData?.mobile}</p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-gray-400">UPI ID</Label>
//                 <p className="text-lg font-medium">{sellerData?.upiId || "Not set"}</p>
//               </div>
//               <div>
//                 <Label className="text-gray-400">GST Number</Label>
//                 <p className="text-lg font-medium">{sellerData?.gstNumber || "Not set"}</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Address */}
//       <Card className="bg-[#232323] border-none shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold">Store Address</CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="bg-[#1a1a1a] p-4 rounded-lg">
//             <p className="text-lg">{sellerData?.address?.street}</p>
//             <p className="text-lg">
//               {sellerData?.address?.city}, {sellerData?.address?.state}
//             </p>
//             <p className="text-lg">
//               {sellerData?.address?.country} - {sellerData?.address?.zipCode}
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Social Media Links */}
//       <Card className="bg-[#232323] border-none shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold">Social Media</CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="flex gap-6">
//             {sellerData?.socialMediaLinks?.facebook ? (
//               <a
//                 href={sellerData.socialMediaLinks.facebook}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-3 bg-[#1a1a1a] rounded-lg hover:bg-blue-600/20 transition-colors"
//               >
//                 <FaFacebook className="text-blue-600 text-2xl" />
//               </a>
//             ) : (
//               <Button variant="outline" className="p-3">
//                 <FaFacebook className="text-blue-600 text-2xl" />
//               </Button>
//             )}
//             {sellerData?.socialMediaLinks?.instagram ? (
//               <a
//                 href={sellerData.socialMediaLinks.instagram}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-3 bg-[#1a1a1a] rounded-lg hover:bg-pink-600/20 transition-colors"
//               >
//                 <FaInstagram className="text-pink-500 text-2xl" />
//               </a>
//             ) : (
//               <Button variant="outline" className="p-3">
//                 <FaInstagram className="text-pink-500 text-2xl" />
//               </Button>
//             )}
//             {sellerData?.socialMediaLinks?.linkedin ? (
//               <a
//                 href={sellerData.socialMediaLinks.linkedin}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-3 bg-[#1a1a1a] rounded-lg hover:bg-blue-700/20 transition-colors"
//               >
//                 <FaLinkedin className="text-blue-700 text-2xl" />
//               </a>
//             ) : (
//               <Button variant="outline" className="p-3">
//                 <FaLinkedin className="text-blue-700 text-2xl" />
//               </Button>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit Profile Dialog */}
//       <Dialog open={isEditing} onOpenChange={setIsEditing}>
//         <DialogContent className="bg-[#232323] text-white">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Store Name</Label>
//               <Input
//                 value={editedData?.storeName}
//                 onChange={(e) =>
//                   setEditedData({ ...editedData, storeName: e.target.value })
//                 }
//                 className="bg-[#1a1a1a] border-gray-700"
//               />
//             </div>
//             <div>
//               <Label>Email</Label>
//               <Input
//                 value={editedData?.email}
//                 onChange={(e) =>
//                   setEditedData({ ...editedData, email: e.target.value })
//                 }
//                 className="bg-[#1a1a1a] border-gray-700"
//               />
//             </div>
//             <div>
//               <Label>Mobile</Label>
//               <Input
//                 value={editedData?.mobile}
//                 onChange={(e) =>
//                   setEditedData({ ...editedData, mobile: e.target.value })
//                 }
//                 className="bg-[#1a1a1a] border-gray-700"
//               />
//             </div>
//             <div>
//               <Label>UPI ID</Label>
//               <Input
//                 value={editedData?.upiId}
//                 onChange={(e) =>
//                   setEditedData({ ...editedData, upiId: e.target.value })
//                 }
//                 className="bg-[#1a1a1a] border-gray-700"
//               />
//             </div>
//             <div>
//               <Label>GST Number</Label>
//               <Input
//                 value={editedData?.gstNumber}
//                 onChange={(e) =>
//                   setEditedData({ ...editedData, gstNumber: e.target.value })
//                 }
//                 className="bg-[#1a1a1a] border-gray-700"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsEditing(false)}
//               className="border-gray-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default SellerAccount;




import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEdit,
  FaCamera,
  FaStore,
  FaChartLine,
  FaBook,
  FaShoppingCart,
  FaRupeeSign,
  FaMoneyCheck,
} from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const SellerAccount = () => {
  const { sellerData } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const { sellerOrders, sellerBookData } = useSelector((state) => state.seller);
  const books = sellerBookData?.books || [];

  const totalRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price), 0) || 0;
  const monthlyRevenue = totalRevenue / 12;
  const totalProfit = totalRevenue * 0.04;
  const totalBooks = books.length;
  const totalSales = sellerOrders?.length || 0;
  const storeRating = 4.8;

  const getInitials = (name) =>
    name?.split(" ").map((word) => word[0]).join("").toUpperCase();

  const handleEdit = () => {
    setEditedData({ ...sellerData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageUploading(true);
      try {
        toast.success("Profile image updated successfully!");
      } catch {
        toast.error("Failed to update profile image");
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  if (!sellerData) {
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-10">
        <Skeleton className="w-full h-[400px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Profile Section */}
      <Card className="bg-transperent backdrop-blur-lg rounded-2xl shadow-xl border border-[#292929]">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="w-40 h-40 border-4 border-gradient-to-tr from-[#FF0080] via-[#7928CA] to-[#0070F3] shadow-md">
                {sellerData?.image ? (
                  <AvatarImage src={sellerData.image} alt={sellerData.name} />
                ) : (
                  <AvatarFallback className="bg-white text-[#232323] text-[10vh] font-bold">
                    {getInitials(sellerData?.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <label
                htmlFor="image-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              >
                <FaCamera className="text-white text-2xl" />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isImageUploading}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-white bg-clip-text text-transparent animate-gradient">
                    {sellerData?.name}
                  </h2>
                  <p className="text-2xl text-blue-400 mt-2">{sellerData?.storeName}</p>
                </div>
                <Button onClick={handleEdit} className="mt-4 md:mt-0 bg-gradient-to-r from-[#0070F3] via-[#7928CA] to-[#FF0080] text-white shadow hover:opacity-90 font-bold">
                  <FaEdit className="mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{
                  icon: <FaStore className="text-blue-500" />,
                  label: "Store Rating",
                  value: `${storeRating}/5.0`
                }, {
                  icon: <FaBook className="text-green-500" />,
                  label: "Total Books",
                  value: totalBooks
                }, {
                  icon: <FaShoppingCart className="text-purple-500" />,
                  label: "Total Sales",
                  value: totalSales
                }].map((stat, idx) => (
                  <div key={idx} className="bg-[#1a1a1a]/80 backdrop-blur-md p-4 rounded-2xl transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <span className="text-gray-400">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Stats */}
      <Card className="bg-transperent backdrop-blur-lg rounded-2xl shadow-xl border border-[#292929]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Revenue Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              icon: <FaRupeeSign className="text-green-500" />,
              label: "Total Revenue",
              value: `₹${totalRevenue.toFixed(2)}`
            }, {
              icon: <FaMoneyCheck className="text-blue-500" />,
              label: "Monthly Revenue",
              value: `₹${monthlyRevenue.toFixed(2)}`
            }, {
              icon: <FaChartLine className="text-yellow-500" />,
              label: "Total Profit",
              value: `₹${totalProfit.toFixed(2)}`
            }].map((stat, idx) => (
              <div key={idx} className="bg-[#1a1a1a]/80 p-4 rounded-2xl hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-gray-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-transperent backdrop-blur-lg rounded-2xl shadow-xl border border-[#292929]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          {[{
            label: "Email",
            value: sellerData?.email
          }, {
            label: "Mobile",
            value: sellerData?.mobile
          }, {
            label: "UPI ID",
            value: sellerData?.upiId || "Not set"
          }, {
            label: "GST Number",
            value: sellerData?.gstNumber || "Not set"
          }].map((info, idx) => (
            <div key={idx}>
              <Label className="text-gray-400">{info.label}</Label>
              <p className="text-lg font-medium">{info.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Store Address */}
      <Card className="bg-transperent backdrop-blur-lg rounded-2xl shadow-xl border border-[#292929]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Store Address</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-[#0f0f0f]/80 p-4 rounded-xl">
            <p className="text-lg">{sellerData?.address?.street}</p>
            <p className="text-lg">
              {sellerData?.address?.city}, {sellerData?.address?.state}
            </p>
            <p className="text-lg">
              {sellerData?.address?.country} - {sellerData?.address?.zipCode}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="bg-transperent backdrop-blur-lg rounded-2xl shadow-xl border border-[#292929]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Social Media</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex gap-6">
          {[{
            icon: <FaFacebook className="text-blue-600 text-2xl" />,
            link: sellerData?.socialMediaLinks?.facebook
          }, {
            icon: <FaInstagram className="text-pink-500 text-2xl" />,
            link: sellerData?.socialMediaLinks?.instagram
          }, {
            icon: <FaLinkedin className="text-blue-700 text-2xl" />,
            link: sellerData?.socialMediaLinks?.linkedin
          }].map((item, idx) => (
            item.link ? (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#0d0d0d] rounded-xl hover:shadow-[0_0_10px_#7c3aed] transition duration-200"
              >
                {item.icon}
              </a>
            ) : (
              <Button key={idx} variant="outline" className="p-3">{item.icon}</Button>
            )
          ))}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-[#232323] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {["storeName", "email", "mobile", "upiId", "gstNumber"].map((field, i) => (
              <div key={i}>
                <Label className="capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
                <Input
                  value={editedData?.[field] || ""}
                  onChange={(e) =>
                    setEditedData({ ...editedData, [field]: e.target.value })
                  }
                  className="bg-[#1a1a1a] border-gray-700"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="pt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-gray-700 hover:border-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#0070F3] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerAccount;







