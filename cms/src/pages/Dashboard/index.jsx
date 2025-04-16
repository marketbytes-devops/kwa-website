import React from 'react';

const Dashboard = () => {
  const kwaFeatures = [
    {
      title: "Water Usage Monitoring",
      description: "Track daily, weekly, and monthly water usage. Get insights on consumption patterns and efficiency recommendations."
    },
    {
      title: "Bill Management",
      description: "View and manage water bills, make online payments, and download past invoices for reference."
    },
    {
      title: "Service Requests",
      description: "Raise service requests for water supply issues, leaks, or meter-related concerns. Track request status in real-time."
    },
    {
      title: "Complaint Management",
      description: "Lodge complaints regarding water quality, supply issues, or infrastructure maintenance. Receive timely updates on resolutions."
    },
    {
      title: "Water Quality Reports",
      description: "Access water quality reports and real-time updates on purity levels and chemical compositions."
    },
    {
      title: "User Profile & Support",
      description: "Manage user profiles, update contact details, and access customer support for assistance."
    }
  ];

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
        Kerala Water Authority Dashboard
      </h1>
      <p className="text-sm text-gray-600 mb-8 max-w-3xl leading-relaxed">
        Welcome to the Kerala Water Authority Dashboard. Monitor water usage, manage bills, request services, and stay updated with the latest water quality reports.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kwaFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {feature.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;