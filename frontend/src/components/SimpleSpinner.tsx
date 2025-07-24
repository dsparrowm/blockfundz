import React from 'react';

const SimpleSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );
};

export default SimpleSpinner;