import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReportContext } from "../context/ReportContext";

const Dashboard = () => {
  const { reports } = useContext(ReportContext);
  const navigate = useNavigate();

  // When clicking on a report → go to map page + send coordinates
  const handleViewOnMap = (report) => {
    navigate("/map", {
      state: {
        lat: report.location.lat,
        lng: report.location.lng,
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Reports</h1>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div
            key={report._id}
            className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-200"
            onClick={() => handleViewOnMap(report)}
          >
            <h2 className="text-xl font-semibold">{report.title}</h2>
            <p>{report.description}</p>
            <p className="text-sm text-gray-600 mt-2">
              Lat: {report.location.lat} | Lng: {report.location.lng}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
