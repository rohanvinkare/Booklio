import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Common
import CheckAuth from "./common/checkAuth";
import Loader from "@/components/Loader";

// Lazy imports
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

const ShoppingHome = lazy(() => import("./pages/store-view/ShopHome"));
const ShoppingLayout = lazy(() => import("./pages/shopingLayout/layout.jsx"));
const ShopListing = lazy(() => import("./pages/shopListing/ShopListing.jsx"));
const BookDetails = lazy(() => import("./components/store-view/BookDetails"));
const PlaceOrder = lazy(() => import("./components/store-view/palceOrder/PlaceOrder"));

const UserLayout = lazy(() => import("./pages/userDashboard/UserLayout"));
const UserHome = lazy(() => import("./components/userDashboard/UserHome"));

const Format = lazy(() => import("./common/Format"));
const Landing = lazy(() => import("./pages/landingPage/Landing"));
const UnauthPage = lazy(() => import("./pages/unauth/Unauth"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));
const About = lazy(() => import("./pages/About"));
const ProfileHero = lazy(() => import("@/pages/ProfileHero.jsx"));

// 🔷 Preload (optional but powerful)
const preloadSellerLogin = () => import("./components/auth/seller/sellerLogin");
const preloadUserHome = () => import("./components/userDashboard/UserHome");

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <Routes>
        {/* Base Layout */}
        <Route path="/" element={<Suspense fallback={<Loader />}><Format /></Suspense>}>
          <Route index element={<Suspense fallback={<Loader />}><Landing /></Suspense>} />
          <Route path="about" element={<Suspense fallback={<Loader />}><About /></Suspense>} />
          <Route path="team" element={<Suspense fallback={<Loader />}><ProfileHero /></Suspense>} />
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<Suspense fallback={<Loader />}><AuthLayout /></Suspense>}>
          <Route path="login" element={<Suspense fallback={<Loader />}><AuthLogin /></Suspense>} />
          <Route path="register" element={<Suspense fallback={<Loader />}><AuthRegisters /></Suspense>} />
          <Route path="admin/login" element={<Suspense fallback={<Loader />}><AdminLogin /></Suspense>} />
          <Route
            path="seller/login"
            element={
              <div onMouseEnter={preloadSellerLogin}>
                <Suspense fallback={<Loader />}><SellerLogin /></Suspense>
              </div>
            }
          />
          <Route path="seller/register" element={<Suspense fallback={<Loader />}><SellerRegister /></Suspense>} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={<CheckAuth allowedRoles={["admin"]}><Suspense fallback={<Loader />}><AdminLayout /></Suspense></CheckAuth>}
        >
          <Route index element={<Suspense fallback={<Loader />}><AdminHome /></Suspense>} />
          <Route path="sales" element={<Suspense fallback={<Loader />}><AdminSales /></Suspense>} />
          <Route path="books" element={<Suspense fallback={<Loader />}><BooksList /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<Loader />}><UsersList /></Suspense>} />
          <Route path="sellers" element={<Suspense fallback={<Loader />}><SellersList /></Suspense>} />
          <Route path="management" element={<Suspense fallback={<Loader />}><ManagementList /></Suspense>} />
        </Route>

        {/* Shop */}
        <Route
          path="/shop"
          element={<CheckAuth allowedRoles={["user"]}><Suspense fallback={<Loader />}><ShoppingLayout /></Suspense></CheckAuth>}
        >
          <Route index element={<Suspense fallback={<Loader />}><ShoppingHome /></Suspense>} />
        </Route>

        <Route
          path="/shop/listing"
          element={
            <CheckAuth allowedRoles={["user"]}>
              <Suspense fallback={<Loader />}>
                <ShopListing />
              </Suspense>
            </CheckAuth>
          }
        />



        {/* Book details */}
        <Route path="/seller/:sellerId/isbn/:isbn" element={<Suspense fallback={<Loader />}><ShoppingLayout /></Suspense>}>
          <Route index element={<Suspense fallback={<Loader />}><BookDetails /></Suspense>} />
        </Route>

        {/* Place Order */}
        <Route path="placeOrder" element={<Suspense fallback={<Loader />}><ShoppingLayout /></Suspense>}>
          <Route index element={<Suspense fallback={<Loader />}><PlaceOrder /></Suspense>} />
        </Route>

        {/* Seller Dashboard */}
        <Route
          path="/seller"
          element={<CheckAuth allowedRoles={["seller"]}><Suspense fallback={<Loader />}><SellerLayout /></Suspense></CheckAuth>}
        >
          <Route index element={<Suspense fallback={<Loader />}><SellerHome /></Suspense>} />
          <Route path="books" element={<Suspense fallback={<Loader />}><SellerBooksList /></Suspense>} />
          <Route path="add-book" element={<Suspense fallback={<Loader />}><AddBook /></Suspense>} />
          <Route path="Orders" element={<Suspense fallback={<Loader />}><SellerOrders /></Suspense>} />
          <Route path="Account" element={<Suspense fallback={<Loader />}><SellerAccount /></Suspense>} />
        </Route>

        {/* User Dashboard */}
        <Route
          path="/user"
          element={<CheckAuth allowedRoles={["user"]}><Suspense fallback={<Loader />}><UserLayout /></Suspense></CheckAuth>}
        >
          <Route
            index
            element={
              <div onMouseEnter={preloadUserHome}>
                <Suspense fallback={<Loader />}><UserHome /></Suspense>
              </div>
            }
          />
        </Route>

        {/* Misc Pages */}
        <Route path="/unauth-page" element={<Suspense fallback={<Loader />}><UnauthPage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<Loader />}><NotFound /></Suspense>} />
      </Routes>
    </div>
  );
}

export default App;
