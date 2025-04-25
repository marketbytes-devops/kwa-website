import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ViewApplication = () => {
  const [conversions, setConversions] = useState([]);
  const [filteredConversions, setFilteredConversions] = useState([]);
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filters, setFilters] = useState({
    from_connection_type: '',
    to_connection_type: '',
    area: '',
    status: '',
    date_from: null,
    date_to: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useApiFiltering, setUseApiFiltering] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editConversion, setEditConversion] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    address: '',
    file_number: '',
    area: '',
    from_connection_type: '',
    to_connection_type: '',
    status: '',
  });
  const [editErrors, setEditErrors] = useState({});

  const statusOptions = [
    { value: 'assistant_engineer', label: 'Assistant Engineer' },
    { value: 'fo', label: 'FO' },
    { value: 'site_inspector', label: 'Site Inspector' },
    { value: 'completed', label: 'Completed' },
  ];

  // Fetch conversions and connection types
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (useApiFiltering) {
          if (filters.from_connection_type) queryParams.append('from_connection_type', filters.from_connection_type);
          if (filters.to_connection_type) queryParams.append('to_connection_type', filters.to_connection_type);
          if (filters.area) queryParams.append('area', filters.area);
          if (filters.status) queryParams.append('status', filters.status);
          if (filters.date_from) queryParams.append('date_gte', filters.date_from.toISOString().split('T')[0]);
          if (filters.date_to) queryParams.append('date_lte', filters.date_to.toISOString().split('T')[0]);
          if (searchQuery) queryParams.append('name', searchQuery);
          queryParams.append('ordering', sortOrder === 'asc' ? 'created_at' : '-created_at');
        }

        const conversionsResponse = await apiClient.get(
          `/conversion/conversions/${useApiFiltering ? `?${queryParams.toString()}` : ''}`
        );
        console.log('Conversions response:', conversionsResponse.data);
        setConversions(conversionsResponse.data);
        setFilteredConversions(conversionsResponse.data);

        const typesResponse = await apiClient.get('/connectiontype/connection-types/');
        console.log('Connection types response:', typesResponse.data);
        setConnectionTypes(typesResponse.data);

        const uniqueAreas = [...new Set(conversionsResponse.data.map(conv => conv.area))];
        setAreas(uniqueAreas);

        setError('');
      } catch (err) {
        console.error('Failed to fetch data:', err);
        const errorMsg =
          err.response?.data?.detail ||
          'Failed to load conversions or connection types. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, searchQuery, sortOrder, useApiFiltering]);

  // Apply client-side filters and sorting
  useEffect(() => {
    if (useApiFiltering) return;

    let filtered = conversions;

    if (filters.from_connection_type) {
      filtered = filtered.filter(conv => conv.from_connection_type === parseInt(filters.from_connection_type));
    }
    if (filters.to_connection_type) {
      filtered = filtered.filter(conv => conv.to_connection_type === parseInt(filters.to_connection_type));
    }
    if (filters.area) {
      filtered = filtered.filter(conv => conv.area === filters.area);
    }
    if (filters.status) {
      filtered = filtered.filter(conv => conv.status === filters.status);
    }
    if (filters.date_from) {
      filtered = filtered.filter(conv => new Date(conv.created_at) >= new Date(filters.date_from));
    }
    if (filters.date_to) {
      filtered = filtered.filter(conv => new Date(conv.created_at) <= new Date(filters.date_to));
    }
    if (searchQuery) {
      filtered = filtered.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    let sorted = [...filtered];
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredConversions(sorted);
  }, [filters, searchQuery, sortOrder, conversions, useApiFiltering]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle date filter changes
  const handleDateFilterChange = (date, name) => {
    setFilters(prev => ({ ...prev, [name]: date }));
  };

  // Toggle date sorting
  const toggleDateSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Clear filters and sort
  const clearFiltersAndSort = () => {
    setFilters({
      from_connection_type: '',
      to_connection_type: '',
      area: '',
      status: '',
      date_from: null,
      date_to: null,
    });
    setSearchQuery('');
    setSortOrder('asc');
  };

  // Handle status change in table
  const handleStatusChange = async (conversionId, newStatus) => {
    try {
      const response = await apiClient.patch(`/conversion/conversions/${conversionId}/`, { status: newStatus });
      setConversions(prev => prev.map(conv =>
        conv.id === conversionId ? { ...conv, status: newStatus } : conv
      ));
      setFilteredConversions(prev => prev.map(conv =>
        conv.id === conversionId ? { ...conv, status: newStatus } : conv
      ));
      toast.success('Status updated successfully!');
    } catch (err) {
      console.error('Failed to update status:', err);
      const errorMsg =
        err.response?.data?.detail ||
        'Failed to update status.';
      toast.error(errorMsg);
    }
  };

  // Open edit modal
  const openEditModal = (conversion) => {
    setEditConversion(conversion);
    setEditFormData({
      id: conversion.id,
      name: conversion.name,
      address: conversion.address,
      file_number: conversion.file_number,
      area: conversion.area,
      from_connection_type: conversion.from_connection_type.toString(),
      to_connection_type: conversion.to_connection_type.toString(),
      status: conversion.status,
    });
    setEditErrors({});
    setEditModalOpen(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    setEditErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};
    if (!editFormData.name.trim()) newErrors.name = 'Name is required.';
    if (!editFormData.address.trim()) newErrors.address = 'Address is required.';
    if (!editFormData.file_number.trim()) newErrors.file_number = 'File number is required.';
    if (!editFormData.area.trim()) newErrors.area = 'Area is required.';
    if (!editFormData.from_connection_type) newErrors.from_connection_type = 'From connection type is required.';
    if (!editFormData.to_connection_type) newErrors.to_connection_type = 'To connection type is required.';
    if (!editFormData.status) newErrors.status = 'Status is required.';
    return newErrors;
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateEditForm();
    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: editFormData.name.trim(),
        address: editFormData.address.trim(),
        file_number: editFormData.file_number.trim(),
        area: editFormData.area.trim(),
        from_connection_type: parseInt(editFormData.from_connection_type),
        to_connection_type: parseInt(editFormData.to_connection_type),
        status: editFormData.status,
      };
      console.log('Updating conversion payload:', payload);
      const response = await apiClient.patch(`/conversion/conversions/${editFormData.id}/`, payload);

      setConversions(prev => prev.map(conv =>
        conv.id === editFormData.id ? { ...conv, ...response.data } : conv
      ));
      setFilteredConversions(prev => prev.map(conv =>
        conv.id === editFormData.id ? { ...conv, ...response.data } : conv
      ));

      setEditModalOpen(false);
      toast.success('Conversion updated successfully!');
    } catch (err) {
      console.error('Failed to update conversion:', err);
      const errorMsg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0]?.[0] ||
        'Failed to update conversion.';
      toast.error(errorMsg);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversion?')) return;

    try {
      await apiClient.delete(`/conversion/conversions/${id}/`);

      setConversions(prev => prev.filter(conv => conv.id !== id));
      setFilteredConversions(prev => prev.filter(conv => conv.id !== id));

      toast.success('Conversion deleted successfully!');
    } catch (err) {
      console.error('Failed to delete conversion:', err);
      const errorMsg =
        err.response?.data?.detail ||
        'Failed to delete conversion.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="mt-14 p-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#00334d] mb-6">View Conversion Applications</h1>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Search by Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="name"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                disabled={loading}
              />
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
          {/* From Connection Type Filter */}
          <div>
            <label htmlFor="from_connection_type" className="block text-sm font-medium text-gray-700 mb-2">
              From Connection Type
            </label>
            <select
              id="from_connection_type"
              name="from_connection_type"
              value={filters.from_connection_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
              disabled={loading}
            >
              <option value="">All From Types</option>
              {connectionTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          {/* To Connection Type Filter */}
          <div>
            <label htmlFor="to_connection_type" className="block text-sm font-medium text-gray-700 mb-2">
              To Connection Type
            </label>
            <select
              id="to_connection_type"
              name="to_connection_type"
              value={filters.to_connection_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
              disabled={loading}
            >
              <option value="">All To Types</option>
              {connectionTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          {/* Area Filter */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>
            <select
              id="area"
              name="area"
              value={filters.area}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
              disabled={loading}
            >
              <option value="">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
              disabled={loading}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Date From Filter */}
          <div>
            <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-2">
              Created From
            </label>
            <DatePicker
              id="date_from"
              selected={filters.date_from}
              onChange={date => handleDateFilterChange(date, 'date_from')}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
              disabled={loading}
            />
          </div>
          {/* Date To Filter */}
          <div>
            <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-2">
              Created To
            </label>
            <DatePicker
              id="date_to"
              selected={filters.date_to}
              onChange={date => handleDateFilterChange(date, 'date_to')}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
              disabled={loading}
            />
          </div>
        </div>
        <button
          onClick={clearFiltersAndSort}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#00334d] rounded-md hover:bg-[#002a3f] focus:outline-none focus:ring-2 focus:ring-[#00334d]"
        >
          Clear Filters & Sort
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-xl font-bold text-[#00334d] mb-4">Edit Conversion</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="edit_name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                />
                {editErrors.name && <p className="mt-2 text-sm text-red-600">{editErrors.name}</p>}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label htmlFor="edit_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="edit_address"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                />
                {editErrors.address && <p className="mt-2 text-sm text-red-600">{editErrors.address}</p>}
              </div>

              {/* File Number */}
              <div className="mb-4">
                <label htmlFor="edit_file_number" className="block text-sm font-medium text-gray-700 mb-2">
                  File Number
                </label>
                <input
                  type="text"
                  id="edit_file_number"
                  name="file_number"
                  value={editFormData.file_number}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                />
                {editErrors.file_number && <p className="mt-2 text-sm text-red-600">{editErrors.file_number}</p>}
              </div>

              {/* Area */}
              <div className="mb-4">
                <label htmlFor="edit_area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  id="edit_area"
                  name="area"
                  value={editFormData.area}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                />
                {editErrors.area && <p className="mt-2 text-sm text-red-600">{editErrors.area}</p>}
              </div>

              {/* From Connection Type */}
              <div className="mb-4">
                <label htmlFor="edit_from_connection_type" className="block text-sm font-medium text-gray-700 mb-2">
                  From Connection Type
                </label>
                <select
                  id="edit_from_connection_type"
                  name="from_connection_type"
                  value={editFormData.from_connection_type}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                >
                  <option value="">Select from connection type</option>
                  {connectionTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {editErrors.from_connection_type && <p className="mt-2 text-sm text-red-600">{editErrors.from_connection_type}</p>}
              </div>

              {/* To Connection Type */}
              <div className="mb-4">
                <label htmlFor="edit_to_connection_type" className="block text-sm font-medium text-gray-700 mb-2">
                  To Connection Type
                </label>
                <select
                  id="edit_to_connection_type"
                  name="to_connection_type"
                  value={editFormData.to_connection_type}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                >
                  <option value="">Select to connection type</option>
                  {connectionTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {editErrors.to_connection_type && <p className="mt-2 text-sm text-red-600">{editErrors.to_connection_type}</p>}
              </div>

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="edit_status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="edit_status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
                >
                  <option value="">Select status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {editErrors.status && <p className="mt-2 text-sm text-red-600">{editErrors.status}</p>}
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00334d] rounded-md hover:bg-[#002a3f] focus:outline-none focus:ring-2 focus:ring-[#00334d]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-600">Loading conversions...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          {filteredConversions.length === 0 ? (
            <p className="text-gray-600 text-sm">No conversions found.</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-[#00334d] text-white text-sm">
                  <th className="px-4 py-2 text-left">Sl No</th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer hover:bg-[#002a3f]"
                    onClick={toggleDateSort}
                  >
                    Created At {sortOrder === 'asc' ? '↑' : '↓'}
                  </th>
                  <th className="px-4 py-2 text-left">File No</th>
                  <th className="px-4 py-2 text-left">From Connection Type</th>
                  <th className="px-4 py-2 text-left">To Connection Type</th>
                  <th className="px-4 py-2 text-left">Area</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversions.map((conversion, index) => (
                  <tr
                    key={conversion.id}
                    className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{new Date(conversion.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{conversion.file_number}</td>
                    <td className="px-4 py-2">
                      {conversion.from_connection_type_detail?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-2">
                      {conversion.to_connection_type_detail?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-2">{conversion.area}</td>
                    <td className="px-4 py-2">{conversion.name}</td>
                    <td className="px-4 py-2">{conversion.address}</td>
                    <td className="px-4 py-2">
                      <select
                        value={conversion.status}
                        onChange={(e) => handleStatusChange(conversion.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00334d]"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => openEditModal(conversion)}
                        className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(conversion.id)}
                        className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewApplication;