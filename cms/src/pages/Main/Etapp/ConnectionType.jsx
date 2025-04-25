import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../../../api/apiClient';


const ConnectionType = () => {
  const [connectionType, setConnectionType] = useState('');
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fetch existing connection types on mount
  useEffect(() => {
    const fetchConnectionTypes = async () => {
      try {
        const response = await apiClient.get('/connectiontype/connection-types/');
        setConnectionTypes(response.data);
      } catch (err) {
        console.error('Failed to fetch connection types:', err);
        setError('Failed to load connection types.');
      }
    };

    fetchConnectionTypes();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setConnectionType(e.target.value);
    setError(null); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connectionType.trim()) {
      setError('Connection type cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/connectiontype/connection-types/', {
        name: connectionType.trim(),
      });
      setConnectionTypes([...connectionTypes, response.data]);
      setConnectionType('');
      showAlert('Connection type added successfully!', 'success');
    } catch (err) {
      console.error('Failed to add connection type:', err);
      const errorMsg = err.response?.data?.name?.[0] || 'Failed to add connection type.';
      setError(errorMsg);
      showAlert(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-14 p-4 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#00334d] mb-6">Add Connection Type</h1>

      {/* Add Connection Type Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label
            htmlFor="connectionType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Connection Type
          </label>
          <input
            type="text"
            id="connectionType"
            value={connectionType}
            onChange={handleInputChange}
            placeholder="e.g., Domestic, Non-Domestic, Special"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium text-white bg-[#00334d] rounded-md hover:bg-[#002a3f] focus:outline-none focus:ring-2 focus:ring-[#00334d] ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* List of Connection Types */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-[#00334d] mb-4">Existing Connection Types</h2>
        {connectionTypes.length === 0 ? (
          <p className="text-sm text-gray-500">No connection types found.</p>
        ) : (
          <ul className="space-y-2">
            {connectionTypes.map((type) => (
              <li
                key={type.id}
                className="text-sm text-gray-800 border-b border-gray-200 py-2"
              >
                {type.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionType;