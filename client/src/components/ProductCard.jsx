import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Repeat, MoreVertical } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [isBanned, setIsBanned] = useState(false);
  const isAdmin = user?.isAdmin === true;

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showBanOptions, setShowBanOptions] = useState(false);
  const [showTempOptions, setShowTempOptions] = useState(false);

  const toggleAdminMenu = (e) => {
    e.stopPropagation();
    setShowAdminMenu(!showAdminMenu);
    setShowBanOptions(false);
    setShowTempOptions(false);
  };

  const handleRemovePost = async (e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/remove-post/${product._id}`);
      toast.success("Post removed successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to remove post");
    }
  };

  const handleBanUser = async (duration) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/ban-user`, {
        userId: product?.ownerId?._id || product?.ownerId,
        duration: duration,
        reason: 'Violation via product card'
      });
      toast.success("User banned successfully");
      setShowAdminMenu(false);
    } catch (error) {
      toast.error("Failed to ban user");
    }
  };

  useEffect(() => {
    if (user._id && !isAdmin) {
      const checkBanStatus = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${user._id}`);
          const data = response.data;
          if (data.bannedUntil && new Date(data.bannedUntil) > new Date()) {
            setIsBanned(true);
          }
        } catch (err) {
          console.error('Error checking ban status:', err);
        }
      };
      checkBanStatus();
    }
  }, [user, isAdmin]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        userId: user._id,
        productId: product._id,
        quantity: 1
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (!isWishlisted) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/add`, {
          userId: user._id,
          productId: product._id
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/remove`, {
          userId: user._id,
          productId: product._id
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleClosetSwap = (e) => {
    e.stopPropagation();
    const ownerId = product?.ownerId?._id || product?.ownerId;
    const requestedProductId = product._id;
  
    localStorage.setItem('requestedProductId', requestedProductId);
  
    navigate(`/closet-swap/${ownerId}`);
  };
  

  const isOwner = product?.ownerId?._id === user._id || product?.ownerId === user._id;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-64">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-700">
          {product.condition}
        </div>

        {isAdmin && (
          <div className="absolute top-2 right-10 z-20">
            <button onClick={toggleAdminMenu} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <MoreVertical size={18} />
            </button>
            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 text-sm space-y-1 z-50">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowBanOptions(!showBanOptions); }}
                  className="block w-full text-left hover:bg-gray-100 p-1 rounded"
                >
                  Ban This User
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemovePost(e); }}
                  className="block w-full text-left hover:bg-gray-100 p-1 rounded text-red-600"
                >
                  Remove This Post
                </button>
                {showBanOptions && (
                  <div className="mt-1 pl-2 space-y-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBanUser('permanent'); }}
                      className="block w-full text-left hover:bg-gray-100 p-1 rounded"
                    >
                      Permanently
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowTempOptions(!showTempOptions); }}
                      className="block w-full text-left hover:bg-gray-100 p-1 rounded"
                    >
                      Temporarily
                    </button>
                    {showTempOptions && (
                      <div className="mt-1 pl-4 space-y-1">
                        <button onClick={(e) => { e.stopPropagation(); handleBanUser('1d'); }} className="block w-full text-left hover:bg-gray-100 p-1 rounded">1 Day</button>
                        <button onClick={(e) => { e.stopPropagation(); handleBanUser('1w'); }} className="block w-full text-left hover:bg-gray-100 p-1 rounded">1 Week</button>
                        <button onClick={(e) => { e.stopPropagation(); handleBanUser('1m'); }} className="block w-full text-left hover:bg-gray-100 p-1 rounded">1 Month</button>
                        <button onClick={(e) => { e.stopPropagation(); handleBanUser('1y'); }} className="block w-full text-left hover:bg-gray-100 p-1 rounded">1 Year</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {user._id && !isAdmin && !isOwner && (
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 left-2 p-2 rounded-full bg-white shadow-md ${
              isWishlisted ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500`}
          >
            <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-600">Size:</span><span className="font-medium">{product.size}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Color:</span><span className="font-medium">{product.color}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Gender:</span><span className="font-medium">{product.gender}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Owner:</span><span className="font-medium">{product?.ownerId?.name || "Unknown"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Duration:</span><span className="font-medium">{product.duration}</span></div>

          <div className="pt-2 mt-2 border-t flex justify-between items-center gap-2 flex-wrap">
            <p className="text-xl font-bold text-indigo-600">৳{product.price}</p>
            {user._id && !isAdmin && !isOwner && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddToCart}
                className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </button>
              <button
                onClick={handleClosetSwap}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <Repeat className="w-4 h-4 mr-1" />
                Closet Swap
              </button>
            </div>
          )}
              
          </div>
        </div>
      </div>
    </div>
  );
}
