import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');
  const errorCode = queryParams.get('code') || 'UNKNOWN_ERROR';

  useEffect(() => {
    document.title = "Payment Failed | YourAppName";
  }, []);

  // Error messages mapping
  const errorMessages = {
    'INSUFFICIENT_FUNDS': 'Your payment was declined due to insufficient funds.',
    'CARD_DECLINED': 'Your card was declined by the issuer.',
    'EXPIRED_CARD': 'The card you used has expired.',
    'UNKNOWN_ERROR': 'We encountered an issue processing your payment.',
    'default': 'Your payment could not be processed at this time.'
  };

  const getErrorMessage = (code) => {
    return errorMessages[code] || errorMessages['default'];
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-red-100"
      >
        <div className="bg-red-500 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <XCircle size={64} className="text-white mx-auto" strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-red-600 mb-6">{getErrorMessage(errorCode)}</p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="text-red-500" size={18} />
              <p className="text-sm text-gray-600">Transaction ID</p>
            </div>
            <p className="font-mono text-red-700 font-medium break-all">{transactionId}</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your account has not been charged. Please try again or use a different payment method.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(-1)} // Go back to payment page
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? <a href="mailto:support@yourapp.com" className="text-red-600 hover:underline">Contact support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;