import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";

const Area = () => {
  const [areaName, setAreaName] = useState("");
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Added success state for feedback

  // Fetch existing areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await apiClient.get("/area/add-area/");
        setAreas(response.data);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setError("Failed to load areas.");
      }
    };

    fetchAreas();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setAreaName(e.target.value);
    setError(null); // Clear error on input change
    setSuccess(null); // Clear success message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!areaName.trim()) {
      setError("Area name cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null); 
    setSuccess(null); 

    try {
      const response = await apiClient.post("/area/add-area/", {
        area_name: areaName.trim(),
      });
      setAreas([...areas, response.data]);
      setAreaName("");
      setSuccess("Area added successfully!");
    } catch (err) {
      console.error("Failed to add area:", err);
      const errorMsg =
        err.response?.data?.area_name?.[0] || "Failed to add area.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (areaId) => {
    if (window.confirm("Are you sure you want to delete this area?")) {
      try {
        await apiClient.delete(`/area/add-area/${areaId}/`);
        setAreas(areas.filter((area) => area.id !== areaId));
        setSuccess("Area deleted successfully!"); 
        setError(null); 
      } catch (err) {
        console.error("Error deleting area:", err);
        const errorMsg = err.response?.data?.detail || "Failed to delete area.";
        setError(errorMsg);
        setSuccess(null); 
      }
    }
  };

  return (
    <div className="mt-14 p-4 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#00334d] mb-6">Add Area</h1>

      {/* Add Area Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <div className="mb-4">
          <label
            htmlFor="areaName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Area Name
          </label>
          <input
            type="text"
            id="areaName"
            value={areaName}
            onChange={handleInputChange}
            placeholder="e.g., Downtown, Suburb"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00334d] text-sm"
            disabled={loading}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium text-white bg-[#00334d] rounded-md hover:bg-[#002a3f] focus:outline-none focus:ring-2 focus:ring-[#00334d] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {/* List of Areas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-[#00334d] mb-4">
          Existing Areas
        </h2>
        {areas.length === 0 ? (
          <p className="text-sm text-gray-500">No areas found.</p>
        ) : (
          <ul className="space-y-2">
            {areas.map((area) => (
              <li
                key={area.id}
                className="flex justify-between items-center text-sm text-gray-800 border-b border-gray-200 py-2"
              >
                <span>{area.area_name}</span>
                <button
                  onClick={() => handleDelete(area.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Area;