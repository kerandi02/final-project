 import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReportForm from "../components/ReportForm";
import MapView from "../components/MapView";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [focusCoords, setFocusCoords] = useState(null);
  const [filter, setFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  // EDIT MODE STATE
  const [editReport, setEditReport] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/reports?limit=${LIMIT}&skip=${(page - 1) * LIMIT}`
      );

      setReports(res.data.reports || []);
      setHasMore(res.data.hasMore ?? false);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  // Create new report
  const handleNewReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleMapClick = (coords) => {
    setSelectedCoords(coords);
  };

  // ⭐ DELETE REPORT
  const handleDelete = async (id) => {
    if (!confirm("Delete this report?")) return;

    try {
      await axios.delete(`${API_BASE}/api/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete.");
    }
  };

  // ⭐ UPDATE REPORT
  const handleEditSave = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/reports/${editReport._id}`,
        editReport
      );

      setReports((prev) =>
        prev.map((r) => (r._id === res.data._id ? res.data : r))
      );

      setEditReport(null);
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update report.");
    }
  };

   const filteredReports =
  filter === "All"
    ? (reports || [])
    : (reports || []).filter((r) => r.severity === filter);

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      {/* FORM */}
      <div>
        <ReportForm onNewReport={handleNewReport} defaultCoords={selectedCoords} />
      </div>

      {/* RIGHT SIDE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Location Overview</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* LIST */}
        <div className="mb-4 max-h-48 overflow-y-auto border rounded-md p-2 bg-gray-50">
          {filteredReports.length === 0 && (
            <p className="text-sm text-gray-500">No reports found</p>
          )}

          {filteredReports.map((r) => (
            <div
              key={r._id}
              className="p-2 rounded mb-1 border hover:bg-blue-50"
            >
              <div className="flex justify-between">
                <div>
                  <strong>{r.title}</strong>{" "}
                  <span className="text-xs text-gray-600">({r.severity})</span>
                  <br />
                  <span className="text-sm">
                    {r.locationText || "No location"}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditReport(r)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
          >
            ◀ Previous
          </button>

          <span className="font-semibold">Page {page}</span>

          <button
            onClick={() => hasMore && setPage((p) => p + 1)}
            disabled={!hasMore}
            className={`px-3 py-1 rounded ${
              !hasMore ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
          >
            Next ▶
          </button>
        </div>

        {/* MAP */}
        <MapView
          reports={filteredReports}
          onMapClick={handleMapClick}
          focusCoords={focusCoords}
        />
      </div>

      {/* ⭐ EDIT MODAL ⭐ */}
      {editReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">

            <h3 className="text-xl font-semibold mb-4">Edit Report</h3>

            <label className="block mb-2">Title</label>
            <input
              className="border p-2 w-full mb-4"
              value={editReport.title}
              onChange={(e) =>
                setEditReport({ ...editReport, title: e.target.value })
              }
            />

            <label className="block mb-2">Severity</label>
            <select
              className="border p-2 w-full mb-4"
              value={editReport.severity}
              onChange={(e) =>
                setEditReport({ ...editReport, severity: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditReport(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
