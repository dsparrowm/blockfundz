import React from 'react';
import { Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center space-y-6 transform transition-all hover:scale-105">
        <div className="text-9xl font-extrabold text-blue-500 opacity-80">
          404
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600">
          The page you're looking for seems to have wandered off. Don't worry, it happens to the best of us.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() =>  navigate('/')} 
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </button>
        </div>
        <div className="text-xs text-gray-400 italic">
          Error code: 404 - Page Vanished into the Digital Abyss
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;