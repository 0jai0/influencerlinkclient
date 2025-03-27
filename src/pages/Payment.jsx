import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Payment = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id; // Get userId from Redux
  const [linkCoins, setLinkCoins] = useState(1); // Default to 1 LinkCoin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = linkCoins * 5; // 1 LinkCoin = 5 rupees

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the payment transaction by calling the backend API.
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API}/api/payment/pay`, {
        userId,
        totalAmount,
      });

      const { approvalURL } = response.data;
      // Redirect the user to the PhonePe payment page.
      window.location.href = approvalURL;
    } catch (err) {
      console.error(err);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handleLinkCoinsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setLinkCoins(Math.max(1, value)); // Ensure the value is at least 1
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Payment</h2>

      <div className="my-4 flex flex-col items-center">
        <label className="text-gray-700 text-lg font-semibold">LinkCoins:</label>
        <div className="flex items-center mt-2">
          <button
            onClick={() => setLinkCoins((prev) => Math.max(1, prev - 1))}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
  type="number"
  value={linkCoins}
  onChange={handleLinkCoinsChange}
  disabled={loading}
  className="px-4 py-2 bg-gray-200 text-xl text-black font-bold text-center w-20 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>
          <button
            onClick={() => setLinkCoins((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-xl font-semibold text-gray-700 text-center">Total Amount: ₹{totalAmount}</p>

      <button
        type="submit"
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-bold rounded-lg shadow-md hover:from-[#59FFA7] hover:to-[#2BFFF8] hover:text-black transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

      <button
        onClick={onClose}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </div>
  );
};

export default Payment;