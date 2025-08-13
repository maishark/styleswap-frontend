import React, { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const [activeTab, setActiveTab] = useState('myProducts');
  const [myOrders, setMyOrders] = useState([]);
  const [ownerOrders, setOwnerOrders] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchMyOrders();
      fetchOwnerOrders();
      fetchReceivedRequests();
      fetchSentRequests();
      fetchMyProducts();
    }
  }, [user]);

  // =================== Orders & Swaps ===================
  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user/${user._id}`);
      setMyOrders(res.data);
    } catch (error) {
      console.error('Error fetching my orders:', error);
    }
  };

  const fetchOwnerOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/owner/${user._id}`);
      setOwnerOrders(res.data);
    } catch (error) {
      console.error('Error fetching owner orders:', error);
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/exchanges/received/${user._id}`);
      setReceivedRequests(res.data.requests);
    } catch (error) {
      console.error('Error fetching received swap requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/exchanges/sent/${user._id}`);
      setSentRequests(res.data.requests);
    } catch (error) {
      console.error('Error fetching sent swap requests:', error);
    }
  };

  // =================== My Products ===================
  const fetchMyProducts = async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/my-products?userId=${user._id}`);
      const sortedProducts = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMyProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching my products:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    }
  };

  const toggleAvailability = async (productId) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/toggle-availability/${productId}`, {
        userId: user._id
      });
      setMyProducts(myProducts.map(p => p._id === productId ? res.data.data : p));
      toast.success('Availability updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update availability');
    }
  };

  // =================== Profile Update ===================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, formData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  // =================== Owner Orders Status ===================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/update-status`, { orderId, newStatus });
      toast.success('Order status updated!');
      fetchOwnerOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // =================== Swap Requests ===================
  const handleSwapAction = async (requestId, action) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/exchanges/status`, { requestId, action });
      toast.success(`Request ${action.toLowerCase()} successfully!`);
      fetchReceivedRequests();
    } catch (error) {
      toast.error('Failed to update swap request status');
    }
  };

  const handleSwapStatusChange = async (requestId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/exchanges/swap-status`, { requestId, newStatus });
      toast.success('Swap status updated!');
      fetchReceivedRequests();
    } catch (error) {
      toast.error('Failed to update swap status');
    }
  };

  // =================== Render Helpers ===================
  const renderSwapCard = (swap, isOwnerView) => (
    <div key={swap._id} className="bg-gray-100 p-4 rounded shadow">
      {/* ...rest of your swap card rendering logic... */}
    </div>
  );

  const renderMyOrders = () => (
    <div className="space-y-4">
      {/* ...rest of your renderMyOrders logic... */}
    </div>
  );

  const renderOwnerOrders = () => (
    <div className="space-y-4">
      {/* ...rest of your renderOwnerOrders logic... */}
    </div>
  );

  const renderClosetSwaps = () => (
    <div className="space-y-8">
      {/* ...rest of your renderClosetSwaps logic... */}
    </div>
  );

  const renderProductCard = (product, isOwner) => (
    <div key={product._id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
      {/* ...rest of your renderProductCard logic... */}
    </div>
  );

  const renderMyProducts = () => (
    <div className="space-y-4">
      {myProducts.length === 0 ? (
        <p className="text-center text-gray-500">You have no products yet.</p>
      ) : (
        myProducts.map(product => renderProductCard(product, true))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* ...rest of your JSX... */}
      </div>
    </div>
  );
};

export default Profile;
