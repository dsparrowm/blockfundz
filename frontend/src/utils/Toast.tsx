import React from 'react';
import { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
    type: 'success' | 'error';
    message: string;
    duration?: number;
    onClose: () => void;
}

const Toast = ({ type, message, duration = 3000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`
      fixed top-5 left-1/2 -translate-x-1/2 min-w-[300px] max-w-[90%]
      p-4 rounded-lg shadow-lg flex items-center z-50 animate-slide-in
      ${type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'}
    `}>
            <div className="flex items-center w-full">
                <div className={`mr-3 text-xl ${type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>

                <div className="flex-1 pr-2 text-sm">
                    {message}
                </div>

                <button
                    onClick={onClose}
                    className="p-1 hover:opacity-80 transition-opacity"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default Toast;