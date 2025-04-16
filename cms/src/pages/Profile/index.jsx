import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import apiClient from '../../api/apiClient';

const MEDIA_URL = 'http://127.0.0.1:8000';

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    avatar: null,
    avatarPreview: null,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    role_id: '',
  });
  const [roles, setRoles] = useState([]);
  const [profileWarnings, setProfileWarnings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    avatar: '',
    general: '',
  });
  const [passwordWarnings, setPasswordWarnings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    general: '',
  });
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  // Fetch profile and roles with useCallback to prevent redefinition
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/auth/profile/');
      setUserData({
        firstName: response.data.first_name || '',
        lastName: response.data.last_name || '',
        email: response.data.email || '',
        username: response.data.username || '',
        avatar: response.data.avatar ? `${MEDIA_URL}${response.data.avatar}` : null,
        role_id: response.data.role?.id || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfileWarnings({
        ...profileWarnings,
        general: 'Failed to load profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [profileWarnings]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/roles/');
      setRoles(response.data || []);
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn('User lacks permission to fetch roles');
        setRoles([]);
      } else {
        console.error('Failed to fetch roles:', error);
        setProfileWarnings({
          ...profileWarnings,
          general: 'Failed to load roles. Please try again.',
        });
      }
    }
  }, [profileWarnings]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await Promise.all([fetchProfile(), fetchRoles()]);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile, fetchRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setProfileWarnings({ ...profileWarnings, [name]: '', general: '' });
    setPasswordWarnings({ ...passwordWarnings, [name]: '', general: '' });
    setSuccess('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setProfileWarnings({ ...profileWarnings, avatar: 'File size exceeds 1MB limit' });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setProfileWarnings({ ...profileWarnings, avatar: 'Only JPG, PNG, and GIF files are allowed' });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setUserData({ ...userData, avatar: file, avatarPreview: previewUrl });
      setProfileWarnings({ ...profileWarnings, avatar: '' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let hasError = false;
    const newWarnings = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      avatar: '',
      general: '',
    };

    if (!userData.firstName) {
      newWarnings.firstName = 'First name is required';
      hasError = true;
    }
    if (!userData.lastName) {
      newWarnings.lastName = 'Last name is required';
      hasError = true;
    }
    if (!userData.email) {
      newWarnings.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(userData.email)) {
      newWarnings.email = 'Please enter a valid email address';
      hasError = true;
    }
    if (!userData.username) {
      newWarnings.username = 'Username is required';
      hasError = true;
    }

    if (hasError) {
      setProfileWarnings(newWarnings);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('first_name', userData.firstName);
    formData.append('last_name', userData.lastName);
    formData.append('email', userData.email);
    formData.append('username', userData.username);
    if (userData.avatar && typeof userData.avatar !== 'string') {
      formData.append('avatar', userData.avatar);
    }

    try {
      const response = await apiClient.put('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Profile updated successfully');
      setUserData((prev) => ({
        ...prev,
        avatar: response.data.avatar ? `${MEDIA_URL}${response.data.avatar}` : prev.avatar,
        avatarPreview: null,
      }));
    } catch (error) {
      setProfileWarnings({
        ...profileWarnings,
        general:
          error.response?.data?.error ||
          error.response?.data?.non_field_errors?.[0] ||
          'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let hasError = false;
    const newWarnings = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      general: '',
    };

    if (!userData.currentPassword) {
      newWarnings.currentPassword = 'Current password is required';
      hasError = true;
    }
    if (!userData.newPassword) {
      newWarnings.newPassword = 'New password is required';
      hasError = true;
    } else if (userData.newPassword.length < 6) {
      newWarnings.newPassword = 'New password must be at least 6 characters long';
      hasError = true;
    }
    if (!userData.confirmNewPassword) {
      newWarnings.confirmNewPassword = 'Please confirm your new password';
      hasError = true;
    } else if (userData.newPassword !== userData.confirmNewPassword) {
      newWarnings.confirmNewPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setPasswordWarnings(newWarnings);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/change-password/', {
        current_password: userData.currentPassword,
        new_password: userData.newPassword,
        confirm_new_password: userData.confirmNewPassword,
      });
      setSuccess(response.data.message || 'Password changed successfully');
      setUserData({
        ...userData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setPasswordWarnings({
        ...passwordWarnings,
        general:
          error.response?.data?.error ||
          error.response?.data?.non_field_errors?.[0] ||
          'Failed to change password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full flex overflow-hidden">
        <div className="p-4 w-full bg-transparent overflow-y-auto">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h1>
          <p className="text-xs text-gray-800 mb-8">
            Use a permanent address where you can receive mail.
          </p>
          {profileWarnings.general && <p className="text-xs text-red-500 mb-4">{profileWarnings.general}</p>}
          {success && <p className="text-xs text-green-500 mb-4">{success}</p>}
          {isLoading && <p className="text-xs text-gray-500 mb-4">Loading...</p>}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img
                  src={
                    userData.avatarPreview ||
                    (typeof userData.avatar === 'string' && userData.avatar) ||
                    'https://placehold.co/80x80'
                  }
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/80x80';
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="inline-block px-4 py-2 text-xs rounded-md cursor-pointer bg-blue-200 text-blue-800 scale-100 hover:scale-105 transition-all duration-300 mb-1"
                >
                  Change avatar
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-800 mt-1">JPG, GIF or PNG. 1MB max.</p>
                {profileWarnings.avatar && <p className="text-xs text-red-500 mt-1">{profileWarnings.avatar}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-800 mb-2">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                  placeholder="First name"
                  disabled={isLoading}
                />
                {profileWarnings.firstName && <p className="text-xs text-red-500 mt-1">{profileWarnings.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-800 mb-2">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                  placeholder="Last name"
                  disabled={isLoading}
                />
                {profileWarnings.lastName && <p className="text-xs text-red-500 mt-1">{profileWarnings.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-800 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="Email address"
                disabled={isLoading}
              />
              {profileWarnings.email && <p className="text-xs text-red-500 mt-1">{profileWarnings.email}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-800 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="example.com/janesmith"
                disabled={isLoading}
              />
              {profileWarnings.username && <p className="text-xs text-red-500 mt-1">{profileWarnings.username}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-800 mb-2">Role</label>
              <input
                type="text"
                value={roles.find((role) => role.id === userData.role_id)?.name || 'No Role'}
                readOnly
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-200 text-blue-800 hover:text-gray-800 hover:bg-gray-200 text-sm font-medium rounded-sm transition-all duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-800 my-6"></div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="md:w-1/3">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                <p className="text-xs text-gray-800 mb-6">
                  Update your password associated with your account.
                </p>
              </div>

              <div className="md:w-2/3 space-y-4">
                <div className="relative">
                  <label className="block text-xs text-gray-800 mb-2">Current Password</label>
                  <input
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={userData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50 pr-10"
                    placeholder="Enter current password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                    className="absolute right-2 top-1/2 transform -translate-y-1 mt-2 text-gray-600 hover:text-gray-800"
                    disabled={isLoading}
                  >
                    {showPasswords.currentPassword ? (
                      <EyeOff size={18} strokeWidth={1.5} />
                    ) : (
                      <Eye size={18} strokeWidth={1.5} />
                    )}
                  </button>
                  {passwordWarnings.currentPassword && (
                    <p className="text-xs text-red-500 mt-1">{passwordWarnings.currentPassword}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-xs text-gray-800 mb-2">New Password</label>
                  <input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={userData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50 pr-10"
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-2 top-1/2 transform -translate-y-1 mt-2 text-gray-600 hover:text-gray-800"
                    disabled={isLoading}
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff size={18} strokeWidth={1.5} />
                    ) : (
                      <Eye size={18} strokeWidth={1.5} />
                    )}
                  </button>
                  {passwordWarnings.newPassword && (
                    <p className="text-xs text-red-500 mt-1">{passwordWarnings.newPassword}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-xs text-gray-800 mb-2">Re-enter New Password</label>
                  <input
                    type={showPasswords.confirmNewPassword ? 'text' : 'password'}
                    name="confirmNewPassword"
                    value={userData.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50 pr-10"
                    placeholder="Re-enter new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmNewPassword')}
                    className="absolute right-2 top-1/2 transform -translate-y-1 mt-2 text-gray-600 hover:text-gray-800"
                    disabled={isLoading}
                  >
                    {showPasswords.confirmNewPassword ? (
                      <EyeOff size={18} strokeWidth={1.5} />
                    ) : (
                      <Eye size={18} strokeWidth={1.5} />
                    )}
                  </button>
                  {passwordWarnings.confirmNewPassword && (
                    <p className="text-xs text-red-500 mt-1">{passwordWarnings.confirmNewPassword}</p>
                  )}
                </div>
              </div>
            </div>
            {passwordWarnings.general && (
              <p className="text-xs text-red-500 mb-4">{passwordWarnings.general}</p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-200 text-blue-800 hover:text-gray-800 hover:bg-gray-200 text-sm font-medium rounded-sm transition-all duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;