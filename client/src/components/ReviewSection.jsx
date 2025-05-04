import React, { useEffect, useState } from "react";
import { Star, X, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
const API_BASE_URL = process.env.VITE_API_URL;

const ReviewSection = ({ productId }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/reviews/product/${productId}`
      );
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer" : ""}`}
        onClick={
          interactive
            ? () => setNewReview({ ...newReview, rating: index + 1 })
            : undefined
        }
      />
    ));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReviewId !== null) {
        // Edit existing review
        await axios.patch(
          `${API_BASE_URL}/api/reviews/edit/${editingReviewId}`,
          {
            ...newReview,
            userId: user._id,
            userName: user.name,
          }
        );
        toast.success("Review updated!");
      } else {
        // Add new review
        await axios.post("${API_BASE_URL}/api/reviews/add", {
          ...newReview,
          userId: user._id,
          userName: user.name,
          productId,
        });
        toast.success("Review submitted!");
      }
      setShowAddReview(false);
      setNewReview({ rating: 5, comment: "" });
      setEditingReviewId(null);
      fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    }
  };

  const handleEditReview = (review) => {
    setNewReview({ rating: review.rating, comment: review.comment });
    setEditingReviewId(review._id);
    setShowAddReview(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/reviews/delete/${reviewId}`
      );
      toast.success("Review deleted!");
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  console.log("user r id", user._id);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Share your experience with us</h2>

      {/* Add Review Button */}
      {user._id && (
        <button
          onClick={() => {
            setNewReview({ rating: 5, comment: "" });
            setEditingReviewId(null);
            setShowAddReview(true);
          }}
          className="mb-8 text-blue-600 font-medium hover:text-blue-800"
        >
          + {editingReviewId ? "Edit" : "Add"} Review
        </button>
      )}

      {/* Add/Edit Review Form Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingReviewId ? "Edit Review" : "Write a Review"}
              </h3>
              <button
                onClick={() => {
                  setShowAddReview(false);
                  setEditingReviewId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {renderStars(newReview.rating, true)}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddReview(false);
                    setEditingReviewId(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingReviewId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6 mt-6">
        <h3 className="font-medium">All Reviews ({reviews.length})</h3>
        {reviews.map((review) => {
          console.log(review.userId);
          return (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">
                    {review.userName?.[0] || "A"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {review.userName || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              {user._id == review.userId._id && (
                <div className="flex gap-2 text-sm text-gray-500">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="hover:text-blue-600 flex items-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;
