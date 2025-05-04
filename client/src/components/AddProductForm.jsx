import React, { useState } from "react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";

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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const apiBaseUrl = import.meta.env.VITE_API_URL; // ✅ Use env variable

    console.log("Form Data being sent:", formData);
    
    const response = await axios.post(
      `${apiBaseUrl}/api/products/add-product`, // ✅ No hardcoded localhost
      {
        ...formData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      alert("Product added successfully!");
    }
  } catch (err) {
    console.error("Error adding product:", err.response?.data?.message || err.message);
    alert("Failed to add product. Please check your login session.");
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Size</label>
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

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
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400"
        disabled={isLoading}
      >
        {isLoading ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}
