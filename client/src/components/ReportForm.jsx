 import { useState, useEffect } from "react";
import axios from "axios";

export default function ReportForm({ onNewReport, defaultCoords }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // Whenever map click sends new coords, update form automatically
  useEffect(() => {
    if (defaultCoords) {
      setCoords(defaultCoords);
    }
  }, [defaultCoords]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const newReport = {
      title,
      description,
      locationText,
      severity,
      coords,
    };

    try {
      const res = await axios.post(`${API_BASE}/api/reports`, newReport);
      onNewReport(res.data); // Update map immediately
      // Reset form
      setTitle("");
      setDescription("");
      setLocationText("");
      setSeverity("Low");
      setCoords({ lat: "", lng: "" });
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Report</h2>

      <div>
        <label className="block text-gray-700 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Location Description</label>
        <input
          type="text"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Latitude</label>
          <input
            type="text"
            value={coords.lat || ""}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Longitude</label>
          <input
            type="text"
            value={coords.lng || ""}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </form>
  );
}
