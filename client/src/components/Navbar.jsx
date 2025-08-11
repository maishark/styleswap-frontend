import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingCart, Heart, Shield } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin === true;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/40 border border-white/30 shadow-lg z-30">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
          {/* Logo/Home */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            StyleSwap
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* ✅ Admin sees Admin Dashboard only */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <Shield className="w-5 h-5 mr-1" />
                    Admin Dashboard
                  </Link>
                )}

                {/* ✅ Normal users see Cart/Wishlist/Profile */}
                {!isAdmin && (
                  <>
                    <Link
                      to="/cart"
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <ShoppingCart className="w-5 h-5 mr-1" />
                      Cart
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <Heart className="w-5 h-5 mr-1" />
                      Wishlist
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <User className="w-5 h-5 mr-1" />
                      Profile
                    </Link>
                  </>
                )}

                {/* Common Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
