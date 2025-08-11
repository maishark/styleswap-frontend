import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { ProductList } from "./components/ProductList";
import { ProductDetails }  from "./components/ProductDetails";
import ResetPassword from './components/ResetPassword';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ClosetSwap from './components/ClosetSwap'; 
import PaymentPage from './components/PaymentPage';
import AdminDashboard from "./pages/AdminDashboard";
import AdminPrivateRoute from "./pages/AdminPrivateRoute"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>

          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
            />


          <Route
            path="/admin/dashboard"
            element={
              <AdminPrivateRoute>
                <AdminDashboard />
              </AdminPrivateRoute>
            }
            />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/closet-swap/:ownerId"
            element={
              <ProtectedRoute>
                <ClosetSwap />
              </ProtectedRoute>
            }
          />

        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
