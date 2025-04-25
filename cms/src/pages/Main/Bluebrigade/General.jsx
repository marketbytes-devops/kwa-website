import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
<<<<<<< HEAD
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GeneralBlueBrigade = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // Default: Newest to Oldest
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [startDate, setStartDate] = useState(null); // Start date for filter
  const [endDate, setEndDate] = useState(null); // End date for filter
  const [useApiFiltering, setUseApiFiltering] = useState(false); // Toggle for API filtering

  // Status options
  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "accepted", label: "Accepted" },
    { value: "processing", label: "Processing" },
    { value: "return_for_review", label: "Return for Review" },
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const params = new URLSearchParams();
        params.append("department", "bluebrigade");
        params.append("complaint_type", "general");
        if (useApiFiltering) {
          params.append("ordering", sortOrder === "oldest" ? "date" : "-date");
          if (statusFilter) params.append("status", statusFilter);
          if (startDate) params.append("date__gte", startDate.toISOString().split("T")[0]);
          if (endDate) params.append("date__lte", endDate.toISOString().split("T")[0]);
        }

        const response = await apiClient.get(`/complaint/complaints/?${params.toString()}`);
        console.log("Fetched general complaints:", response.data);

        let filtered = response.data;
        if (!useApiFiltering) {
          filtered = response.data.filter(
            (complaint) =>
              complaint.complaint_type === "general" && complaint.department === "bluebrigade"
          );

          if (statusFilter) filtered = filtered.filter((complaint) => complaint.status === statusFilter);
          if (startDate) filtered = filtered.filter((complaint) => new Date(complaint.date) >= new Date(startDate));
          if (endDate) filtered = filtered.filter((complaint) => new Date(complaint.date) <= new Date(endDate));

          filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
          });
        }

        setComplaints(response.data);
        setFilteredComplaints(filtered);
      } catch (error) {
        console.error("Error fetching general complaints:", error);
      }
    };

    fetchComplaints();
  }, [sortOrder, statusFilter, startDate, endDate, useApiFiltering]);

  const clearFilters = () => {
    setSortOrder("newest");
    setStatusFilter("");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="pt-14 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">BlueBrigade General Complaints</h2>

      {/* Filter and Sort Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Status Filter */}
        <div className="flex items-center">
          <label className="mr-2 font-semibold w-16">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <label className="mr-2 font-semibold w-16">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select start date"
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2 font-semibold w-16">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select end date"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Sorting and Clear Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-4 py-2 rounded ${
                sortOrder === "oldest" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Oldest to Newest
            </button>
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-4 py-2 rounded ${
                sortOrder === "newest" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Newest to Oldest
            </button>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Ticket Number</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td className="py-2 px-4 border-b">{complaint.ticket_number}</td>
                <td className="py-2 px-4 border-b">{complaint.name}</td>
                <td className="py-2 px-4 border-b">{complaint.date}</td>
                <td className="py-2 px-4 border-b">{complaint.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
=======

const GeneralBlueBrigade = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    apiClient.get('/complaint/complaints/')
      .then(response => {
        const filteredComplaints = response.data.filter(
          complaint =>
            complaint.complaint_type === "general" &&
            complaint.department === "bluebrigade"
        );
        setComplaints(filteredComplaints);
      })
      .catch(error => {
        console.error("Error fetching general complaints:", error);
      });
  }, []);

  return (
    <div className="pt-14">
      <h2>BlueBrigade General Complaints</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ticket Number</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td className="py-2 px-4 border-b">{complaint.ticket_number}</td>
              <td className="py-2 px-4 border-b">{complaint.name}</td>
              <td className="py-2 px-4 border-b">{complaint.date}</td>
              <td className="py-2 px-4 border-b">{complaint.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> bd2194334f9f014588e4f9d550e05c92dfe26482
    </div>
  );
};

<<<<<<< HEAD
export default GeneralBlueBrigade;
=======
export default GeneralBlueBrigade;
>>>>>>> bd2194334f9f014588e4f9d550e05c92dfe26482
