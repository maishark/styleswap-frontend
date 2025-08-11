import React, { useState } from "react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    color: "",
    gender: "",
    condition: "",
    image: "",
    price: "",
    duration: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log("Form Data being sent:", formData);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/add-product`, { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.data.success) {
      toast.success("✅ Product added successfully!");
      navigate('/');
      //await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s for toast
      //navigate("/products"); // Redirect after success
    }
    } catch (err) {
      console.error("Error adding product:", err.response?.data?.message || err.message);
      toast.error("❌ Failed to add product. Please check your login session.");
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        size: "",
        color: "",
        gender: "",
        condition: "",
        image: "",
        price: "",
        duration: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/30">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Size", name: "size", type: "text" },
            { label: "Color", name: "color", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          ))}

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

          {/* Image URL */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:bg-indigo-400 flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <PacmanLoader size={12} color="#fff" />
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
