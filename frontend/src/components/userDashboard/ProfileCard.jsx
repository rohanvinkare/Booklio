import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, ShieldX, Mail, Phone, MapPin } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

const ProfileCard = ({ userData, address }) => {
    return (
        <div className="relative w-full max-w-md mx-auto px-2 sm:px-4">
            <div className="relative overflow-hidden rounded-xl">
                <Card className="bg-[#060606]/80 border-blue-950/60 w-full h-full">
                    <CardContent className="p-4 sm:p-6 m-2 sm:m-3">
                        <div className="flex flex-col items-center">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-blue-500 shadow-lg">
                                <AvatarImage src={userData.image} alt={userData.name} />
                                <AvatarFallback className="bg-blue-500 text-xl">
                                    {userData.name?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white">{userData.name}</h2>
                            <div className="mt-1 sm:mt-2 flex items-center">
                                {userData.is_verified ? (
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                                ) : (
                                    <ShieldX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2" />
                                )}
                                <span className={`text-xs sm:text-sm ${userData.is_verified ? "text-green-400" : "text-red-400"}`}>
                                    {userData.is_verified ? "Verified Account" : "Not Verified"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
                            <div className="flex items-center text-gray-300">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-600 drop-shadow-[0_0_6px_#3b82f6]" />
                                <span className="text-xs sm:text-sm text-white">{userData.email}</span>
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-500 drop-shadow-[0_0_6px_#22c55e]" />
                                <span className="text-xs sm:text-sm text-white">{userData.mobile}</span>
                            </div>
                            <div className="flex items-center text-gray-300">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-red-700 drop-shadow-[0_0_6px_#ec4899] flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-white">{address}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="absolute inset-0 pointer-events-none">
                    <BorderBeam
                        size={100}
                        duration={8}
                        colorFrom="#40ffaa"
                        colorTo="#4079ff"
                        className="rounded-xl w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;