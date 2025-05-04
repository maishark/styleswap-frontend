import React from 'react';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentStatus = ({ status, orderId, orderDetails }) => {
  if (status === 'success') {
    return (
      <div className="text-center py-10 px-4">
        <div className="animate-bounce inline-flex rounded-full bg-green-100 p-4 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your order #{orderId} has been placed successfully.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{orderDetails?.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-800 font-medium">Total Amount:</span>
              <span className="font-bold">৳{orderDetails?.amount}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          An email with the order details has been sent to your email address. The product owner has been notified and will ship your item soon.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
          >
            View Your Orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="text-center py-10 px-4">
        <div className="inline-flex rounded-full bg-red-100 p-4 mb-6">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200 shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return null;
};

export default PaymentStatus;