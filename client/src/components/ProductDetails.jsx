import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Repeat } from "lucide-react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import toast from "react-hot-toast";
import ReviewSection from "./ReviewSection";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdmin = user?.isAdmin === true;
  const isOwner =
    product?.ownerId?._id === user._id || product?.ownerId === user._id;

  useEffect(() => {
    async function getProduct() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/view-product/${id}`
        );
        if (response.data.success) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (String(product.isAvailable) !== "true")
      return toast.error("Product is unavailable");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        userId: user._id,
        productId: id,
        quantity: 1,
      });
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (!isWishlisted) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/add`, {
          userId: user._id,
          productId: id,
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/remove`, {
          userId: user._id,
          productId: id,
        });
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleClosetSwap = () => {
    if (String(product.isAvailable) !== "true")
      return toast.error("Product is unavailable for swap");
    const ownerId = product?.ownerId?._id || product?.ownerId;
    const requestedProductId = product._id;
    localStorage.setItem("requestedProductId", requestedProductId);
    navigate(`/closet-swap/${ownerId}`);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to products
        </button>

        {isLoading ? (
          <div className="flex justify-center my-20">
            <PacmanLoader />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex relative">
                <div className="md:w-1/2 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                  {/* Condition & Availability badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                      {product.condition}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        String(product.available) === "true"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {String(product.available) === "true"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="md:w-1/2 p-8">
                  <div className="mb-4 flex justify-between items-start">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>
                    {user._id && !isAdmin && !isOwner && (
                      <button
                        onClick={handleToggleWishlist}
                        className={`p-2 rounded-full ${
                          isWishlisted ? "text-red-500" : "text-gray-400"
                        } hover:text-red-500`}
                      >
                        <Heart
                          className="w-6 h-6"
                          fill={isWishlisted ? "currentColor" : "none"}
                        />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-gray-600">Price</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ৳{product.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Size</span>
                        <p className="font-medium">{product.size}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Color</span>
                        <p className="font-medium">{product.color}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Gender</span>
                        <p className="font-medium">{product.gender}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration</span>
                        <p className="font-medium">{product.duration}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Owner</span>
                        <p className="font-medium">
                          {product?.ownerId?.name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {user._id && !isAdmin && !isOwner && product.available && (
                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={handleAddToCart}
                          disabled={String(product.isAvailable) !== "true"}
                          className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md shadow-sm text-base font-medium transition-colors ${
                            String(product.isAvailable) === "true"
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </button>
                        <button
                          onClick={handleClosetSwap}
                          disabled={String(product.isAvailable) !== "true"}
                          className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md shadow-sm text-base font-medium transition-colors ${
                            String(product.isAvailable) === "true"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Repeat className="w-5 h-5 mr-2" />
                          Closet Swap
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="mt-10">
              <ReviewSection productId={product._id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
