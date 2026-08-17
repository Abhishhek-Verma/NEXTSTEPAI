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
        { path: '/skills', label: 'Skills', icon: '⚡' },
        { path: '/psychometric', label: 'Personality', icon: '🧠' },
        { path: '/analyze', label: 'Analyze', icon: '🔬' },
        { path: '/recommendations', label: 'Recommendations', icon: '💼' },
        { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
        { path: '/projects', label: 'Projects', icon: '🚀' },
    ];

    const isActive = (path) => location.pathname === path;

    // Don't show navigation on public pages
    if (!isSignedIn || ['/', '/auth/login', '/auth/register', '/login', '/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300 bg-white dark:bg-[#161719] border-r border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] ${
                isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
            }`}>
                {/* Logo & Toggle */}
                <div className={`flex items-center border-b border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] ${
                    isSidebarCollapsed ? 'flex-col gap-3 px-3 py-5' : 'justify-between px-6 py-5'
                }`}>
                    {isSidebarCollapsed ? (
                        <>
                            <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-[#111111] font-bold text-sm">
                                NS
                            </div>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 text-[#6B6B6B] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e] rounded-xl transition-colors w-10 flex items-center justify-center"
                                title="Expand sidebar"
                            >
                                <span className="text-lg">☰</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-[#111111] font-bold text-sm">
                                    NS
                                </div>
                                <span className="text-lg font-bold text-[#111111] dark:text-white tracking-tight">
                                    NextStepAI
                                </span>
                            </div>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 text-[#6B6B6B] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e] rounded-xl transition-colors"
                                title="Collapse sidebar"
                            >
                                <span className="text-lg">✕</span>
                            </button>
                        </>
                    )}
                </div>

                {/* User Profile */}
                {!isSidebarCollapsed && (
                    <div className="px-5 py-4 border-b border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">
                        <div className="flex items-center gap-3">
                            <img
                                src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=111111&color=fff`}
                                alt="Profile"
                                className="w-9 h-9 rounded-full ring-2 ring-[#E8E5DF] dark:ring-[rgba(255,255,255,0.1)]"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#111111] dark:text-white truncate">
                                    {user?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-[#909090] dark:text-[#666] truncate">
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
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive(link.path)
                                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                                    : 'text-[#6B6B6B] hover:bg-[#F8F7F3] hover:text-[#111111] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e] dark:hover:text-white'
                            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            title={isSidebarCollapsed ? link.label : ''}
                        >
                            <span className="text-lg flex-shrink-0">{link.icon}</span>
                            {!isSidebarCollapsed && link.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="px-3 py-4 border-t border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] space-y-1">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B6B6B] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e] transition-colors ${
                            isSidebarCollapsed ? 'justify-center' : ''
                        }`}
                        title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
                    >
                        <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                        {!isSidebarCollapsed && (isDarkMode ? 'Light Mode' : 'Dark Mode')}
                    </button>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444]/80 hover:bg-[#FCE5E6] dark:hover:bg-[#FCE5E6]/10 transition-colors ${
                            isSidebarCollapsed ? 'justify-center' : ''
                        }`}
                        title={isSidebarCollapsed ? 'Sign Out' : ''}
                    >
                        <span className="text-lg">🚪</span>
                        {!isSidebarCollapsed && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/92 dark:bg-[#161719]/92 backdrop-blur-xl border-b border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#111111] dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-[#111111] font-bold text-xs">
                            NS
                        </div>
                        <span className="text-base font-bold text-[#111111] dark:text-white tracking-tight">
                            NextStepAI
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle - Mobile */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-[#6B6B6B] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e] rounded-xl transition-colors"
                        >
                            <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-[#6B6B6B] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e] rounded-xl transition-colors"
                        >
                            <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="border-t border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] bg-white dark:bg-[#161719]">
                        {/* User Profile - Mobile */}
                        <div className="px-4 py-3 border-b border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#111111] dark:text-white truncate">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-[#909090] dark:text-[#666] truncate">
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
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                                        : 'text-[#6B6B6B] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:bg-[#2a2b2e]'
                                        }`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Sign Out - Mobile */}
                        <div className="px-2 py-3 border-t border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444]/80 hover:bg-[#FCE5E6] dark:hover:bg-[#FCE5E6]/10 transition-colors"
                            >
                                <span className="text-lg">🚪</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Spacer */}
            <div className="lg:hidden h-14"></div>
        </>
    );
};

export default Navigation;