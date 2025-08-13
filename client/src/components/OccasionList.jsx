import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define your occasions with filter rules
const occasionsConfig = [
  {
    id: 1,
    name: "Wedding Season",
    filter: (p) => ["Saree", "Lehenga", "Punjabi"].includes(p.name),
    image: "https://images.lifestyleasia.com/wp-content/uploads/2019/10/15202358/57471993_334193373953939_4765683472438935822_n.jpg"
  },
  {
    id: 2,
    name: "Corporate",
    filter: (p) => ["Blazer", "Suit", "Shirt", "Pant"].includes(p.name),
    image: "https://cdn.ecommercedns.uk/files/6/263846/3/47417243/concept-double---charcoal---2-3-image-ratio.jpg"
  },
  {
    id: 3,
    name: "Neutrals",
    filter: (p) => ["Beige", "Brown", "White", "Grey"].includes(p.color),
    image: "https://images.saymedia-content.com/.image/t_share/MjAwMzM1MjYxNzQwMTE1MDUy/how-to-put-together-neutral-outfits.jpg"
  },
  {
    id: 4,
    name: "Weekend Casual",
    filter: (p) => ["Trousers", "Kurti", "T-shirt"].includes(p.name),
    image: "https://cdn.shopify.com/s/files/1/0598/1070/9672/files/vjvnow-1_8089e9a6-d4dd-41c1-bc5c3d5965a_480x480.jpg?v=1723104002"
  },
];

export default function OccasionList({ products = [], applyFilters }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // no backend, so no fetch

  if (loading) return <p className="text-center py-10">Loading products...</p>;

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop by Occasion</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasionsConfig.map((occasion) => {
            // safe filtering
            const occasionProducts = Array.isArray(products)
              ? products.filter(occasion.filter)
              : [];

            return (
              <div
                key={occasion.id}
                onClick={() => applyFilters && applyFilters({
                  occasion: [occasion.name]
                })}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={occasion.image}
                    alt={occasion.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold">{occasion.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600">{occasion.name} collection</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {occasionProducts.length} items available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
