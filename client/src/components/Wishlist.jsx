import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';  // import Link for navigation

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) {
      fetchWishlist();
    } else {
      setLoading(false); 
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist/${user._id}`);
      setWishlist(response.data.wishlist || { items: [] });
    } catch (error) {
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/remove`, {
        userId: user._id,
        productId
      });
      fetchWishlist();
      toast.success('Item removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        userId: user._id,
        productId,
        quantity: 1
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user._id) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 text-center">
        <p className="text-lg text-gray-600 mb-4">You are not logged in.</p>
        <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
          Click here to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h2>

            {wishlist.items?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your wishlist is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.items?.map((item) => (
                  <div key={item.productId._id} className="border rounded-lg overflow-hidden">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{item.productId.name}</h3>
                      <p className="text-gray-500 mt-1">৳{item.productId.price}</p>
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => addToCart(item.productId._id)}
                          className="flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                          <ShoppingCart className="w-5 h-5 mr-1" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.productId._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
