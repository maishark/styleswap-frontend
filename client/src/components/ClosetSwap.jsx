import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ClosetSwap = () => {
  const { ownerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const requestedProductId =
    location?.state?.requestedProductId || localStorage.getItem('requestedProductId');

  const [wishlist, setWishlist] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (!requestedProductId) {
      toast.error('No product selected for swap.');
      navigate('/');
      return;
    }

    localStorage.setItem('requestedProductId', requestedProductId); // persist swap item

    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/wishlist/${ownerId}`);
        if (response.data?.wishlist?.items) {
          setWishlist(response.data.wishlist.items);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist.');
      }
    };

    if (ownerId) {
      fetchWishlist();
    }
  }, [ownerId, requestedProductId, navigate]);

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
  };

  const handleSendSwapRequest = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product first.');
      return;
    }

    try {
      await axios.post('${API_BASE_URL}/api/exchanges/request', {
        ownerId,
        offeredProductId: selectedProductId,
        requestedById: currentUser._id,
        requestedProductId,
      });
      toast.success('Swap request sent successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error sending swap request:', error);
      toast.error('Failed to send swap request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Select an Item to Offer</h2>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const product = item?.productId;
              if (!product || !product.image || !product.name) return null;

              return (
                <div
                  key={item._id}
                  className={`border-2 p-4 rounded-lg shadow-md cursor-pointer ${
                    selectedProductId === product._id ? 'border-green-500' : 'border-gray-300'
                  }`}
                  onClick={() => handleSelectProduct(product._id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="mt-2 text-lg font-semibold text-center">{product.name}</h3>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">This user's wishlist is empty.</p>
        )}

        {wishlist.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleSendSwapRequest}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Send Swap Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosetSwap;
