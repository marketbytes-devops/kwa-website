import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import apiClient from '../../../api/apiClient';
import authBg from "../../../assets/images/auth.jpg";

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleChange = (e) => {
    setOtp(e.target.value);
    setWarning('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      setWarning('OTP is required');
      return;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setWarning('OTP must be a 6-digit number');
      return;
    }
  
    apiClient.post('/auth/otp-verification/', { email, otp })
      .then(response => {
        setSuccess(response.data.message);
        setTimeout(() => navigate('/reset-password', { state: { email } }), 2000);
      })
      .catch(error => {
        setWarning(error.response?.data?.error || 'Failed to verify OTP. Please try again.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl flex rounded-xl shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})`, objectFit: "fill", backgroundRepeat: "no-repeat", backgroundSize: "contain" }}></div>
        <div className="w-full md:w-1/2 p-8 bg-transparent">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">OTP Verification</h1>
          <p className="text-xs text-gray-800 mb-8">
            Enter the OTP sent to your email ({email || 'your email'}) to verify your identity.
          </p>
          {warning && <p className="text-xs text-red-500 mb-4">{warning}</p>}
          {success && <p className="text-xs text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-800 mb-2">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="Enter OTP"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-200 text-blue-800 hover:text-gray-800 hover:bg-gray-200 text-sm font-medium rounded-sm transition-all duration-300"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;