import { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const InstagramOTPDashboard = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpRecords, setOtpRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    userId: '',
    profileName: ''
  });
  

  const fetchAllOtps = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.profileName) params.append('profileName', filters.profileName);
  
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/otp/get-all?${params.toString()}`
      );
      setOtpRecords(response.data.data);
    } catch (error) {
      setMessage('Failed to fetch OTP records');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]); 
  useEffect(() => {
    fetchAllOtps();
  }, [filters, fetchAllOtps]);

  const sendOTP = async () => {
    if (!username) {
      setMessage('Please enter a username');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/otp/store`,
        { profileName: username }
      );
      setMessage(response.data.message);
      //fetchAllOtps();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async () => {
    if (!username || !otp) {
      setMessage('Please enter username and OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/send-status`,
        { 
          userId: selectedRecord?.userId || '',
          status: 'send'
        }
      );
      setMessage(response.data.message);
      //fetchAllOtps();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const copyMessageToClipboard = (record) => {
    const message = `Hi @${record.profileName}, this is your OTP: ${record.otp}\n\nPlease verify your Instagram account on InfluencerLink.com to complete the verification process.\n\nThank you,\nInfluencerLink Team`;
    navigator.clipboard.writeText(message);
    setMessage('Copied message to clipboard!');
  };

  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <Navbar />
      <div className="w-svw">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent">
              Instagram OTP Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            Admin Access Only
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-[#59FFA7]">Verification Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Instagram Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Instagram username"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-[#59FFA7] focus:ring-1 focus:ring-[#59FFA7] placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP (if verifying)"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-[#59FFA7] focus:ring-1 focus:ring-[#59FFA7] placeholder-gray-500"
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('success') || message.includes('Copied') ? 
                  'bg-green-900/30 text-green-400 border-green-800' : 
                  'bg-red-900/30 text-red-400 border-red-800'
                } border`}>
                  {message}
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={sendOTP}
                  disabled={loading || !username}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium border ${
                    loading || !username ? 
                    'border-gray-600 text-gray-500 bg-gray-700 cursor-not-allowed' : 
                    'border-[#59FFA7] text-[#59FFA7] hover:bg-[#59FFA7]/10'
                  }`}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <button
                  onClick={verifyAccount}
                  disabled={loading || !username || !otp}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium border ${
                    loading || !username || !otp ? 
                    'border-gray-600 text-gray-500 bg-gray-700 cursor-not-allowed' : 
                    'border-[#2BFFF8] text-[#2BFFF8] hover:bg-[#2BFFF8]/10'
                  }`}
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>
            </div>

            {/* Selected Record Details */}
            {selectedRecord && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-[#2BFFF8] mb-2">Selected Record</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">User ID:</span> {selectedRecord.userId}</p>
                  <p><span className="text-gray-400">Profile:</span> @{selectedRecord.profileName}</p>
                  <p><span className="text-gray-400">OTP:</span> {selectedRecord.otp}</p>
                  <p>
                    <span className="text-gray-400">Status:</span> 
                    <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedRecord.status === 'verified' ? 'bg-green-900 text-green-300' : 
                      selectedRecord.status === 'send' ? 'bg-blue-900 text-blue-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {selectedRecord.status}
                    </span>
                  </p>
                  <button
                    onClick={() => copyMessageToClipboard(selectedRecord)}
                    className="w-full mt-3 py-2 bg-[#59FFA7]/10 text-[#59FFA7] border border-[#59FFA7] rounded-lg hover:bg-[#59FFA7]/20"
                  >
                    Copy DM Message
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OTP Records */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <h2 className="text-xl font-semibold text-[#2BFFF8]">OTP Records</h2>
              <div className="flex flex-col md:flex-row gap-2">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="send">Sent</option>
                  <option value="verified">Verified</option>
                  <option value="expired">Expired</option>
                </select>
                <input
                  type="text"
                  placeholder="Search User ID"
                  value={filters.userId}
                  onChange={(e) => setFilters({...filters, userId: e.target.value})}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Search Profile"
                  value={filters.profileName}
                  onChange={(e) => setFilters({...filters, profileName: e.target.value})}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                />
                <button 
                  onClick={fetchAllOtps}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading && otpRecords.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#59FFA7]"></div>
              </div>
            ) : otpRecords.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No OTP records found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Profile</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">OTP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {otpRecords.map((record, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-700/50 cursor-pointer ${
                          selectedRecord?._id === record._id ? 'bg-gray-700/30' : ''
                        }`}
                        onClick={() => setSelectedRecord(record)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 truncate max-w-[120px]">
                          {record.userId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-100">
                          @{record.profileName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {record.otp}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'verified' ? 'bg-green-900 text-green-300' : 
                            record.status === 'send' ? 'bg-blue-900 text-blue-300' :
                            'bg-yellow-900 text-yellow-300'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                          {new Date(record.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyMessageToClipboard(record);
                            }}
                            className="text-[#59FFA7] hover:underline"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Total Records</div>
            <div className="text-2xl font-bold text-[#59FFA7]">
              {otpRecords.length}
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Pending</div>
            <div className="text-2xl font-bold text-yellow-400">
              {otpRecords.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Sent</div>
            <div className="text-2xl font-bold text-[#2BFFF8]">
              {otpRecords.filter(r => r.status === 'send').length}
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Verified</div>
            <div className="text-2xl font-bold text-green-400">
              {otpRecords.filter(r => r.status === 'verified').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramOTPDashboard;