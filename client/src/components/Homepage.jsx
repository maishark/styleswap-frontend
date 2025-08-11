import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { ProductList } from './ProductList';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow images (from public folder)
  const slides = [
  {
    image: "/images/image3.jpg",
    title: "Premium Fashion Rentals",
    subtitle: "Discover luxury fashion without the commitment",
    description: "Rent designer clothing for special occasions and everyday elegance"
  },
  {
    image: "/images/image2.jpg",
    title: "Sustainable Style",
    subtitle: "Fashion that cares for tomorrow",
    description: "Reduce waste while staying fashionable with our rental platform"
  },
  {
    image: "/images/image4.jpg",
    title: "Your Perfect Occasion",
    subtitle: "Every moment deserves the perfect outfit",
    description: "From weddings to business meetings, find your ideal look"
  }
];


  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollToProducts = () => {
    const section = document.getElementById('products-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
  <div className="relative w-full h-full">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        {/* Full Image */}
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />

        {/* Glass Effect Text Box */}
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-[380px] backdrop-blur-lg bg-white/40 rounded-2xl shadow-lg p-8 border border-white/30">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            {slide.title}
          </h1>
          <h2 className="text-xl md:text-2xl mb-3 text-gray-700">
            {slide.subtitle}
          </h2>
          <p className="text-lg mb-6 text-gray-600 leading-relaxed">
            {slide.description}
          </p>
          <button
            onClick={scrollToProducts}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            Explore Collection
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Navigation Arrows */}
  <button
    onClick={prevSlide}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 text-gray-800 p-3 rounded-full shadow"
  >
    <ChevronLeft size={24} />
  </button>
  <button
    onClick={nextSlide}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 text-gray-800 p-3 rounded-full shadow"
  >
    <ChevronRight size={24} />
  </button>

  {/* Dots */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-3 h-3 rounded-full ${
          index === currentSlide ? 'bg-indigo-600' : 'bg-gray-400'
        }`}
      />
    ))}
  </div>

  {/* Scroll Down */}
  <div className="absolute bottom-8 right-8 z-20 animate-bounce">
    <button
      onClick={scrollToProducts}
      className="text-gray-700 hover:text-indigo-500 bg-white/70 p-2 rounded-full shadow"
    >
      <ArrowDown size={28} />
    </button>
  </div>
</section>




<section className="bg-white py-16">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">
      Why Choose <span className="text-indigo-600">StyleSwap?</span>
    </h2>
    <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
      Elevate your wardrobe with affordable, stylish, and sustainable fashion choices.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-full mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </div>
         <h3 className="text-2xl font-bold text-gray-900 mb-3">Celebrate in Style</h3>
        <p className="text-gray-600 leading-relaxed">
         From weddings to casual parties, we help you look your best without overspending.
        </p>
    </div>

      {/* Card 2 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Sustainable Fashion</h3>
        <p className="text-gray-600 leading-relaxed">
          Reduce your carbon footprint while enjoying top-notch styles.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-6">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Affordable Luxury</h3>
        <p className="text-gray-600 leading-relaxed">
          Get designer looks at a fraction of the price with flexible rentals.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Products Section */}
      <section id="products-section" className="bg-gray-50 py-10">
        <ProductList />
      </section>
    </div>
  );
};

export default Homepage;
