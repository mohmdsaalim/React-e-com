import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import BarcaLogo from '../assets/barcalogo.jpg';
import toast, { Toaster } from 'react-hot-toast';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission and send data to JSON server
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Registration Successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      
      {/* Logo Header */}
      <img
        src={BarcaLogo}
        alt="FC Barcelona Logo"
        className="w-70 h-70 mx-auto mb-2 object-contain"
      />

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 mt-0">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 font-oswald">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#000000] focus:border-[#000000] text-gray-900 placeholder-gray-400"
            placeholder="First Name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 font-oswald">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#000000] focus:border-[#000000] text-gray-900 placeholder-gray-400"
            placeholder="Last Name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 font-oswald">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#000000] focus:border-[#000000] text-gray-900 placeholder-gray-400"
            placeholder="Email"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 font-oswald">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#a50044] focus:border-[#a50044] text-gray-900 placeholder-gray-400"
            placeholder="Password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#ffc72c] text-black font-medium rounded-.5xl hover:bg-[#f2a31b] transition-colors duration-200 font-oswald disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>

        {/* Link to Login */}
        <div className="text-center">
          <Link
            to="/login"
            className="mt-4 inline-block text-sm font-oswald underline text-[#004d98] hover:text-[#002b60] tracking-wide"
          >
            ALREADY HAVE AN ACCOUNT? SIGN IN
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;