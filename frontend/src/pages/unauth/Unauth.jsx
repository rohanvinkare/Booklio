import React from 'react'

const UnauthPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Unauthorized</h1>
      <p className="text-gray-600 mt-4">
        You do not have permission to access this page.
      </p>
    </div>
  );
};

export default UnauthPage;
