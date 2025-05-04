import React, { useState } from 'react';
import { CreditCard, Phone } from 'lucide-react';

const PaymentForm = ({ paymentMethod, onSubmit }) => {
  const [formData, setFormData] = useState({
    // bKash and Nagad fields
    phoneNumber: '',
    pin: '',
    
    // Card fields
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\//g, '')
        .replace(/^([0-9]{2})([0-9]{0,2})/, (match, p1, p2) => {
          if (p2) return `${p1}/${p2}`;
          return p1;
        });
    }
    
    setFormData({ ...formData, [name]: formattedValue });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'bKash' || paymentMethod === 'Nagad') {
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^01[3-9]\d{8}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Bangladesh phone number';
      }
      
      if (!formData.pin) {
        newErrors.pin = 'PIN is required';
      } else if (!/^\d{4,6}$/.test(formData.pin)) {
        newErrors.pin = 'PIN must be 4-6 digits';
      }
    } else if (paymentMethod === 'Card') {
      if (!formData.cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        paymentMethod,
        paymentDetails: formData
      });
    }
  };
  
  if (paymentMethod === 'bKash' || paymentMethod === 'Nagad') {
    return (
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className={`pl-10 w-full py-2 px-3 border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
            PIN
          </label>
          <input
            type="password"
            id="pin"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            placeholder="Enter your PIN"
            className={`w-full py-2 px-3 border ${
              errors.pin ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.pin && (
            <p className="text-red-500 text-sm">{errors.pin}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            Confirm Payment
          </button>
        </div>
      </form>
    );
  }
  
  if (paymentMethod === 'Card') {
    return (
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
            Name on Card
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="John Smith"
            className={`w-full py-2 px-3 border ${
              errors.cardName ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.cardName && (
            <p className="text-red-500 text-sm">{errors.cardName}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              maxLength="19"
              className={`pl-10 w-full py-2 px-3 border ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              className={`w-full py-2 px-3 border ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm">{errors.expiryDate}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              className={`w-full py-2 px-3 border ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm">{errors.cvv}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            Confirm Payment
          </button>
        </div>
      </form>
    );
  }
  
  return null;
};

export default PaymentForm;