import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';

const UserRoles = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    role_id: '',
  });
  const [warnings, setWarnings] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    role_id: '',
    general: '',
  });
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    apiClient.get('/auth/roles/')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        if (error.response?.status === 403) {
          console.warn('User lacks permission to fetch roles');
          setRoles([]);
        } else {
          console.error('Failed to fetch roles:', error);
        }
      });

    apiClient.get('/auth/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        if (error.response?.status === 403) {
          console.warn('User lacks permission to fetch users');
          setUsers([]);
        } else {
          console.error('Failed to fetch users:', error);
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setWarnings({ ...warnings, [name]: '', general: '' });
    setSuccess('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const newWarnings = {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      role_id: '',
      general: '',
    };

    if (!formData.email) {
      newWarnings.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newWarnings.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (!formData.username) {
      newWarnings.username = 'Username is required';
      hasError = true;
    }

    if (!formData.first_name) {
      newWarnings.first_name = 'First name is required';
      hasError = true;
    }

    if (!formData.last_name) {
      newWarnings.last_name = 'Last name is required';
      hasError = true;
    }

    if (!formData.role_id) {
      newWarnings.role_id = 'Role is required';
      hasError = true;
    }

    if (hasError) {
      setWarnings(newWarnings);
      return;
    }

    const data = {
      email: formData.email,
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role_id: formData.role_id,
    };

    const request = isEditing
      ? apiClient.put(`/auth/users/${formData.id}/`, data)
      : apiClient.post('/auth/users/', data);

    request
      .then(response => {
        setSuccess(isEditing ? 'User updated successfully' : 'User created successfully. Credentials sent to email.');
        setFormData({
          id: null,
          email: '',
          username: '',
          first_name: '',
          last_name: '',
          role_id: '',
        });
        setIsEditing(false);
        if (isEditing) {
          setUsers(users.map(user => (user.id === response.data.id ? response.data : user)));
        } else {
          setUsers([...users, response.data]);
        }
      })
      .catch(error => {
        setWarnings({
          ...warnings,
          general: error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} user. Please try again.`,
        });
      });
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role_id: user.role?.id || '',
    });
    setIsEditing(true);
    setWarnings({
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      role_id: '',
      general: '',
    });
    setSuccess('');
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      apiClient.delete(`/auth/users/${userId}/`)
        .then(() => {
          setUsers(users.filter(user => user.id !== userId));
          setSuccess('User deleted successfully');
          if (isEditing && formData.id === userId) {
            setIsEditing(false);
            setFormData({
              id: null,
              email: '',
              username: '',
              first_name: '',
              last_name: '',
              role_id: '',
            });
          }
        })
        .catch(error => {
          setWarnings({
            ...warnings,
            general: error.response?.data?.error || 'Failed to delete user. Please try again.',
          });
        });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      role_id: '',
    });
    setWarnings({
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      role_id: '',
      general: '',
    });
    setSuccess('');
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full p-8 bg-transparent">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">User Roles Management</h1>
        <p className="text-xs text-gray-800 mb-8">
          Create and manage users and their roles.
        </p>
        {warnings.general && <p className="text-xs text-red-500 mb-4">{warnings.general}</p>}
        {success && <p className="text-xs text-green-500 mb-4">{success}</p>}

        {/* User Creation/Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-800 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="Email address"
              />
              {warnings.email && <p className="text-xs text-red-500 mt-1">{warnings.email}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-800 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="Username"
              />
              {warnings.username && <p className="text-xs text-red-500 mt-1">{warnings.username}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-800 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="First name"
              />
              {warnings.first_name && <p className="text-xs text-red-500 mt-1">{warnings.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-800 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                placeholder="Last name"
              />
              {warnings.last_name && <p className="text-xs text-red-500 mt-1">{warnings.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-800 mb-2">User Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            {warnings.role_id && <p className="text-xs text-red-500 mt-1">{warnings.role_id}</p>}
          </div>

          <div className="flex justify-end gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm font-medium rounded-sm transition-all duration-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-200 text-blue-800 hover:text-gray-800 hover:bg-gray-200 text-sm font-medium rounded-sm transition-all duration-300"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>

        {/* Users Table */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Existing Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-xs text-gray-800 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="bg-white border-b">
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.first_name || 'N/A'}</td>
                  <td className="px-6 py-4">{user.last_name || 'N/A'}</td>
                  <td className="px-6 py-4">{user.role?.name || 'No Role'}</td>
                  <td className="px-6 py-4 flex gap-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;