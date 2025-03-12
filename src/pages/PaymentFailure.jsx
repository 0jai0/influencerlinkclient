import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentFailure = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Payment Failure</h2>
      <p>Your payment could not be processed.</p>
      <p>Transaction ID: {transactionId}</p>
    </div>
  );
};

export default PaymentFailure;
