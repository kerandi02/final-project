 import React from 'react';
import MapView from '../components/MapView';
import ReportForm from '../components/ReportForm';

const Home = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Submit New Report</h2>
          <ReportForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Location Overview</h2>
          <MapView />
        </div>
      </div>
    </div>
  );
};

export default Home;
