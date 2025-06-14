import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Common
import CheckAuth from "./common/checkAuth";

// Lazy-loaded components
const AuthLayout = lazy(() => import("./pages/auth/authLayout"));
const AuthLogin = lazy(() => import("./components/auth/user/login"));
const AuthRegisters = lazy(() => import("./components/auth/user/register"));
const AdminLogin = lazy(() => import("./components/auth/admin/adminLogin"));
const SellerLogin = lazy(() => import("./components/auth/seller/sellerLogin"));
const SellerRegister = lazy(() => import("./components/auth/seller/sellerRegister"));

const AdminLayout = lazy(() => import("./pages/adminDashboard/adminLayout"));
const AdminHome = lazy(() => import('./components/adminDashboard/AdminHome'));
const BooksList = lazy(() => import('./components/adminDashboard/BooksList'));
const UsersList = lazy(() => import('./components/adminDashboard/UsersList'));
const SellersList = lazy(() => import('./components/adminDashboard/SellersList'));
const ManagementList = lazy(() => import('./components/adminDashboard/ManagementList'));
const AdminSales = lazy(() => import('./components/adminDashboard/AdminSales'));

const SellerLayout = lazy(() => import("./pages/sellerDashboard/sellerLayout"));
const SellerHome = lazy(() => import("./components/sellerDashboard/SellerHome"));
const SellerBooksList = lazy(() => import("./components/sellerDashboard/SellerBooksList"));
const AddBook = lazy(() => import("./components/sellerDashboard/AddBook"));
const SellerAccount = lazy(() => import("./components/sellerDashboard/SellerAccount"));
const SellerOrders = lazy(() => import("./components/sellerDashboard/SellerOrders"));

const ShoppingLayout = lazy(() => import("./components/shopping-view/layout"));
const ShoppingHome = lazy(() => import("./pages/shopping-view/ShopHome"));
const ShopListing = lazy(() => import("./components/shopping-view/ShopListing"));
const BookDetails = lazy(() => import("./components/shopping-view/BookDetails"));
const PlaceOrder = lazy(() => import("./components/shopping-view/PlaceOrder"));

const UserLayout = lazy(() => import("./pages/userDashboard/UserLayout"));
const UserHome = lazy(() => import("./components/userDashboard/UserHome"));

const Format = lazy(() => import("./common/Format"));
const Landing = lazy(() => import("./pages/landingPage/Landing"));
const UnauthPage = lazy(() => import("./pages/unauth/Unauth"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));

const Team = lazy(() => import("./pages/Team"));
const About = lazy(() => import("./pages/About"));

import Loader from "@/components/Loader";

function App() {

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* for lazy loading  and*/}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Base */}
          <Route path='/' element={<Format />} >
            <Route index element={<Landing />} />
            <Route path="team" element={<Team />} />
            <Route path="about" element={<About />} />
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
            <Route path="add-book" element={<AddBook />} />
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
          </Route>

          {/* Unauth & Notfound */}
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div >
  );
}

export default App;