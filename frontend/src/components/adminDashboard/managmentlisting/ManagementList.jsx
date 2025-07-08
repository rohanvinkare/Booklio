import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchData } from "@/store/adminSlice/managementData"; // ✅ CORRECT IMPORT
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

// 🔵 Helper: Generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const capitalize = (word) => word?.toUpperCase();

const ManagementList = () => {
  const dispatch = useDispatch();

  // ✅ Use Redux data
  const members = useSelector((state) => state.adminManagementsData.value);

  useEffect(() => {
    // ⛔️ Only fetch if data is missing
    if (!members || members.length === 0) {
      dispatch(fetchBatchData());
    }
  }, [dispatch, members]);

  // 🟡 Empty State UI
  if (!members || members.length === 0) {
    return (
      <div className="text-center p-8 text-xl text-gray-300">
        No Management Members Found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {members.map((member) => {
        const { name, email, role, mobile, _id } = member;
        const backgroundColor = getRandomColor();
        const firstLetter = name?.charAt(0).toUpperCase() || 'U';

        return (
          <Card
            key={_id}
            className="transition-transform duration-300 transform shadow-lg rounded-xl overflow-hidden w-full md:w-72 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:shadow-gray-700/50 hover:-translate-y-1"
          >
            <CardHeader className="relative flex justify-center items-center p-4">
              <Avatar
                style={{ backgroundColor }}
                size="lg"
                className="h-36 w-36 font-gloock flex items-center justify-center text-white text-6xl font-semibold ring-2 ring-gray-700"
              >
                {firstLetter}
              </Avatar>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-bold text-gray-100">{name}</h2>
              <p className="text-sm font-semibold text-gray-300">{capitalize(role)}</p>
              <p className="text-sm text-gray-400">{email}</p>
              <span className="text-sm text-gray-400">
                Mobile: <span className="text-gray-300">{mobile}</span>
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ManagementList;
