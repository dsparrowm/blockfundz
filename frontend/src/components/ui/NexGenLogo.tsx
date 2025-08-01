import React from 'react';
import logoImage from '../../assets/icons/logo.png';

interface NexGenLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-18 h-18',
        '2xl': 'w-24 h-24'
    };

    const textSizeClasses = {
        sm: 'text-base',
        md: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
        '2xl': 'text-4xl'
    };

    const LogoIcon = () => {
        return (
            <img
                src={logoImage}
                alt="NexGen Logo"
                className={`${sizeClasses[size]} object-contain ${className}`}
            />
        );
    };

    const LogoText = () => (
        <span className={`font-bold ${textSizeClasses[size]} ${dark
            ? 'text-white'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
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
