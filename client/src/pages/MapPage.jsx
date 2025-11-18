 import React from "react";
import { useLocation } from "react-router-dom";
import MapView from "../components/MapView";

const MapPage = () => {
  const location = useLocation();

  // Receive coordinates from Dashboard
  const targetCoords = location.state || null;

  return (
    <div className="min-h-screen">
      <MapView targetCoords={targetCoords} />
    </div>
  );
};

export default MapPage;
