import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { occasions } from './OccasionList';

export function OccasionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const occasion = occasions.find(o => o.id === parseInt(id));

  if (!occasion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Occasion not found</h2>
          <button
            onClick={() => navigate('/occasions')}
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to occasions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/occasions')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to occasions
        </button>

        <div className="mb-8">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={occasion.image}
              alt={occasion.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{occasion.name}</h1>
            </div>
          </div>
          <p className="mt-4 text-lg text-gray-600">{occasion.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasion.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}