 import React, { createContext, useState, useEffect } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/reports');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setReports(data);
      } else if (data.reports && Array.isArray(data.reports)) {
        // In case API returns { reports: [...] }
        setReports(data.reports);
      } else {
        console.warn('API returned unexpected format:', data);
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message);
      setReports([]); // Always ensure reports is an array
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData) => {
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newReport = await response.json();
      setReports((prevReports) => [...prevReports, newReport]);
      return newReport;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, loading, error, fetchReports }}>
      {children}
    </ReportContext.Provider>
  );
};
