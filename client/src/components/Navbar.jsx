import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingCart, Heart, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin === true;
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle

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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <Shield className="w-5 h-5 mr-1" />
                    Admin Dashboard
                  </Link>
                ) : (
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
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-indigo-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white/90 backdrop-blur-lg border-t border-white/30">
          {user ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="block text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/cart"
                    className="block text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-700 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
