import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
const API_BASE_URL = process.env.VITE_API_URL;
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart/$${user._id}`);
      setCart(response.data.cart || { products: [] });
    } catch (error) {
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.post('${API_BASE_URL}/api/cart/update', {
        userId: user._id,
        productId,
        quantity
      });
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post('${API_BASE_URL}/api/cart/remove', {
        userId: user._id,
        productId
      });
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await axios.post('${API_BASE_URL}/api/cart/clear', {
        userId: user._id
      });
      fetchCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const placeOrder = async () => {
    if (cart.products.length === 0) {
      toast.error('Cart is empty');
      return;
    }
  
    try {
      for (const item of cart.products) {
        await axios.post('${API_BASE_URL}/api/orders/place-order', {
          userId: user._id,
          product: item.productId._id,
          owner: item.productId.ownerId?._id || item.productId.ownerId,
          duration: parseInt(item.productId.duration?.toString().split(" ")[0]) || 7, // fallback to 7
        });
      }
  
      toast.success('Order(s) placed successfully!');
      navigate('/payment', { state: { total } });
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error.response?.data || error.message);
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

  const total = cart.products?.reduce((sum, item) => {
    return sum + (item.productId.price * item.quantity);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              {cart.products?.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cart.products?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.products?.map((item) => (
                    <div key={item.productId._id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{item.productId.name}</h3>
                          <p className="text-gray-500">৳{item.productId.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId._id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-900">Total: ৳{total}</p>
                  <button
                    onClick={placeOrder}
                    className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;