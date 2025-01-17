import { Route, Routes } from "react-router-dom";

import AuthLayout from "./pages/auth/authLayout";
import AuthLogin from "./components/auth/user/login";
import AuthRegisters from "./components/auth/user/register";
import AdminLogin from "./components/auth/admin/adminLogin";
import SellerLogin from "./components/auth/seller/sellerLogin";
import SellerRegister from "./components/auth/seller/sellerRegister";

import AdminLayout from "./pages/adminDashboard/adminLayout";
import AdminHome from './components/adminDashboard/AdminHome'
import BooksList from './components/adminDashboard/BooksList'
import UsersList from './components/adminDashboard/UsersList'
import SellersList from './components/adminDashboard/SellersList'
import ManagementList from './components/adminDashboard/ManagementList'

import SellerHome from "./components/sellerDashboard/SellerHome";
import SellerLayout from "./pages/sellerDashboard/sellerLayout";
import SellerBooksList from "./components/sellerDashboard/SellerBooksList";
import AddBook from "./components/sellerDashboard/AddBook";
import SellerAccount from "./components/sellerDashboard/SellerAccount";

import UnauthPage from "./pages/unauth/Unauth";
import NotFound from "./pages/notFound/NotFound"

import CheckAuth from "./common/checkAuth";

import ShoppingHome from "./pages/shopping-view/ShopHome";
import ShoppingLayout from "./components/shopping-view/layout";
import ShopListing from "./components/shopping-view/ShopListing";
import BookDetails from "./components/shopping-view/BookDetails";
import SellerOrders from "./components/sellerDashboard/SellerOrders";

import Format from "./common/Format";
import Landing from "./pages/landingPage/Landing";
import PlaceOrder from "./components/shopping-view/PlaceOrder";
import UserLayout from "./pages/userDashboard/UserLayout";
import UserHome from "./components/userDashboard/UserHome";
import UserOrders from "./components/userDashboard/userOrders";
import AdminSales from "./components/adminDashboard/AdminSales";

function App() {

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Base */}
        <Route path='/' element={<Format />} >
          <Route index element={<Landing />} />
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegisters />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="seller/login" element={<SellerLogin />} />
          <Route path="seller/register" element={<SellerRegister />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <CheckAuth allowedRoles={["admin"]}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="" element={<AdminHome />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="books" element={<BooksList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="sellers" element={<SellersList />} />
          <Route path="management" element={<ManagementList />} />
        </Route>

        {/* Shop */}
        <Route
          path="/shop"
          element={
            <CheckAuth allowedRoles={["user"]}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path='' element={<ShoppingHome />} />
          <Route path='listing' element={<ShopListing />} />
        </Route>

        {/* Book details */}
        <Route
          path="/seller/:sellerId/isbn/:isbn"
          element={
            <ShoppingLayout />
          }
        >
          <Route index element={<BookDetails />} />
        </Route>

        {/* Place Order */}
        <Route
          path="placeOrder"
          element={
            <ShoppingLayout />
          }
        >
          <Route path="" element={<PlaceOrder />} />
        </Route>

        {/* Seller */}
        <Route
          path="/seller"
          element={
            <CheckAuth allowedRoles={["seller"]}>
              <SellerLayout />
            </CheckAuth>
          }
        >
          <Route path="" element={<SellerHome />} />
          <Route path="books" element={<SellerBooksList />} />
          <Route path="addbook" element={<AddBook />} />
          <Route path="Orders" element={<SellerOrders />} />
          <Route path="Account" element={<SellerAccount />} />
        </Route>


        {/* User */}
        <Route
          path="/user"
          element={
            <CheckAuth allowedRoles={["user"]}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="" element={<UserHome />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        {/* Unauth & Notfound */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div >
  );
}

export default App;