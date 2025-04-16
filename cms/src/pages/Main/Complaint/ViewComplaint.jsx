import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { useAlert } from "../../../context/AlertContext";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    // Fetch the list of complaints from the backend
    apiClient.get('/complaint/complaints/')
      .then(response => {
        setComplaints(response.data);
      })
      .catch(error => {
        console.error("Error fetching complaints:", error);
      });
  }, []);

  const handleStatusChange = (complaintId, newStatus) => {
    // Update the status of the complaint in the backend
    apiClient.patch(`/complaint/complaints/${complaintId}/`, { status: newStatus })
      .then(response => {
        setComplaints(complaints.map(complaint =>
          complaint.id === complaintId ? response.data : complaint
        ));
        showAlert("Status updated successfully!");
      })
      .catch(error => {
        console.error("Error updating complaint status:", error);
      });
  };

  return (
    <div className="pt-14">
      <h2>View Complaints</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Serial No</th>
            <th className="py-2 px-4 border-b">Ticket Number</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Phone Number</th>
            <th className="py-2 px-4 border-b">Department</th>
            <th className="py-2 px-4 border-b">Complaint Type</th> {/* New Column */}
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td className="py-2 px-4 border-b">{complaint.serial_no}</td>
              <td className="py-2 px-4 border-b">{complaint.ticket_number}</td>
              <td className="py-2 px-4 border-b">{complaint.name}</td>
              <td className="py-2 px-4 border-b">{complaint.date}</td>
              <td className="py-2 px-4 border-b">{complaint.address}</td>
              <td className="py-2 px-4 border-b">{complaint.phone_number}</td>
              <td className="py-2 px-4 border-b">{complaint.department}</td>
              <td className="py-2 px-4 border-b">{complaint.complaint_type}</td> {/* Display Complaint Type */}
              <td className="py-2 px-4 border-b">
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  className="border p-2"
                >
                  <option value="completed">Completed</option>
                  <option value="accepted">Accepted</option>
                  <option value="pending">Pending Acceptance</option>
                  <option value="processing">Processing</option>
                  <option value="return_for_review">Returned for Review</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewComplaints;
