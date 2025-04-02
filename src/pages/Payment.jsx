import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { X } from 'lucide-react';

const Payment = ({ onClose, initialCoins = 10 }) => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;
  const [linkCoins, setLinkCoins] = useState(initialCoins);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update linkCoins when initialCoins changes
  useEffect(() => {
    setLinkCoins(initialCoins);
  }, [initialCoins]);

  const totalAmount = linkCoins * 5; // 1 LinkCoin = 5 rupees

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API}/api/payment/pay`, {
        userId,
        totalAmount
      });

      const { approvalURL } = response.data;
      window.location.href = approvalURL;
    } catch (err) {
      console.error(err);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#59FFA7]/30 rounded-xl p-6 mx-auto max-w-md w-full relative">
      {/* Close Button */}
      <button  
        onClick={onClose}
        disabled={loading}
        className="absolute top-3 right-3 text-gray-400 hover:text-[#59FFA7] transition-colors disabled:opacity-50"
      >
        <X size={24} />
      </button>

      {/* Header with Coin Icon */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-3">
          <img 
            src="/coin.png" 
            alt="LinkCoins" 
            className="w-16 h-16 object-contain animate-bounce" 
            style={{ animationDuration: '2s' }}
          />
        </div>
        <h2 className="text-2xl font-bold text-[#59FFA7] text-center">Purchase LinkCoins</h2>
        <p className="text-gray-400 text-sm mt-1">
          Selected package: {initialCoins} LinkCoins
        </p>
      </div>

      {/* LinkCoins Selection */}
      <div className="mb-6">
        <label className="block text-[#59FFA7] text-sm font-medium mb-2">Adjust Quantity</label>
        <div className="flex items-center justify-center">
          <button
            onClick={() => setLinkCoins((prev) => Math.max(1, prev - 1))}
            disabled={loading}
            className="px-4 py-3 bg-[#252525] text-[#59FFA7] rounded-l-lg hover:bg-[#59FFA7]/10 transition-colors disabled:opacity-50"
          >
            -
          </button>
          <div className="px-2 py-3 bg-[#252525] text-[#59FFA7] font-bold text-xl flex items-center gap-2">
            <img 
              src="/coin.png" 
              alt="LinkCoins" 
              className="w-8 h-8 object-contain" 
            />
            {linkCoins}
          </div>
          <button
            onClick={() => setLinkCoins((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-3 bg-[#252525] text-[#59FFA7] rounded-r-lg hover:bg-[#59FFA7]/10 transition-colors disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="text-center text-gray-300 mb-2 flex items-center justify-center gap-1">
        <img 
          src="/coin.png" 
          alt="LinkCoins" 
          className="w-8 h-8 object-contain" 
        />
        <span>1 LinkCoin = ₹5</span>
      </div>

      {/* Total Amount */}
      <div className="bg-[#252525] rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total:</span>
          <div className="flex items-center gap-2">
            <img 
              src="/coin.png" 
              alt="LinkCoins" 
              className="w-8 h-8 object-contain" 
            />
            <span className="text-2xl font-bold text-[#59FFA7]">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#59FFA7]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          "Proceed to Payment"
        )}
      </button>

      {error && (
        <div className="text-red-400 text-sm text-center mt-2 p-2 bg-red-900/20 rounded">
          {error}
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-gray-400 text-center mt-4">
        You will be redirected to a secure payment page
      </p>
    </div>
  );
};

export default Payment;