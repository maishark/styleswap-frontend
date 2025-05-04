import React from "react";
import { useNavigate } from "react-router-dom";

export const occasions = [
  {
    id: 1,
    name: "Wedding Season",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=800",
    description: "Find the perfect outfit for the wedding season",
    products: [
      {
        _id: "w1",
        name: "Elegant Lehenga",
        size: "M",
        color: "Red",
        gender: "Female",
        condition: "New",
        image:
          "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=800",
        price: "12999",
        duration: "7 days",
        popularity: 45,
        inCarts: 8,
        sustainabilityScore: 90,
      },
      {
        _id: "w2",
        name: "Designer Saree",
        size: "L",
        color: "Pink",
        gender: "Female",
        condition: "Like New",
        image:
          "https://images.unsplash.com/photo-1583391733956-6c77a0cf4d01?auto=format&fit=crop&q=80&w=800",
        price: "8999",
        duration: "7 days",
        popularity: 38,
        inCarts: 5,
        sustainabilityScore: 85,
      },
    ],
  },
  {
    id: 2,
    name: "Corporate Chic",
    image:
      "https://images.unsplash.com/photo-1632149877166-f75d49000351?auto=format&fit=crop&q=80&w=800",
    description: "Professional attire for your workplace needs",
    products: [
      {
        _id: "c1",
        name: "Business Suit",
        size: "M",
        color: "Navy",
        gender: "Female",
        condition: "New",
        image:
          "https://images.unsplash.com/photo-1632149877166-f75d49000351?auto=format&fit=crop&q=80&w=800",
        price: "5999",
        duration: "30 days",
        popularity: 32,
        inCarts: 4,
        sustainabilityScore: 88,
      },
      {
        _id: "c2",
        name: "Professional Blazer",
        size: "L",
        color: "Black",
        gender: "Female",
        condition: "Good",
        image:
          "https://images.unsplash.com/photo-1600091169676-f0b1f0779ead?auto=format&fit=crop&q=80&w=800",
        price: "4499",
        duration: "15 days",
        popularity: 28,
        inCarts: 6,
        sustainabilityScore: 82,
      },
    ],
  },
  {
    id: 3,
    name: "Weekend Casual",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    description: "Comfortable and stylish outfits for your weekend plans",
    products: [
      {
        _id: "wc1",
        name: "Casual Denim Set",
        size: "S",
        color: "Blue",
        gender: "Female",
        condition: "New",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        price: "2999",
        duration: "15 days",
        popularity: 42,
        inCarts: 9,
        sustainabilityScore: 95,
      },
      {
        _id: "wc2",
        name: "Weekend Dress",
        size: "M",
        color: "Floral",
        gender: "Female",
        condition: "Like New",
        image:
          "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&q=80&w=800",
        price: "2499",
        duration: "7 days",
        popularity: 35,
        inCarts: 7,
        sustainabilityScore: 87,
      },
    ],
  },
];

export default function OccasionList() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto  py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shop by Occasion
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occasion) => (
            <div
              key={occasion.id}
              onClick={() => navigate(`/occasions/${occasion.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={occasion.image}
                  alt={occasion.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">
                    {occasion.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600">{occasion.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {occasion.products.length} items available
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
