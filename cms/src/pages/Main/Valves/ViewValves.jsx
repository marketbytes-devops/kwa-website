import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

const ViewValves = () => {
  const [valves, setValves] = useState([]);
  const [selectedValve, setSelectedValve] = useState(null);
  const [editingValve, setEditingValve] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);

  useEffect(() => {
    const fetchValves = async () => {
      try {
        const response = await apiClient.get("/valve/valves/");
        setValves(response.data);
      } catch (error) {
        console.error("Error fetching valve data:", error);
      }
    };

    fetchValves();
  }, []);

  const calculatePercentage = (valve) => {
    const DEFAULT_FULL_OPEN = 100;
    const current = parseFloat(valve.current_condition) || 0;
    const fullOpen = isNaN(parseFloat(valve.full_open_condition))
      ? DEFAULT_FULL_OPEN
      : parseFloat(valve.full_open_condition);
    if (fullOpen === 0) return 0;
    return Math.min(Math.max((current / fullOpen) * 100, 0), 100).toFixed(1);
  };

  const handleViewDetails = (valve) => {
    setSelectedValve(valve);
    setShowLogs(false);
    setShowAllLogs(false);
  };

  const handleClosePopup = () => {
    setSelectedValve(null);
    setEditingValve(null);
    setShowLogs(false);
    setShowAllLogs(false);
  };

  const handleUpdate = (valveId) => {
    const updatedValve = {
      ...editingValve,
      current_condition: editingValve.current_condition,
      remarks: editingValve.remarks,
    };

    apiClient
      .put(`/valve/valves/${valveId}/`, updatedValve)
      .then((response) => {
        setValves(valves.map((valve) =>
          valve.id === valveId ? response.data : valve
        ));
        setEditingValve(null);
        setSelectedValve(response.data);
        handleViewLog(valveId);
      })
      .catch((error) => {
        console.error("Error updating valve:", error);
      });
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
      });
  };

  const handleViewMap = (valve) => {
    const { location_link, latitude, longitude } = valve;
    let url;
    if (location_link) {
      // Use location_link if available
      url = location_link;
    } else if (latitude !== null && longitude !== null) {
      // Fallback to latitude and longitude
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

  return (
    <div className="pt-14">
      <h2 className="text-2xl font-bold mb-4">Valve List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-gray-300 text-left">Name</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Size</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Full Open Condition</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Current Condition</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Remarks</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Previous Position</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Opening %</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Location</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {valves.map((valve) => (
              <tr key={valve.id}>
                <td className="py-2 px-4 border border-gray-300">{valve.name}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.size}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.full_open_condition}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.current_condition}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.remarks}</td>
                <td className="py-2 px-4 border border-gray-300">{valve.previous_position}</td>
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
                    className="text-blue-500 underline"
                  >
                    View Details
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
            <p className="mb-2"><strong>Name:</strong> {selectedValve.name}</p>
            <p className="mb-2"><strong>Size:</strong> {selectedValve.size}</p>
            <p className="mb-2"><strong>Full Open Condition:</strong> {selectedValve.full_open_condition}</p>
            <p className="mb-2">
              <strong>Current Condition:</strong>{" "}
              {editingValve?.id === selectedValve.id ? (
                <input
                  type="text"
                  value={editingValve.current_condition}
                  onChange={(e) =>
                    setEditingValve({ ...editingValve, current_condition: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                selectedValve.current_condition
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
            <p className="mb-2"><strong>Previous Position:</strong> {selectedValve.previous_position}</p>

            <div className="mt-6 space-x-4 flex justify-end">
              {editingValve?.id === selectedValve.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(selectedValve.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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