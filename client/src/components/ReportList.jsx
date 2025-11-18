import React, { useContext } from 'react';
import { ReportContext } from '../context/ReportContext';

const ReportList = () => {
  const { reports } = useContext(ReportContext);

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report._id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
          <p className="text-gray-600 mt-1">{report.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">Location: {report.location}</span>
            <span className={`px-2 py-1 rounded text-sm ${
              report.severity === 'high' 
                ? 'bg-red-100 text-red-800'
                : report.severity === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;