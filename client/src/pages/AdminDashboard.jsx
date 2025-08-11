import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [bannedUsers, setBannedUsers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`)
      .then((res) => res.json())
      .then((data) => setBannedUsers(data));
  }, []);

  const handleUnban = async (userId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/unban-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      setBannedUsers((prev) => prev.filter((user) => user._id !== userId));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {bannedUsers.length === 0 ? (
        <p>No banned users</p>
      ) : (
        <ul className="space-y-3">
          {bannedUsers.map((user) => (
            <li key={user._id} className="border p-3 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    Banned until:{" "}
                    {user.bannedUntil
                      ? new Date(user.bannedUntil).toLocaleDateString()
                      : "Permanently"}
                  </p>
                </div>
                <button
                  onClick={() => handleUnban(user._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Unban
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
