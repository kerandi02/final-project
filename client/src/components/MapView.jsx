 import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ReportContext } from "../context/ReportContext"; 

const MapView = ({ targetCoords }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);

  // Fetch all reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/reports");
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setReports(data);
        } else if (data.reports && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else {
          console.warn('API returned unexpected format:', data);
          setReports([]);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError(error.message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Auto-zoom if targetCoords is provided
  useEffect(() => {
    if (targetCoords && mapRef.current) {
      mapRef.current.setView(
        [targetCoords.lat, targetCoords.lng],
        16
      );
    }
  }, [targetCoords]);

  // Marker color selector
  const getMarkerColor = (type) => {
    switch (type?.toLowerCase()) {
      case "health":
        return "red";
      case "environment":
        return "green";
      case "security":
        return "blue";
      default:
        return "gray";
    }
  };

  // Create colored icon
  const createCustomIcon = (color) =>
    new L.Icon({
      iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -40],
    });

  // Show loading state
  if (loading) {
    return (
      <div style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Loading map...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p className="text-red-600">Error loading map: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* All report markers */}
        {Array.isArray(reports) && reports.length > 0 &&
          reports
            .filter(
              (report) =>
                report.latitude !== undefined &&
                report.longitude !== undefined &&
                !isNaN(report.latitude) &&
                !isNaN(report.longitude)
            )
            .map((report, index) => (
              <Marker
                key={report._id || index}
                position={[report.latitude, report.longitude]}
                icon={createCustomIcon(getMarkerColor(report.type))}
                eventHandlers={{
                  click: () => setSelectedReport(report),
                }}
              />
            ))}

        {/* Popup for selected marker */}
        {selectedReport && (
          <Popup
            position={[selectedReport.latitude, selectedReport.longitude]}
            onClose={() => setSelectedReport(null)}
          >
            <div>
              <h3>{selectedReport.title || "Untitled Report"}</h3>
              <p>
                <strong>Type:</strong> {selectedReport.type}
              </p>
              <p>{selectedReport.description}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;