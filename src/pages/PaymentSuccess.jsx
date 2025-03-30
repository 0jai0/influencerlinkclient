import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');

  useEffect(() => {
    document.title = "Payment Successful | YourAppName";
  }, []);

  return (
    <div className="min-h-screen w-full bg-white bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-green-100"
      >
        <div className="bg-green-500 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <CheckCircle size={64} className="text-white mx-auto" strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-green-600 mb-6">Thank you for your purchase</p>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="font-mono text-green-700 font-medium break-all">{transactionId}</p>
          </div>

          <p className="text-gray-600 mb-8">
            Your transaction has been completed successfully. A receipt has been sent to your email.
          </p>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? <a href="mailto:support@yourapp.com" className="text-green-600 hover:underline">Contact support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;