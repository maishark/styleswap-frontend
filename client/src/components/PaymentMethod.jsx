import React from 'react';

const PaymentMethod = ({ method, selectedMethod, onSelect }) => {
  const isSelected = selectedMethod === method.name;
  
  return (
    <div
      className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(method.name)}
    >
      <div className="flex-shrink-0 h-12 w-12 mr-4">
        <img src={method.logo} alt={method.name} className="h-full w-auto object-contain" />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900">{method.name}</h3>
        <p className="text-sm text-gray-500">
          {method.name === 'Card' 
            ? 'Pay with credit or debit card' 
            : `Pay with your ${method.name} account`}
        </p>
      </div>
      <div className="flex-shrink-0 ml-4">
        <div 
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected ? 'border-indigo-500' : 'border-gray-300'
          }`}
        >
          {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;