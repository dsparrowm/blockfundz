import { Button } from '../ui/button';
import { TrendingUp, Shield, Check, DollarSign, Target, Bitcoin, Bell, Search, Settings, User, Menu, Home, Wallet, PieChart, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Hero = () => {
    const navigate = useNavigate();

    // Mouse animation states
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [animationStep, setAnimationStep] = useState(0);
    const [isClicking, setIsClicking] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

    // Text animation states
    const [visibleWords, setVisibleWords] = useState(0);
    const [showCursor, setShowCursor] = useState(false);
    const [gradientPosition, setGradientPosition] = useState(0);

    const heroWords = ["Grow", "your", "wealth", "with", "smart", "crypto", "investing"];
    const subWords = ["Share", "it.", "Invest", "it.", "Grow", "it.", "Side-by-side", "with", "AI-powered", "portfolio", "management."];

    // Hero text animations
    useEffect(() => {
        // Typewriter effect for main heading
        const typewriterInterval = setInterval(() => {
            setVisibleWords(prev => {
                if (prev < heroWords.length) {
                    return prev + 1;
                }
                clearInterval(typewriterInterval);
                return prev;
            });
        }, 300);

        // Blinking cursor
        // const cursorInterval = setInterval(() => {
        //     setShowCursor(prev => !prev);
        // }, 500);

        // Animated gradient background
        const gradientInterval = setInterval(() => {
            setGradientPosition(prev => (prev + 1) % 100);
        }, 100);

        return () => {
            clearInterval(typewriterInterval);
            // clearInterval(cursorInterval);
            clearInterval(gradientInterval);
        };
    }, []);

    // Dashboard demo animation sequence
    useEffect(() => {
        const sequence = async () => {
            // Step 1: Mouse moves to sidebar "Invest" (2s)
            setTimeout(() => {
                setMousePosition({ x: 15, y: 45 });
                setHighlightedElement('invest-nav');
                setAnimationStep(1);
            }, 2000);

            // Step 2: Click on Invest (3s)
            setTimeout(() => {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
            }, 4000);

            // Step 3: Mouse moves to Premium plan (5s)
            setTimeout(() => {
                setMousePosition({ x: 65, y: 60 });
                setHighlightedElement('premium-plan');
                setAnimationStep(2);
            }, 6000);

            // Step 4: Click on Premium plan (7s)
            setTimeout(() => {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
                setAnimationStep(3);
            }, 8000);

            // Step 5: Mouse moves to Subscribe button (9s)
            setTimeout(() => {
                setMousePosition({ x: 65, y: 72 });
                setHighlightedElement('subscribe-btn');
            }, 10000);

            // Step 6: Click Subscribe (11s)
            setTimeout(() => {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
                setAnimationStep(4);
            }, 12000);

            // Step 7: Navigate to Withdrawals (13s)
            setTimeout(() => {
                setMousePosition({ x: 15, y: 75 });
                setHighlightedElement('withdrawals-nav');
                setAnimationStep(5);
            }, 14000);

            // Step 8: Click on Withdrawals (15s)
            setTimeout(() => {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
                setAnimationStep(6);
            }, 16000);

            // Step 9: Mouse moves to withdrawal amount (17s)
            setTimeout(() => {
                setMousePosition({ x: 50, y: 45 });
                setHighlightedElement('withdrawal-amount');
            }, 18000);

            // Step 10: Click withdrawal amount (19s)
            setTimeout(() => {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
                setAnimationStep(7);
            }, 20000);

            // Step 11: Mouse moves to Request Withdrawal button (21s)
            setTimeout(() => {
                setMousePosition({ x: 50, y: 65 });
                setHighlightedElement('withdrawal-btn');
            }, 22000);

            // Step 12: Click Request Withdrawal (23s)
            setTimeout(() => {
                setIsClicking(true);
                setTimeout(() => setIsClicking(false), 200);
                setAnimationStep(8);
            }, 24000);

            // Step 13: Success state - show updated balance (25s)
            setTimeout(() => {
                setMousePosition({ x: 45, y: 25 });
                setHighlightedElement('balance-card');
                setAnimationStep(9);
            }, 26000);

            // Reset (28s)
            setTimeout(() => {
                setMousePosition({ x: 50, y: 50 });
                setHighlightedElement(null);
                setAnimationStep(0);
            }, 28000);
        };

        sequence();
        const interval = setInterval(sequence, 30000);

        return () => clearInterval(interval);
    }, []); return (
        <section className="relative bg-gray-900 pt-20 pb-24 overflow-hidden">
            {/* Background Elements (hidden on very small screens) */}
            <div className="absolute inset-0">
                <div className="hidden sm:block absolute top-1/4 left-1/6 w-44 md:w-56 h-44 md:h-56 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="hidden sm:block absolute bottom-1/4 right-1/6 w-56 md:w-72 h-56 md:h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-6xl mx-auto">
                    {/* Company Logos */}
                    <div className="mb-12 pt-4">
                        <p className="text-sm text-gray-400 mb-6 uppercase tracking-wide">TRUSTED BY LEADING COMPANIES</p>
                        <div className="flex justify-center items-center space-x-8 opacity-60">
                            <div className="text-xl font-bold text-gray-500">Goldman Sachs</div>
                            <div className="text-xl font-bold text-gray-500">JPMorgan</div>
                            <div className="text-xl font-bold text-gray-500">Coinbase</div>
                            <div className="text-xl font-bold text-gray-500">Binance</div>
                        </div>
                    </div>

                    {/* Main Hero Content */}
                    <div className="space-y-8 mb-16">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight relative">
                            {/* Animated Background Text Effect */}
                            <div className="absolute inset-0 opacity-10">
                                <span
                                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse"
                                    style={{
                                        backgroundSize: '200% 100%',
                                        backgroundPosition: `${gradientPosition}% 0%`
                                    }}
                                >
                                    Grow your wealth with smart crypto investing
                                </span>
                            </div>

                            {/* Main Animated Text */}
                            <div className="relative z-10">
                                {heroWords.slice(0, 4).map((word, index) => (
                                    <span
                                        key={index}
                                        className={`inline-block mr-4 transition-all duration-700 ${index < visibleWords
                                            ? 'opacity-100 transform translate-y-0'
                                            : 'opacity-0 transform translate-y-8'
                                            }`}
                                        style={{
                                            animationDelay: `${index * 0.2}s`,
                                            transform: index < visibleWords ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)'
                                        }}
                                    >
                                        {word}
                                    </span>
                                ))}

                                <br className="hidden lg:block" />

                                {/* Gradient animated text for "smart crypto investing" */}
                                <span className="relative">
                                    {heroWords.slice(4).map((word, index) => {
                                        const wordIndex = index + 4;
                                        const isVisible = wordIndex < visibleWords;
                                        return (
                                            <span
                                                key={wordIndex}
                                                className={`inline-block mr-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                style={{
                                                    transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(30px) rotateX(90deg)',
                                                    transformStyle: 'preserve-3d',
                                                    animationDelay: `${wordIndex * 0.2}s`
                                                }}
                                            >
                                                <span className={`
                                                    ${word === 'smart' ? 'animate-bounce-gentle' : ''}
                                                    ${word === 'crypto' ? 'animate-pulse-gentle' : ''}
                                                    ${word === 'investing' ? 'animate-float-gentle' : ''}
                                                `}>
                                                    {word}
                                                </span>
                                            </span>
                                        );
                                    })}

                                    {/* Animated cursor */}
                                    {visibleWords >= heroWords.length && showCursor && (
                                        <span className="animate-pulse text-purple-600 font-normal">|</span>
                                    )}
                                </span>
                            </div>
                        </h1>

                        {/* Animated subtitle with staggered word reveal */}
                        <div className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            {subWords.map((word, index) => (
                                <span
                                    key={index}
                                    className={`inline-block mr-2 transition-all duration-500 ${visibleWords >= 5
                                        ? 'opacity-100 transform translate-y-0'
                                        : 'opacity-0 transform translate-y-4'
                                        }`}
                                    style={{
                                        animationDelay: `${(heroWords.length + index) * 0.1}s`,
                                        filter: word.includes('AI-powered') ? 'hue-rotate(45deg)' : 'none'
                                    }}
                                >
                                    {word === 'AI-powered' ? (
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold animate-gradient-shift">
                                            {word}
                                        </span>
                                    ) : (
                                        word
                                    )}
                                </span>
                            ))}
                        </div>

                        {/* Floating sparkle effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-float opacity-30"
                                    style={{
                                        left: `${20 + i * 15}%`,
                                        top: `${30 + (i % 2) * 20}%`,
                                        animationDelay: `${i * 0.5}s`,
                                        animationDuration: `${3 + i * 0.5}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delay-2">
                        <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            onClick={() => navigate("/signup")}
                        >
                            TRY FOR FREE
                        </Button>

                        <Button
                            variant="outline"
                            className="border-2 border-purple-400 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300"
                        >
                            FIND YOUR PLAN
                        </Button>
                    </div>

                    {/* Dashboard Screenshot with Mouse Demo (hidden on xs to improve responsiveness) */}
                    <div className="relative max-w-6xl mx-auto animate-slide-up px-2 sm:px-0 hidden sm:block">
                        <div className="relative">
                            {/* Main Dashboard Screenshot */}
                            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                                {/* Browser Bar */}
                                <div className="bg-gray-900 px-6 py-3 border-b border-gray-700 flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <div className="ml-4 bg-gray-800 rounded-lg px-4 py-1 text-sm text-gray-300 flex-1 max-w-md">
                                        🔒 nexgen.com/dashboard
                                    </div>
                                </div>

                                {/* Dashboard Layout */}
                                <div className="flex flex-col sm:flex-row h-auto sm:h-96">
                                    {/* Sidebar (collapses above content on small screens) */}
                                    <div className="w-full sm:w-56 sm:sm:w-64 bg-gray-900 text-white flex flex-col">
                                        {/* Logo */}
                                        <div className="p-4 border-b border-gray-700">
                                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                                NexGen
                                            </h2>
                                        </div>

                                        {/* Navigation */}
                                        <nav className="flex-1 p-4 space-y-2">
                                            <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${highlightedElement === 'overview-nav' ? 'bg-gray-700' : 'hover:bg-gray-800'
                                                }`}>
                                                <Home className="w-5 h-5" />
                                                <span>Overview</span>
                                            </div>

                                            <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${highlightedElement === 'invest-nav' ? 'bg-purple-600 ring-2 ring-purple-400' : 'hover:bg-gray-800'
                                                }`}>
                                                <TrendingUp className="w-5 h-5" />
                                                <span>Invest</span>
                                            </div>

                                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800">
                                                <PieChart className="w-5 h-5" />
                                                <span>Investments</span>
                                            </div>

                                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800">
                                                <Wallet className="w-5 h-5" />
                                                <span>Deposits</span>
                                            </div>

                                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800">
                                                <CreditCard className="w-5 h-5" />
                                                <span>Deposit History</span>
                                            </div>

                                            <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${highlightedElement === 'withdrawals-nav' ? 'bg-purple-600 ring-2 ring-purple-400' : 'hover:bg-gray-800'
                                                }`}>
                                                <DollarSign className="w-5 h-5" />
                                                <span>Withdrawals</span>
                                            </div>

                                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800">
                                                <Target className="w-5 h-5" />
                                                <span>Withdrawal History</span>
                                            </div>
                                        </nav>

                                        {/* User Profile */}
                                        <div className="p-4 border-t border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold">A</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Alex Johnson</p>
                                                    <p className="text-xs text-gray-400">Premium Member</p>
                                                </div>
                                                <Settings className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 bg-gray-900 p-4 sm:p-6 overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h1 className="text-2xl font-bold text-gray-100">
                                                    {animationStep >= 6 ? 'Withdrawals' :
                                                        animationStep >= 1 ? 'Investment Plans' : 'Dashboard Overview'}
                                                </h1>
                                                <p className="text-gray-600">
                                                    {animationStep >= 6 ? 'Manage your withdrawals and earnings' :
                                                        animationStep >= 1 ? 'Choose your investment strategy' : 'Welcome back, Alex!'}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Search className="w-5 h-5 text-gray-400" />
                                                <Bell className="w-5 h-5 text-gray-400" />
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dashboard Content */}
                                        {animationStep === 0 && (
                                            <div className="space-y-4">
                                                {/* Balance Cards */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    <div className={`bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700 ${highlightedElement === 'balance-card' ? 'ring-2 ring-green-400 bg-green-900/20' : ''
                                                        }`}>
                                                        <div className="text-lg font-bold text-green-400">
                                                            ${animationStep >= 9 ? '34,485' :
                                                                animationStep >= 5 ? '32,485' : '28,340'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Total Portfolio</div>
                                                    </div>
                                                    <div className="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700">
                                                        <div className="text-lg font-bold text-purple-400">12.8%</div>
                                                        <div className="text-xs text-gray-400">This Month</div>
                                                    </div>
                                                    <div className="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700">
                                                        <div className="text-lg font-bold text-blue-400">
                                                            {animationStep >= 5 ? '4' : '3'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Active Plans</div>
                                                    </div>
                                                    <div className="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700">
                                                        <div className="text-lg font-bold text-yellow-400">$445</div>
                                                        <div className="text-xs text-gray-400">Today's Profit</div>
                                                    </div>
                                                </div>

                                                {/* Chart placeholder */}
                                                <div className="bg-gray-800 p-4 rounded-lg shadow-sm h-24 sm:h-32 border border-gray-700">
                                                    <div className="h-full bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded flex items-end justify-between p-2">
                                                        {[60, 70, 85, 78, 90, 95].map((height, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-2 bg-purple-500 rounded-t"
                                                                style={{ height: `${height}%` }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Investment Plans View */}
                                        {animationStep >= 1 && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    {/* Basic Plan */}
                                                    <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
                                                        <div className="text-center space-y-2">
                                                            <h3 className="font-semibold text-gray-100">Basic Plan</h3>
                                                            <div className="text-2xl font-bold text-blue-400">8.5%</div>
                                                            <div className="text-xs text-gray-400">APY</div>
                                                            <div className="text-sm text-gray-300">Min: $1,000</div>
                                                            <button className="w-full mt-3 bg-blue-900/50 text-blue-400 py-2 rounded-lg text-sm font-medium">
                                                                Select Plan
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Premium Plan */}
                                                    <div className={`bg-gray-800 p-4 rounded-lg shadow-sm border-2 transition-all duration-500 ${highlightedElement === 'premium-plan' || animationStep >= 3
                                                        ? 'border-purple-400 ring-2 ring-purple-500/50 bg-purple-900/20 scale-105'
                                                        : 'border-gray-700'
                                                        }`}>
                                                        <div className="relative">
                                                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Recommended</span>
                                                            </div>
                                                            <div className="text-center space-y-2">
                                                                <h3 className="font-semibold text-gray-100">Premium Plan</h3>
                                                                <div className="text-2xl font-bold text-purple-400">12.8%</div>
                                                                <div className="text-xs text-gray-400">APY</div>
                                                                <div className="text-sm text-gray-300">Min: $5,000</div>

                                                                <button className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${highlightedElement === 'subscribe-btn' || animationStep >= 4
                                                                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                                                    : 'bg-purple-600 text-white'
                                                                    }`}>
                                                                    {animationStep >= 4 ? (
                                                                        <div className="flex items-center justify-center space-x-2">
                                                                            <Check className="w-4 h-4" />
                                                                            <span>Subscribed!</span>
                                                                        </div>
                                                                    ) : (
                                                                        'Subscribe Now'
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Enterprise Plan */}
                                                    <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
                                                        <div className="text-center space-y-2">
                                                            <h3 className="font-semibold text-gray-100">Enterprise</h3>
                                                            <div className="text-2xl font-bold text-green-400">15.2%</div>
                                                            <div className="text-xs text-gray-400">APY</div>
                                                            <div className="text-sm text-gray-300">Min: $25,000</div>
                                                            <button className="w-full mt-3 bg-green-900/50 text-green-400 py-2 rounded-lg text-sm font-medium">
                                                                Select Plan
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Success Message */}
                                                {animationStep >= 4 && (
                                                    <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg animate-bounce-in">
                                                        <div className="flex items-center space-x-2 text-green-400">
                                                            <Check className="w-5 h-5" />
                                                            <span className="font-medium">Successfully subscribed to Premium Plan!</span>
                                                        </div>
                                                        <p className="text-sm text-green-300 mt-1">You're now earning 12.8% APY on your investments.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Withdrawal Interface View */}
                                        {animationStep >= 6 && animationStep < 9 && (
                                            <div className="space-y-6">
                                                {/* Available Balance */}
                                                <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
                                                    <h3 className="text-lg font-semibold text-gray-100 mb-3">Available for Withdrawal</h3>
                                                    <div className="text-3xl font-bold text-green-400">$8,450.75</div>
                                                    <p className="text-sm text-gray-400 mt-1">From Premium Plan earnings</p>
                                                </div>

                                                {/* Withdrawal Form */}
                                                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                                                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Request Withdrawal</h3>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                                                            <div className={`relative ${highlightedElement === 'withdrawal-amount' ? 'ring-2 ring-purple-400' : ''}`}>
                                                                <input
                                                                    type="text"
                                                                    className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                    placeholder="Enter amount..."
                                                                    value={animationStep >= 7 ? "$2,000" : ""}
                                                                    readOnly
                                                                />
                                                                <div className="absolute right-3 top-3 text-gray-400">
                                                                    <DollarSign className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Method</label>
                                                            <select className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500">
                                                                <option>Bank Transfer (2-3 days)</option>
                                                                <option>Crypto Wallet (Instant)</option>
                                                            </select>
                                                        </div>

                                                        <button className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${highlightedElement === 'withdrawal-btn' || animationStep >= 8
                                                            ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                                            }`}>
                                                            {animationStep >= 8 ? (
                                                                <div className="flex items-center justify-center space-x-2">
                                                                    <Check className="w-5 h-5" />
                                                                    <span>Request Submitted!</span>
                                                                </div>
                                                            ) : (
                                                                'Request Withdrawal'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Success Message */}
                                                {animationStep >= 8 && (
                                                    <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg animate-bounce-in">
                                                        <div className="flex items-center space-x-2 text-green-400">
                                                            <Check className="w-5 h-5" />
                                                            <span className="font-medium">Withdrawal request submitted successfully!</span>
                                                        </div>
                                                        <p className="text-sm text-green-300 mt-1">$2,000 will be transferred to your bank account within 2-3 business days.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Animated Mouse Cursor */}
                            <div
                                className="absolute pointer-events-none z-20 transition-all duration-1000 ease-in-out"
                                style={{
                                    left: `${mousePosition.x}%`,
                                    top: `${mousePosition.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <div className={`relative ${isClicking ? 'scale-75' : 'scale-100'} transition-transform duration-100`}>
                                    {/* Mouse Cursor */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-lg">
                                        <path
                                            d="M12 2L5.5 21L9.5 15.5L15.5 13.5L12 2Z"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="1"
                                        />
                                    </svg>

                                    {/* Click Ripple Effect */}
                                    {isClicking && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-8 h-8 bg-purple-400 rounded-full animate-ping opacity-50"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floating Notifications */}
                            {animationStep >= 5 && (
                                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg animate-bounce-in">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-5 h-5" />
                                        <div>
                                            <p className="text-sm font-semibold">Portfolio Growing!</p>
                                            <p className="text-xs">+$4,145 this month</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Badge */}
                            <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-xl shadow-lg animate-float">
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Demo Instructions */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm animate-fade-in">
                            <span className="opacity-80">
                                {animationStep === 0 && "👆 Watch Alex navigate the dashboard"}
                                {animationStep === 1 && "🎯 Selecting investment plans"}
                                {animationStep === 2 && "💼 Choosing Premium Plan"}
                                {animationStep === 3 && "🚀 Subscribing to earn 12.8% APY"}
                                {animationStep >= 4 && "📈 Portfolio growing automatically!"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
