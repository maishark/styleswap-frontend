import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PaymentMethod from './PaymentMethod';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
const API_BASE_URL = process.env.VITE_API_URL;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [orderId, setOrderId] = useState(null);
  const [total, setTotal] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bKash');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!user._id) {
      toast.error('You must be logged in to make a payment');
      navigate('/login');
      return;
    }
    
    if (location.state) {
      if (location.state.total) setTotal(location.state.total);
      if (location.state.orderId) setOrderId(location.state.orderId);
    } else {
      // No payment information, redirect to cart
      navigate('/cart');
    }
  }, [location, navigate, user._id]);
  
  const paymentMethods = [
    {
      name: 'bKash',
      logo: 'https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo.svg'
    },
    {
      name: 'Nagad',
      logo: 'https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg'
    },
    {
      name: 'Card',
      logo: 'https://www.logo.wine/a/logo/Visa_Inc./Visa_Inc.-Logo.wine.svg'
    }
  ];
  
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };
  
  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post('${API_BASE_URL}api/payments/process', {
        userId: user._id,
        amount: total,
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: paymentData.paymentDetails
      }); // 🔥 removed orderId
  
      if (response.data.success) {
        setOrderDetails({
          paymentMethod: paymentData.paymentMethod,
          amount: total,
          ...response.data.orderDetails
        });
        setPaymentStatus('success');
        toast.success('Payment successful!');
      } else {
        setPaymentStatus('error');
        toast.error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      setPaymentStatus('error');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
  if (paymentStatus) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <PaymentStatus 
            status={paymentStatus} 
            orderId={orderId}
            orderDetails={orderDetails}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackToCart}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <ShoppingBag className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                  <p className="text-gray-500">
                    Complete your rental purchase by making a payment
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">৳{total}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Select Payment Method
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <PaymentMethod
                    key={method.name}
                    method={method}
                    selectedMethod={selectedPaymentMethod}
                    onSelect={handlePaymentMethodSelect}
                  />
                ))}
              </div>
            </div>
            
            <PaymentForm 
              paymentMethod={selectedPaymentMethod}
              onSubmit={handlePaymentSubmit}
            />
            
            {loading && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-indigo-200 h-12 w-12 flex items-center justify-center mb-4">
                      <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Processing Payment</h3>
                    <p className="text-gray-500 text-center text-sm">
                      Please do not close this window or refresh the page.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;