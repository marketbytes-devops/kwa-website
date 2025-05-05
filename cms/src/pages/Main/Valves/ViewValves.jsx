import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

const ViewValves = () => {
  const [valves, setValves] = useState([]);
  const [filteredValves, setFilteredValves] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValve, setSelectedValve] = useState(null);
  const [editingValve, setEditingValve] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [useApiFiltering, setUseApiFiltering] = useState(false);
  const [userPermissions, setUserPermissions] = useState({});
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    const fetchValves = async () => {
      try {
        const query = useApiFiltering && searchQuery ? `?name=${encodeURIComponent(searchQuery)}` : "";
        const response = await apiClient.get(`/valve/valves/${query}`);
        setValves(response.data);
        setFilteredValves(response.data);
      } catch (error) {
        console.error("Error fetching valve data:", error);
        alert("Failed to fetch valves.");
      }
    };

    fetchValves();
  }, [searchQuery, useApiFiltering]);

  useEffect(() => {
    if (useApiFiltering) return;

    let filtered = valves;
    if (searchQuery) {
      filtered = valves.filter(valve =>
        valve.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredValves(filtered);
  }, [valves, searchQuery, useApiFiltering]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const profileResponse = await apiClient.get('/auth/profile/');
        const user = profileResponse.data;
        setIsSuperadmin(user.is_superuser || user.role?.name === 'Superadmin');
        const roleId = user.role?.id;
        if (roleId) {
          const roleResponse = await apiClient.get(`/auth/roles/${roleId}/`);
          const permissions = roleResponse.data.permissions.find(perm => perm.page === 'valves');
          console.log("Fetched permissions:", permissions); // Debugging log
          setUserPermissions(permissions || {});
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };

    fetchUserPermissions();
  }, []);

  useEffect(() => {
    console.log('User permissions state:', userPermissions);
  }, [userPermissions]);

  const calculatePercentage = (valve) => {
    const e = Math.E;
    const n = parseFloat(valve.current_condition) || 0;
    const N = parseFloat(valve.full_open_condition) || 100;
    const k = parseFloat(valve.steepness) || 12.5;
    const x0 = parseFloat(valve.mid_point) || 0.5;
    const ratio = n / N - x0;
    const exponent = -k * ratio;
    const denominator = 1 + Math.pow(e, exponent);
    const percentage = denominator !== 0 ? (100 / denominator) : 0;
    return Math.min(Math.max(percentage, 0), 100).toFixed(1);
  };

  const handleViewDetails = (valve) => {
    setSelectedValve(valve);
    setShowLogs(false);
    setShowAllLogs(false);
    setValidationError("");
  };

  const handleClosePopup = () => {
    setSelectedValve(null);
    setEditingValve(null);
    setShowLogs(false);
    setShowAllLogs(false);
    setValidationError("");
  };

  const handleUpdate = (valveId) => {
    const fullOpen = parseFloat(editingValve.full_open_condition);
    const current = parseFloat(editingValve.current_condition);

    if (isNaN(current)) {
      setValidationError("Current condition must be a valid number.");
      return;
    }

    if (current > fullOpen) {
      setValidationError("Current condition must be less than or equal to full open condition.");
      return;
    }

    const updatedValve = {
      name: editingValve.name,
      size: editingValve.size,
      full_open_condition: editingValve.full_open_condition,
      current_condition: current || 0,
      mid_point: editingValve.mid_point,
      steepness: editingValve.steepness,
      remarks: editingValve.remarks,
      latitude: editingValve.latitude,
      longitude: editingValve.longitude,
    };

    apiClient
      .put(`/valve/valves/${valveId}/`, updatedValve)
      .then((response) => {
        setValves(valves.map((valve) =>
          valve.id === valveId ? response.data : valve
        ));
        setFilteredValves(filteredValves.map((valve) =>
          valve.id === valveId ? response.data : valve
        ));
        setEditingValve(null);
        setSelectedValve(response.data);
        setValidationError("");
        handleViewLog(valveId);
      })
      .catch((error) => {
        console.error("Error updating valve:", error);
        setValidationError("Failed to update valve.");
      });
  };

  const handleDelete = (valveId) => {
    console.log("User permissions:", userPermissions); // Debugging log
    if (!userPermissions.can_delete && !isSuperadmin) {
      alert("You do not have permission to delete valves.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this valve?")) {
      apiClient
        .delete(`/valve/valves/${valveId}/`)
        .then(() => {
          setValves(valves.filter((valve) => valve.id !== valveId));
          setFilteredValves(filteredValves.filter((valve) => valve.id !== valveId));
          handleClosePopup();
          alert("Valve deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting valve:", error);
          alert("Failed to delete valve.");
        });
    }
  };

  const handleViewLog = (valveId) => {
    apiClient
      .get(`/valve/logs/?valve_id=${valveId}`)
      .then((response) => {
        setLogs(response.data);
        setShowLogs(true);
        setSelectedValve(null);
        setShowAllLogs(false);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
        alert("Failed to fetch logs.");
      });
  };

  const handleViewMap = (valve) => {
    const { location_link, latitude, longitude } = valve;
    let url;
    if (location_link) {
      url = location_link;
    } else if (latitude !== null && longitude !== null) {
      url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } else {
      alert("No location data available for this valve.");
      return;
    }
    window.open(url, "_blank");
  };

  const toggleShowAllLogs = () => {
    setShowAllLogs(!showAllLogs);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="pt-14 px-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Valve List</h2>

      {/* Search Input */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by valve name"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:max-w-md transition-all duration-200"
        />
        <button
          onClick={clearSearch}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-all duration-200"
        >
          Clear Search
        </button>
      </div>

      {/* Valve Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Size</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Full Open Condition</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Current Condition</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Mid-point</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Steepness</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Remarks</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Previous Position</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Opening %</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredValves.map((valve) => (
              <tr key={valve.id} className="hover:bg-gray-50 transition-all duration-150">
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.name}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.size}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.full_open_condition}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.current_condition}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.mid_point}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.steepness}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.remarks}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{valve.previous_position || 'No Previous Position'}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${calculatePercentage(valve)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{calculatePercentage(valve)}%</span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm">
                  <button
                    onClick={() => handleViewMap(valve)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Map
                  </button>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm flex gap-2">
                  <button
                    onClick={() => handleViewDetails(valve)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-all duration-200"
                  >
                    View Details
                  </button>
                  {(userPermissions.can_delete || isSuperadmin) && (
                    <button
                      onClick={() => handleDelete(valve.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-all duration-200"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Card */}
      {selectedValve && !showLogs && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full border border-gray-200 transform transition-all duration-300 scale-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Valve Details</h3>
            {validationError && (
              <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{validationError}</div>
            )}
            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {selectedValve.name}</p>
              <p><strong>Size:</strong> {selectedValve.size}</p>
              <p><strong>Full Open Condition:</strong> {selectedValve.full_open_condition}</p>
              <p>
                <strong>Current Condition:</strong>{" "}
                {editingValve?.id === selectedValve.id ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={selectedValve.full_open_condition}
                    value={editingValve.current_condition}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditingValve({ ...editingValve, current_condition: value });
                      if (value && parseFloat(value) > parseFloat(selectedValve.full_open_condition)) {
                        setValidationError("Current condition must be less than or equal to full open condition.");
                      } else {
                        setValidationError("");
                      }
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                ) : (
                  selectedValve.current_condition
                )}
              </p>
              <p>
                <strong>Mid-point:</strong>{" "}
                {editingValve?.id === selectedValve.id ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={editingValve.mid_point}
                    onChange={(e) =>
                      setEditingValve({ ...editingValve, mid_point: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                ) : (
                  selectedValve.mid_point
                )}
              </p>
              <p>
                <strong>Steepness:</strong>{" "}
                {editingValve?.id === selectedValve.id ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editingValve.steepness}
                    onChange={(e) =>
                      setEditingValve({ ...editingValve, steepness: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                ) : (
                  selectedValve.steepness
                )}
              </p>
              <p>
                <strong>Remarks:</strong>{" "}
                {editingValve?.id === selectedValve.id ? (
                  <input
                    type="text"
                    value={editingValve.remarks}
                    onChange={(e) =>
                      setEditingValve({ ...editingValve, remarks: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                ) : (
                  selectedValve.remarks
                )}
              </p>
              <p><strong>Previous Position:</strong> {selectedValve.previous_position || 'No Previous Position'}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {editingValve?.id === selectedValve.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(selectedValve.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-all duration-200"
                    disabled={!!validationError}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingValve(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingValve(selectedValve)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-all duration-200"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleViewLog(selectedValve.id)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-all duration-200"
              >
                View Log
              </button>
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Logs Card */}
      {showLogs && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-200 transform transition-all duration-300 scale-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Update Logs</h3>
            <ul className="list-disc pl-5 mb-4 text-gray-700">
              {(showAllLogs ? logs : logs.slice(0, 5)).map((log) => (
                <li key={log.id} className="mb-2 text-sm">
                  {`${log.changed_field} updated from "${log.old_value}" to "${log.new_value}" on ${new Date(log.timestamp).toLocaleString()}`}
                </li>
              ))}
            </ul>
            {logs.length > 5 && (
              <button
                onClick={toggleShowAllLogs}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-all duration-200 mb-4"
              >
                {showAllLogs ? "Show Less" : "Read More"}
              </button>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewValves;
