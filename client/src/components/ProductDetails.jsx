import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import toast from "react-hot-toast";
import ReviewSection from "./ReviewSection";
const API_BASE_URL = process.env.VITE_API_URL;

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function getProduct() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/products/view-product/${id}`
        );

        if (response.data.success) {
          const data = response.data.data;
          setProduct(data);
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
    try {
      await axios.post("${API_BASE_URL}/api/cart/add", {
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
        await axios.post("${API_BASE_URL}/api/wishlist/add", {
          userId: user._id,
          productId: id,
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      } else {
        await axios.post("${API_BASE_URL}/api/wishlist/remove", {
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Product not found
          </h2>
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
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>
                      {user._id && (
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {product.condition}
                    </span>
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
                    </div>

                    {user._id && (
                      <button
                        onClick={handleAddToCart}
                        className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section with productId */}
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
