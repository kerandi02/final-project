 import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import { Routes, Route } from "react-router-dom";
import { ReportProvider } from "./context/ReportContext";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import ReportDetails from "./pages/ReportDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <ReportProvider>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />

        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/report/:id" element={<ReportDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


          </Routes>
        </div>
      </div>
    </ReportProvider>
  );
}

export default App;