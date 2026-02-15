import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import Button from './ui/Button';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') === 'true'
    );
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navLinks = [
        { path: '/profile', label: 'Dashboard', icon: '📊' },
        { path: '/academic', label: 'Academic', icon: '📚' },
        { path: '/coding', label: 'Coding', icon: '💻' },
        { path: '/psychometric', label: 'Personality', icon: '🧠' },
        { path: '/analyze', label: 'Analyze', icon: '🔬' },
        { path: '/recommendations', label: 'Recommendations', icon: '💼' },
        { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
        { path: '/projects', label: 'Projects', icon: '🚀' },
    ];

    const isActive = (path) => location.pathname === path;

    // Don't show navigation on public pages
    if (!isSignedIn || ['/', '/auth/login', '/auth/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg ${
                isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
            }`}>
                {/* Logo & Toggle */}
                <div className={`flex items-center border-b border-gray-200 dark:border-gray-800 ${
                    isSidebarCollapsed ? 'flex-col gap-3 px-3 py-4' : 'justify-between px-6 py-6'
                }`}>
                    {isSidebarCollapsed ? (
                        <>
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                NS
                            </div>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors w-10"
                                title="Expand sidebar"
                            >
                                <span className="text-xl">☰</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    NS
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    NextStepAI
                                </span>
                            </div>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="Collapse sidebar"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </>
                    )}
                </div>

                {/* User Profile */}
                {!isSidebarCollapsed && (
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <img
                                src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563EB&color=fff`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full ring-2 ring-blue-600/30"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive(link.path)
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            title={isSidebarCollapsed ? link.label : ''}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {!isSidebarCollapsed && link.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors ${
                            isSidebarCollapsed ? 'justify-center' : ''
                        }`}
                        title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
                    >
                        <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
                        {!isSidebarCollapsed && (isDarkMode ? 'Light Mode' : 'Dark Mode')}
                    </button>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors ${
                            isSidebarCollapsed ? 'justify-center' : ''
                        }`}
                        title={isSidebarCollapsed ? 'Sign Out' : ''}
                    >
                        <span className="text-xl">🚪</span>
                        {!isSidebarCollapsed && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AC
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            NextStepAI
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle - Mobile */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {/* User Profile - Mobile */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links - Mobile */}
                        <nav className="px-2 py-3 space-y-1 max-h-96 overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Sign Out - Mobile */}
                        <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <span className="text-xl">🚪</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Spacer */}
            <div className="lg:hidden h-16"></div>
        </>
    );
};

export default Navigation;