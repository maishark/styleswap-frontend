import { useState, useEffect } from "react";

const FilterSidebar = ({
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
}) => {
  // State to track all selected filters
  const [filters, setFilters] = useState({
    occasion: [],
    subEvents: [],
    gender: "",
    size: ["L"],
    color: [],
    duration: [],
    priceRange: [500, 5000],
  });

  // Initialize with any existing filters
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters({
        ...filters,
        ...initialFilters,
      });
    }
  }, [initialFilters]);

  const occasions = [
    "Wedding Season",
    "Corporate",
    "Weekend Casual",
    "Party",
    "Festival",
  ];

  const subEvents = [
    "Holud",
    "Reception",
    "Nikah",
    "Corporate Event",
    "Date Night",
  ];

  const genders = ["Male", "Female", "Unisex"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#DC2626" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Green", hex: "#059669" },
    { name: "Yellow", hex: "#EAB308" },
    { name: "Purple", hex: "#7C3AED" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Gold", hex: "#D4AF37" },
    { name: "Silver", hex: "#C0C0C0" },
  ];

  const durations = [
    "7 Days",
    "15 Days",
    "1 month",
    "1 & 1/2 month",
    "2 month",
  ];

  // Handle checkbox

  const handleFilterChange = (category, value, isCheckbox = true) => {
    if (isCheckbox) {
      setFilters((prev) => {
        const currentValues = [...prev[category]];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [category]: currentValues.filter((item) => item !== value),
          };
        } else {
          return {
            ...prev,
            [category]: [...currentValues, value],
          };
        }
      });
    } else {
      // For radio buttons (like gender)
      setFilters((prev) => ({
        ...prev,
        [category]: value,
      }));
    }
  };

  // Handle price range changes
  const handlePriceRangeChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      occasion: [],
      subEvents: [],
      gender: "",
      size: [],
      color: [],
      duration: [],
      priceRange: [500, 5000],
      tags: [],
    });
    onClearFilters();
  };

  const FilterSection = ({ title, items, type = "checkbox", category }) => (
    <div className="mb-6">
      <h3 className="font-medium text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => {
          const itemValue = typeof item === "object" ? item.name : item;
          const isChecked =
            type === "checkbox"
              ? filters[category].includes(itemValue)
              : filters[category] === itemValue;

          return (
            <div key={index} className="flex items-center">
              <input
                id={`${title}-${index}`}
                type={type}
                name={title}
                value={itemValue}
                checked={isChecked}
                onChange={() =>
                  handleFilterChange(category, itemValue, type === "checkbox")
                }
                className="filter-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`${title}-${index}`}
                className="ml-2 text-gray-700 text-sm flex items-center"
              >
                {typeof item === "object" && item.hex && (
                  <span
                    className="inline-block w-4 h-4 mr-2 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.hex }}
                  ></span>
                )}
                {itemValue}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="font-medium text-lg">Filters</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <FilterSection title="Occasion" items={occasions} category="occasion" />
        <FilterSection
          title="Sub-events"
          items={subEvents}
          category="subEvents"
        />
        <FilterSection
          title="Gender"
          items={genders}
          type="radio"
          category="gender"
        />
        <FilterSection title="Size" items={sizes} category="size" />
        <FilterSection title="Color" items={colors} category="color" />
        <FilterSection
          title="Rental Duration"
          items={durations}
          category="duration"
        />

        {/* Price Range Slider */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handlePriceRangeChange(
                  filters.priceRange[0],
                  Number.parseInt(e.target.value)
                )
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">
                ৳{filters.priceRange[0]}
              </span>
              <span className="text-sm text-gray-500">
                ৳{filters.priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className="w-full text-gray-500 text-sm hover:text-gray-700"
          onClick={handleClearFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
