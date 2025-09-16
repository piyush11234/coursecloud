import React from "react";
import { Link } from "react-router-dom";

const Setting = () => {
  return (
    <div className="mt-20 mb-10 max-w-4xl mx-auto px-6 space-y-6">

      {/* Change Password Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">🔒 Change Password</h2>
        <p className="text-gray-600 mb-4">
          Update your account password to keep your account secure.
        </p>
        <Link
          to="/forgot-password"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Change Password
        </Link>
      </div>

      {/* View Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">👤 View Profile</h2>
        <p className="text-gray-600 mb-4">
          Check and update your personal information such as name, email, and profile picture.
        </p>
        <Link
          to="/profile"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
        >
          View Profile
        </Link>
      </div>

      {/* Deactivate Account Section */}
      {/* <div className="bg-white shadow-md rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">⚠️ Deactivate Account</h2>
        <p className="text-gray-600 mb-4">
          Deactivating your account will disable your profile and you will no longer be able to access it.
        </p>
        <button
          onClick={() => alert("Are you sure you want to deactivate your account?")}
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
        >
          Deactivate Account
        </button>
      </div> */}
    </div>
  );
};

export default Setting;
