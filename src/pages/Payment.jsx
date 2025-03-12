import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [userId, setUserId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the payment transaction by calling the backend API.
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API}/api/payment/pay`, {
        userId,
        totalAmount: Number(totalAmount)
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

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Payment</h2>
      <form onSubmit={handlePayment}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="totalAmount">Total Amount:</label>
          <input
            type="number"
            id="totalAmount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default Payment;
