import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-md text-sm font-medium ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          CommunityHealth
        </h1>

        <div className="flex space-x-4">

          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>

          <Link to="/reports" className={linkClasses("/reports")}>
            Report Symptoms
          </Link>

          <Link to="/dashboard" className={linkClasses("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/map" className={linkClasses("/map")}>
            Map Overview
          </Link>

        </div>
      </div>
    </nav>
  );
}
