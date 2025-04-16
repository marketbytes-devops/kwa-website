import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

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
    </div>
  );
};

export default GeneralBlueBrigade;
