import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { useAlert } from "../../../context/AlertContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // Default: Newest to Oldest
  const [startDate, setStartDate] = useState(null); // Start date for filter (using date)
  const [endDate, setEndDate] = useState(null); // End date for filter (using date)
  const [searchQuery, setSearchQuery] = useState(""); // Search by name
  const [departmentFilter, setDepartmentFilter] = useState(""); // Filter by department
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [departments, setDepartments] = useState([]); // Unique departments
  const { showAlert } = useAlert();
  const [useApiFiltering, setUseApiFiltering] = useState(false); // Toggle for API filtering

  // Status options
  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "accepted", label: "Accepted" },
    { value: "processing", label: "Processing" },
    { value: "return_for_review", label: "Return for Review" },
  ];

  // Fetch complaints and extract departments
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const params = new URLSearchParams();
        if (useApiFiltering) {
          params.append("ordering", sortOrder === "oldest" ? "date" : "-date");
          if (startDate) {
            params.append("date__gte", startDate.toISOString().split("T")[0]);
          }
          if (endDate) {
            params.append("date__lte", endDate.toISOString().split("T")[0]);
          }
          if (searchQuery) {
            params.append("name", searchQuery);
          }
          if (departmentFilter) {
            params.append("department", departmentFilter);
          }
          if (statusFilter) {
            params.append("status", statusFilter);
          }
        }

        const response = await apiClient.get(
          `/complaint/complaints/?${params.toString()}`
        );
        console.log("Fetched complaints:", response.data);
        setComplaints(response.data);
        setFilteredComplaints(response.data);

        // Extract unique departments
        const uniqueDepartments = [
          ...new Set(response.data.map((complaint) => complaint.department)),
        ];
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        showAlert("Failed to fetch complaints.", "error");
      }
    };

    fetchComplaints();
  }, [
    sortOrder,
    startDate,
    endDate,
    searchQuery,
    departmentFilter,
    statusFilter,
    useApiFiltering,
  ]);

  // Apply client-side filtering
  useEffect(() => {
    if (useApiFiltering) return;

    let filtered = complaints;

    if (searchQuery) {
      filtered = filtered.filter((complaint) =>
        complaint.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (departmentFilter) {
      filtered = filtered.filter(
        (complaint) => complaint.department === departmentFilter
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }
    if (startDate) {
      filtered = filtered.filter(
        (complaint) => new Date(complaint.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (complaint) => new Date(complaint.date) <= new Date(endDate)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });

    setFilteredComplaints(filtered);
  }, [
    complaints,
    searchQuery,
    departmentFilter,
    statusFilter,
    startDate,
    endDate,
    sortOrder,
    useApiFiltering,
  ]);

  const handleStatusChange = (complaintId, newStatus) => {
    apiClient
      .patch(`/complaint/complaints/${complaintId}/`, { status: newStatus })
      .then((response) => {
        setComplaints(
          complaints.map((complaint) =>
            complaint.id === complaintId ? response.data : complaint
          )
        );
        setFilteredComplaints(
          filteredComplaints.map((complaint) =>
            complaint.id === complaintId ? response.data : complaint
          )
        );
        showAlert("Status updated successfully!", "success");
      })
      .catch((error) => {
        console.error("Error updating complaint status:", error);
        showAlert("Failed to update status.", "error");
      });
  };

  const handleDelete = (complaintId) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      apiClient
        .delete(`/complaint/complaints/${complaintId}/`)
        .then(() => {
          setComplaints(
            complaints.filter((complaint) => complaint.id !== complaintId)
          );
          setFilteredComplaints(
            filteredComplaints.filter(
              (complaint) => complaint.id !== complaintId
            )
          );
          showAlert("Complaint deleted successfully!", "success");
        })
        .catch((error) => {
          console.error("Error deleting complaint:", error);
          showAlert("Failed to delete complaint.", "error");
        });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("");
    setStatusFilter("");
    setStartDate(null);
    setEndDate(null);
    setSortOrder("newest");
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="pt-14">
      <h2 className="text-2xl font-bold mb-4">View Complaints</h2>

      {/* Sort and Filter Controls */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Search by Name */}
        <div>
          <label className="mr-2 font-semibold">Search by Name:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter name"
            className="border p-2 rounded"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label className="mr-2 font-semibold">Department:</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="mr-2 font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter (using date) */}
        <div className="flex gap-2 items-center">
          <div>
            <label className="mr-2 font-semibold">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select start date"
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="mr-2 font-semibold">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select end date"
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Sorting Buttons */}
        <div>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`mr-2 px-4 py-2 rounded ${
              sortOrder === "oldest"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sort: Oldest to Newest
          </button>
          <button
            onClick={() => setSortOrder("newest")}
            className={`px-4 py-2 rounded ${
              sortOrder === "newest"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sort: Newest to Oldest
          </button>
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Serial No</th>
            <th className="py-2 px-4 border-b">Ticket Number</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Phone Number</th>
            <th className="py-2 px-4 border-b">Department</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="py-2 px-4 border-b">{complaint.serial_no}</td>
              <td className="py-2 px-4 border-b">{complaint.ticket_number}</td>
              <td className="py-2 px-4 border-b">{complaint.name}</td>
              <td className="py-2 px-4 border-b">{complaint.address}</td>
              <td className="py-2 px-4 border-b">{complaint.phone_number}</td>
              <td className="py-2 px-4 border-b">{complaint.department}</td>
              <td className="py-2 px-4 border-b">
                {formatDate(complaint.date)}
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={complaint.status}
                  onChange={(e) =>
                    handleStatusChange(complaint.id, e.target.value)
                  }
                  className="border p-2 rounded"
                >
                  <option value="completed">Completed</option>
                  <option value="accepted">Accepted</option>
                  <option value="processing">Processing</option>
                  <option value="return_for_review">Return for Review</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDelete(complaint.id)}
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
  );
};

export default ViewComplaints;
