import { Outlet } from "react-router-dom";
import ShoppingHeader from "@/components/store-view/ShopHeader.jsx";
import { Footer } from "@/components/landingPage/Footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-[#060606] text-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
