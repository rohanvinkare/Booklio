import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserHome = () => {
  const userData = useOutletContext();

  return (
    <div className="container mx-auto mt-10 px-4">
      <Card className="max-w-2xl mx-auto bg-white text-gray-900 shadow-2xl rounded-lg overflow-hidden">
        <CardHeader className="border-b border-slate-300">
          <CardTitle className="text-3xl font-bold text-center py-4 text-slate-900">
            My Account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <Avatar className="w-28 h-28 border-4 border-slate-300 shadow-lg">
              <AvatarFallback className="bg-slate-300 text-3xl font-bold text-slate-800">
                {userData.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between border-b border-slate-300 pb-3">
              <p className="uppercase text-sm text-slate-500">Name</p>
              <p className="text-lg font-semibold text-slate-700">
                {userData.name}
              </p>
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-3">
              <p className="uppercase text-sm text-slate-500">Email</p>
              <p className="text-lg font-semibold text-slate-700">
                {userData.email}
              </p>
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-3">
              <p className="uppercase text-sm text-slate-500">Mobile</p>
              <p className="text-lg font-semibold text-slate-700">
                {userData.mobile || "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserHome;
