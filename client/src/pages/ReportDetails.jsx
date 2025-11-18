import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MapView from "../components/MapView";

export default function ReportDetails() {
  const { id } = useParams(); // get report id from URL
  const [report, setReport] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/reports/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error("Failed to fetch report", err);
      }
    };

    fetchReport();
  }, [id]);

  if (!report) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      
      <Link
        to="/reports"
        className="text-blue-600 underline mb-4 inline-block"
      >
        ← Back to Reports
      </Link>

      <h1 className="text-3xl font-semibold mb-2">{report.title}</h1>

      <p className="text-gray-700 mb-2"><strong>Severity:</strong> {report.severity}</p>
      <p className="text-gray-700 mb-2"><strong>Description:</strong> {report.description}</p>
      <p className="text-gray-700 mb-2"><strong>Location:</strong> {report.locationText}</p>

      <p className="text-gray-500 text-sm mt-2">
        Created: {new Date(report.createdAt).toLocaleString()}
      </p>

      {/* Map showing only this report */}
      {report.coords?.lat && report.coords?.lng && (
        <div className="mt-6">
          <MapView
            reports={[report]}       // only show this one marker
            focusCoords={report.coords} // zoom to this location
            height="400px"
          />
        </div>
      )}
    </div>
  );
}
