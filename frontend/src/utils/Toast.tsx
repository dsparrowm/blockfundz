import React from 'react';
import { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface ToastProps {
    type: 'success' | 'error' | 'warning';
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
                ? 'bg-em-green/10 border border-em-green/30 text-em-green'
                : type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]'}
    `}>
            <div className="flex items-center w-full">
                <div className={`mr-3 text-xl ${type === 'success' ? 'text-em-green' : type === 'error' ? 'text-red-500' : 'text-[#F59E0B]'
                    }`}>
                    {type === 'success' ? <FaCheckCircle /> : type === 'error' ? <FaTimesCircle /> : <FaExclamationTriangle />}
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