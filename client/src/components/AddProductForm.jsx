import React, { useState, useEffect } from "react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    customName: "",
    size: "",
    customSize: "",
    color: "",
    customColor: "",
    gender: "",
    condition: "",
    image: "",
    price: "",
    duration: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const navigate = useNavigate();

  const nameOptions = [
    "Saree", "Punjabi", "Salwar Kameez", "Suit", "Trousers", "Pajamas",
    "Shorts", "Blazer", "Kurti", "Shirt", "T-shirt", "Pant", "Skirt",
    "Scarf", "Gown", "Lehenga", "Others"
  ];

  const colorOptions = [
    "White", "Black", "Beige", "Brown", "Red", "Blue", "Green", "Yellow",
    "Pink", "Orange", "Purple", "Grey", "Navy", "Maroon", "Others"
  ];

  const sizeOptions = ["N/A", "XS", "S", "M", "L", "XL", "XXL", "Others"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.isBanned) {
          setIsBanned(true);
          toast.error("You are banned and cannot add products");
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBanned) return;

    const finalData = {
      ...formData,
      name: formData.name === "Others" ? formData.customName : formData.name,
      color: formData.color === "Others" ? formData.customColor : formData.color,
      size: formData.size === "Others" ? formData.customSize : formData.size,
    };

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/add-product`,
        finalData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("✅ Product added successfully!");
        navigate("/products");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        customName: "",
        size: "",
        customSize: "",
        color: "",
        customColor: "",
        gender: "",
        condition: "",
        image: "",
        price: "",
        duration: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/30">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Add New Product
        </h2>

        {isBanned ? (
          <p className="text-red-600 font-semibold text-center">
            You are banned and cannot add products.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Name</option>
                {nameOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.name === "Others" && (
                <input
                  type="text"
                  name="customName"
                  value={formData.customName}
                  onChange={handleChange}
                  placeholder="Enter custom name"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Color</option>
                {colorOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.color === "Others" && (
                <input
                  type="text"
                  name="customColor"
                  value={formData.customColor}
                  onChange={handleChange}
                  placeholder="Enter custom color"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              )}
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Size</option>
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.size === "Others" && (
                <input
                  type="text"
                  name="customSize"
                  value={formData.customSize}
                  onChange={handleChange}
                  placeholder="Enter custom size"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (৳)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Duration</option>
                <option value="7 days">7 days</option>
                <option value="15 days">15 days</option>
                <option value="30 days">30 days</option>
                <option value="45 days">45 days</option>
                <option value="60 days">60 days</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:bg-indigo-400 flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? <PacmanLoader size={12} color="#fff" /> : "Add Product"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
