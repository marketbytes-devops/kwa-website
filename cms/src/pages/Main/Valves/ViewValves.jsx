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

  useEffect(() => {
    const fetchValves = async () => {
      try {
        const query = useApiFiltering && searchQuery ? `?name=${encodeURIComponent(searchQuery)}` : "";
        const response = await apiClient.get(`/valve/valves/${query}`);
        console.log("Fetched valves:", response.data);
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

  const calculatePercentage = (valve) => {
    const e = Math.E; // Euler's number
    const n = parseFloat(valve.current_condition) || 0; // Number of threads opened
    const N = parseFloat(valve.full_open_condition) || 100; // Total number of threads
    const k = parseFloat(valve.steepness) || 12.5; // Steepness factor
    const x0 = parseFloat(valve.mid_point) || 0.5; // Mid-point
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
        console.log("Fetched logs:", response.data);
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
    <div className="pt-14">
      <h2 className="text-2xl font-bold mb-4">Valve List</h2>
      {/* Search Input */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by valve name"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full max-w-md"
        />
        <button
          onClick={clearSearch}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Clear Search
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-gray-300 text-left">Name</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Size</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Full Open Condition</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Current Condition</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Mid-point</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Steepness</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Remarks</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Previous Position</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Opening %</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Location</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredValves.map((valve) => (
              <tr key={valve.id}>
                <td className="py-2 px-4 border border-gray-300">{valve.name}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.size}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.full_open_condition}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.current_condition}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.mid_point}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.steepness}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.remarks}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.previous_position || 'No Previous Position'}</td>
                <td className="py-2 px-4 border border-gray-300">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-300 h-2.5 rounded-full"
                      style={{ width: `${calculatePercentage(valve)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{calculatePercentage(valve)}%</span>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    onClick={() => handleViewMap(valve)}
                    className="text-blue-500 underline"
                  >
                    View Map
                  </button>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    onClick={() => handleViewDetails(valve)}
                    className="text-blue-500 underline mr-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(valve.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Card */}
      {selectedValve && !showLogs && (
        <div className="fixed inset-x-0 top-1/4 flex justify-center items-center p-6 bg-white rounded-lg shadow-xl text-black border border-gray-300 max-w-lg mx-auto">
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4">Valve Details</h3>
            {validationError && (
              <div className="text-red-500 text-sm mb-4">{validationError}</div>
            )}
            <p className="mb-2"><strong>Name:</strong> {selectedValve.name}</p>
            <p className="mb-2"><strong>Size:</strong> {selectedValve.size}</p>
            <p className="mb-2"><strong>Full Open Condition:</strong> {selectedValve.full_open_condition}</p>
            <p className="mb-2">
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
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                selectedValve.current_condition
              )}
            </p>
            <p className="mb-2">
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
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                selectedValve.mid_point
              )}
            </p>
            <p className="mb-2">
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
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                selectedValve.steepness
              )}
            </p>
            <p className="mb-2">
              <strong>Remarks:</strong>{" "}
              {editingValve?.id === selectedValve.id ? (
                <input
                  type="text"
                  value={editingValve.remarks}
                  onChange={(e) =>
                    setEditingValve({ ...editingValve, remarks: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                selectedValve.remarks
              )}
            </p>
            <p className="mb-2"><strong>Previous Position:</strong> {selectedValve.previous_position || 'No Previous Position'}</p>

            <div className="mt-6 space-x-4 flex justify-end">
              {editingValve?.id === selectedValve.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(selectedValve.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={!!validationError}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingValve(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingValve(selectedValve)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleViewLog(selectedValve.id)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                View Log
              </button>
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Logs Card */}
      {showLogs && (
        <div className="fixed inset-x-0 top-1/4 flex justify-center items-center p-6 bg-white rounded-lg shadow-xl text-black border border-gray-300 max-w-md mx-auto">
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4">Update Logs</h3>
            <ul className="list-disc pl-5 mb-4">
              {(showAllLogs ? logs : logs.slice(0, 5)).map((log) => (
                <li key={log.id} className="mb-2 text-sm">
                  {`${log.changed_field} updated from "${log.old_value}" to "${log.new_value}" on ${new Date(log.timestamp).toLocaleString()}`}
                </li>
              ))}
            </ul>
            {logs.length > 5 && (
              <button
                onClick={toggleShowAllLogs}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
              >
                {showAllLogs ? "Show Less" : "Read More"}
              </button>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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