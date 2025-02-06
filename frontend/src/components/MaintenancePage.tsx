import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { logo } from '../assets/icons'

const MaintenancePage = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize state from localStorage if exists
    const storedEnd = localStorage.getItem('maintenanceEndTime');
    if (storedEnd) {
      const endTime = Number(storedEnd);
      return calculateTimeLeft(endTime);
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  const calculateTimeLeft = (endTime) => {
    const difference = endTime - Date.now();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };


  useEffect(() => {
    // Get or initialize end time
    let endTime = Number(localStorage.getItem('maintenanceEndTime'));
    if (!endTime || endTime < Date.now()) {
      endTime = Date.now() + 2 * 24 * 60 * 60 * 1000;
      localStorage.setItem('maintenanceEndTime', endTime.toString());
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endTime);
      setTimeLeft(newTimeLeft);

      if (Object.values(newTimeLeft).every(val => val === 0)) {
        localStorage.removeItem('maintenanceEndTime');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Under Maintenance - NexGen</title>
        <meta name="status" content="503" />
      </Helmet>

      <div className="max-w-2xl text-center">
        <div className="flex justify-center align-center mb-4">
          {/* <svg
            className="mx-auto h-16 w-16 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg> */}
          <img src={logo} alt="logo" width={70} height={70} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Scheduled Maintenance
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're upgrading our systems. Service will resume in:
        </p>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-center space-x-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-gray-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-gray-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-gray-500">Seconds</div>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            We apologize for the inconvenience.
            for any inquiry, contact{' '}
            <a
              href="mailto:support@crypto.com"
              className="text-orange-500 hover:underline"
            >
              support@nexgencrypto.live
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;