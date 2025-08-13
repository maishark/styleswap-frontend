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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/update-status`, { orderId, newStatus });
      toast.success('Order status updated!');
      fetchOwnerOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

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
      <p><strong>Requested By:</strong> {swap.requestedBy?.name}</p>
      {swap.requestedProduct && (
        <div className="mt-2">
          <p className="text-sm font-semibold mb-1">Requested Product:</p>
          <img src={swap.requestedProduct?.image} alt="Requested Product" className="w-32 h-32 object-cover rounded" />
          <p className="text-center mt-1">{swap.requestedProduct?.name}</p>
        </div>
      )}
      {swap.offeredProduct && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-1">Offered Product:</p>
          <img src={swap.offeredProduct?.image} alt="Offered Product" className="w-32 h-32 object-cover rounded" />
          <p className="text-center mt-1">{swap.offeredProduct?.name}</p>
        </div>
      )}
      <p className="mt-4 font-semibold">
        <span className="text-gray-700">Request: </span>
        <span className={
          swap.requestStatus === 'Accepted' ? 'text-green-600' :
          swap.requestStatus === 'Declined' ? 'text-red-600' :
          'text-yellow-600'
        }>
          {swap.requestStatus}
        </span>
      </p>
      <p className="mt-1 font-semibold">
        <span className="text-gray-700">Status: </span>
        <span className={
          swap.swapStatus === 'Shipped' ? 'text-blue-600' :
          swap.swapStatus === 'Returned' ? 'text-purple-600' :
          'text-yellow-600'
        }>
          {swap.swapStatus}
        </span>
      </p>
      {isOwnerView && swap.requestStatus === 'Pending' && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => handleSwapAction(swap._id, 'Accepted')} className="px-4 py-2 bg-green-600 text-white rounded">
            Accept
          </button>
          <button onClick={() => handleSwapAction(swap._id, 'Declined')} className="px-4 py-2 bg-red-600 text-white rounded">
            Decline
          </button>
        </div>
      )}
      {isOwnerView && (
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Update Swap Status:</label>
          <select
            value={swap.swapStatus}
            onChange={(e) => handleSwapStatusChange(swap._id, e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      )}
    </div>
  );

  const renderMyOrders = () => (
    <div className="space-y-4">
      {myOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders placed yet.</p>
      ) : (
        myOrders.map(order => (
          <div key={order._id} className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Product:</strong> {order.product?.name}</p>
            <p><strong>Owner:</strong> {order.product?.ownerId?.name}</p>
            <p><strong>Rental Date:</strong> {new Date(order.rentedAt).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> {order.duration} days</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      )}
    </div>
  );

  const renderOwnerOrders = () => (
    <div className="space-y-4">
      {ownerOrders.length === 0 ? (
        <p className="text-center text-gray-500">No one has rented your products yet.</p>
      ) : (
        ownerOrders.map(order => (
          <div key={order._id} className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Product:</strong> {order.product?.name}</p>
            <p><strong>Rented By:</strong> {order.user?.name}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <select
              className="mt-2 p-2 border rounded"
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        ))
      )}
    </div>
  );

  const renderClosetSwaps = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold">Swap Requests for Your Products</h3>
      {receivedRequests.length === 0 ? (
        <p className="text-center text-gray-500">No swap requests received yet.</p>
      ) : (
        receivedRequests.map(swap => renderSwapCard(swap, true))
      )}

      <h3 className="text-2xl font-bold mt-10">Swap Requests You Sent</h3>
      {sentRequests.length === 0 ? (
        <p className="text-center text-gray-500">No swap requests sent yet.</p>
      ) : (
        sentRequests.map(swap => renderSwapCard(swap, false))
      )}
    </div>
  );

  const renderProductCard = (product, isOwner) => (
    <div key={product._id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
      <div>
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-gray-600">Price: {product.price}</p>
        <p className="text-sm text-gray-600">Available: {product.available ? 'Yes' : 'No'}</p>
      </div>
      {isOwner && (
        <button
          onClick={() => toggleAvailability(product._id)}
          className={`px-4 py-2 rounded ${product.available ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
        >
          {product.available ? 'Mark Unavailable' : 'Mark Available'}
        </button>
      )}
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

  // =================== Render ===================
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="w-full p-2 border rounded" />
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="w-full p-2 border rounded" />
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" className="w-full p-2 border rounded" />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            </form>
          ) : (
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2"><User size={20} /> {user.name}</div>
              <div className="flex items-center gap-2"><Mail size={20} /> {user.email}</div>
              <div className="flex items-center gap-2"><Phone size={20} /> {user.phone}</div>
              <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">Edit Profile</button>
            </div>
          )}

          <div className="flex space-x-4 border-b mb-6">
            <button onClick={() => setActiveTab('myProducts')} className={`pb-2 ${activeTab === 'myProducts' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}>My Products</button>
            <button onClick={() => setActiveTab('myOrders')} className={`pb-2 ${activeTab === 'myOrders' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}>My Orders</button>
            <button onClick={() => setActiveTab('ownerOrders')} className={`pb-2 ${activeTab === 'ownerOrders' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}>Orders for My Products</button>
            <button onClick={() => setActiveTab('closetSwaps')} className={`pb-2 ${activeTab === 'closetSwaps' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}>Closet Swaps</button>
          </div>

          {activeTab === 'myProducts' && renderMyProducts()}
          {activeTab === 'myOrders' && renderMyOrders()}
          {activeTab === 'ownerOrders' && renderOwnerOrders()}
          {activeTab === 'closetSwaps' && renderClosetSwaps()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
