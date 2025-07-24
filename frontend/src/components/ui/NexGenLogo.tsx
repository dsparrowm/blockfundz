import React from 'react';

interface NexGenLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'full' | 'icon' | 'text';
    className?: string;
    showText?: boolean;
    dark?: boolean;
}

const NexGenLogo: React.FC<NexGenLogoProps> = ({
    size = 'md',
    variant = 'full',
    className = '',
    showText = true,
    dark = false
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl'
    };

    const LogoIcon = () => (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow ${className}`}>
            <svg
                viewBox="0 0 32 32"
                className="w-3/4 h-3/4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
            >
                {/* Stylized N */}
                <path d="M6 26V6h4l8 12V6h4v20h-4l-8-12v12H6z" fill="currentColor" stroke="none" />
                {/* Modern accent lines */}
                <path d="M24 8l4-2M24 12l4-2M24 16l4-2" strokeWidth="1.5" opacity="0.7" />
                {/* Bottom accent */}
                <path d="M6 28h20" strokeWidth="2" opacity="0.5" />
            </svg>
        </div>
    );

    const LogoText = () => (
        <span className={`font-bold ${textSizeClasses[size]} ${dark
                ? 'text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
            NexGen
        </span>
    );

    if (variant === 'icon') {
        return <LogoIcon />;
    }

    if (variant === 'text') {
        return <LogoText />;
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LogoIcon />
            {showText && <LogoText />}
        </div>
    );
};

export default NexGenLogo;
