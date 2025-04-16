import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';

const Permissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [formData, setFormData] = useState({
    id: null, // For editing
    role_id: '',
    page: '',
    can_view: false,
    can_add: false,
    can_edit: false,
    can_delete: false,
    is_login_page: false,
  });
  const [warnings, setWarnings] = useState({
    role_id: '',
    page: '',
    general: '',
  });
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pages = [
    'dashboard',
    'profile',
    'user_management',
    'role',
    'permission',
    'complaints',
    'valves',
    'area',
    'flows',
    'bluebrigade',
    'runningcontract',
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const rolesResponse = await apiClient.get('/auth/roles/');
        setRoles(rolesResponse.data);

        const permissionsResponse = await apiClient.get('/auth/permissions/list/');
        setPermissions(permissionsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setWarnings({
          ...warnings,
          general: 'Failed to fetch data. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setWarnings({ ...warnings, [name]: '', general: '' });
    setSuccess('');
  };

  const validateForm = () => {
    let hasError = false;
    const newWarnings = { role_id: '', page: '', general: '' };

    if (!formData.role_id) {
      newWarnings.role_id = 'Role is required';
      hasError = true;
    }
    if (!formData.page) {
      newWarnings.page = 'Page is required';
      hasError = true;
    }
    if (formData.is_login_page && !formData.can_view) {
      newWarnings.general = 'Login page requires view permission';
      hasError = true;
    }

    setWarnings(newWarnings);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      role: formData.role_id,
      page: formData.page,
      can_view: formData.can_view,
      can_add: formData.can_add,
      can_edit: formData.can_edit,
      can_delete: formData.can_delete,
      is_login_page: formData.is_login_page,
    };

    try {
      if (isEditing) {
        await apiClient.put(`/auth/permissions/${formData.id}/`, data);
        setSuccess('Permission updated successfully');
      } else {
        await apiClient.post('/auth/permissions/', data);
        setSuccess('Permission created successfully');
      }

      resetForm();
      const permissionsResponse = await apiClient.get('/auth/permissions/list/');
      setPermissions(permissionsResponse.data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        (error.response?.status === 400 && error.response?.data?.non_field_errors
          ? error.response.data.non_field_errors[0]
          : 'Failed to save permission. Please try again.');
      setWarnings({
        ...warnings,
        general: errorMsg,
      });
    }
  };

  const handleEdit = (permission) => {
    setFormData({
      id: permission.id,
      role_id: permission.role,
      page: permission.page,
      can_view: permission.can_view,
      can_add: permission.can_add,
      can_edit: permission.can_edit,
      can_delete: permission.can_delete,
      is_login_page: permission.is_login_page,
    });
    setIsEditing(true);
    setWarnings({ role_id: '', page: '', general: '' });
    setSuccess('');
  };

  const handleDelete = async (permissionId) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await apiClient.delete(`/auth/permissions/${permissionId}/`);
        setSuccess('Permission deleted successfully');
        setPermissions(permissions.filter((p) => p.id !== permissionId));
      } catch (error) {
        setWarnings({
          ...warnings,
          general: error.response?.data?.error || 'Failed to delete permission. Please try again.',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      role_id: '',
      page: '',
      can_view: false,
      can_add: false,
      can_edit: false,
      can_delete: false,
      is_login_page: false,
    });
    setIsEditing(false);
    setWarnings({ role_id: '', page: '', general: '' });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full p-8 bg-transparent">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Permissions Management</h1>
        <p className="text-xs text-gray-800 mb-8">Assign permissions to roles for different pages.</p>
        {warnings.general && <p className="text-xs text-red-500 mb-4">{warnings.general}</p>}
        {success && <p className="text-xs text-green-500 mb-4">{success}</p>}
        {isLoading && <p className="text-xs text-gray-500 mb-4">Loading...</p>}
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-800 mb-2">Role</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                disabled={isLoading}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {warnings.role_id && <p className="text-xs text-red-500 mt-1">{warnings.role_id}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-800 mb-2">Page</label>
              <select
                name="page"
                value={formData.page}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
                disabled={isLoading}
              >
                <option value="">Select Page</option>
                {pages.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
              {warnings.page && <p className="text-xs text-red-500 mt-1">{warnings.page}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="can_view"
                checked={formData.can_view}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-xs text-gray-800">Can View</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="can_add"
                checked={formData.can_add}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-xs text-gray-800">Can Add</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="can_edit"
                checked={formData.can_edit}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-xs text-gray-800">Can Edit</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="can_delete"
                checked={formData.can_delete}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-xs text-gray-800">Can Delete</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_login_page"
                checked={formData.is_login_page}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-xs text-gray-800">Login Page</label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-sm transition-all duration-300"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-200 text-blue-800 hover:text-gray-800 hover:bg-gray-200 text-sm font-medium rounded-sm transition-all duration-300"
              disabled={isLoading}
            >
              {isEditing ? 'Update Permission' : 'Create Permission'}
            </button>
          </div>
        </form>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Existing Permissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-xs text-gray-800 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Page</th>
                <th className="px-6 py-3">Can View</th>
                <th className="px-6 py-3">Can Add</th>
                <th className="px-6 py-3">Can Edit</th>
                <th className="px-6 py-3">Can Delete</th>
                <th className="px-6 py-3">Login Page</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Loading permissions...
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No permissions found.
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="bg-white border-b">
                    <td className="px-6 py-4">
                      {roles.find((r) => r.id === permission.role)?.name || 'Unknown Role'}
                    </td>
                    <td className="px-6 py-4">{permission.page || 'N/A'}</td>
                    <td className="px-6 py-4">{permission.can_view ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4">{permission.can_add ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4">{permission.can_edit ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4">{permission.can_delete ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4">{permission.is_login_page ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 space-x-8">
                      <button
                        onClick={() => handleEdit(permission)}
                        className="text-blue-500 hover:underline"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(permission.id)}
                        className="text-red-500 hover:underline"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Permissions;