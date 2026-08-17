import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import Icon from './AppIcon';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navLinks = [
        { path: '/profile', label: 'Dashboard', iconName: 'LayoutDashboard' },
        { path: '/academic', label: 'Academic', iconName: 'GraduationCap' },
        { path: '/coding', label: 'Coding', iconName: 'Code2' },
        { path: '/skills', label: 'Skills', iconName: 'Sparkles' },
        { path: '/psychometric', label: 'Personality', iconName: 'UserCheck' },
        { path: '/analyze', label: 'Analyze', iconName: 'BarChart3' },
        { path: '/recommendations', label: 'Recommendations', iconName: 'Briefcase' },
        { path: '/roadmap', label: 'Roadmap', iconName: 'Compass' },
        { path: '/projects', label: 'Projects', iconName: 'FolderKanban' },
    ];

    const isActive = (path) => location.pathname === path;

    // Don't show navigation on public pages
    if (!isSignedIn || ['/', '/auth/login', '/auth/register', '/login', '/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300 bg-[#EFE9E3] dark:bg-[#262422] border-r border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] ${
                isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
            }`}>
                {/* Logo & Toggle */}
                <div className={`flex items-center border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] ${
                    isSidebarCollapsed ? 'flex-col gap-3 px-3 py-5' : 'justify-between px-6 py-5'
                }`}>
                    {isSidebarCollapsed ? (
                        <>
                            <img
                                src="/logo.jpeg"
                                alt="NextStepAI Logo"
                                className="w-10 h-10 rounded-xl object-cover shadow-sm"
                            />
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-2 text-[#000000]/70 hover:bg-[#D9CFC7] dark:text-[#A1A1A1] dark:hover:bg-[#33302D] rounded-xl transition-colors w-10 flex items-center justify-center"
                                title="Expand sidebar"
                            >
                                <Icon name="ChevronRight" size={18} strokeWidth={2} />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.jpeg"
                                    alt="NextStepAI Logo"
                                    className="w-10 h-10 rounded-xl object-cover shadow-sm"
                                />
                                <span className="text-lg font-bold text-[#141414] dark:text-white tracking-tight">
                                    NextStep<span className="text-[#FF5722]">AI</span>
                                </span>
                            </div>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-2 text-[#141414]/70 hover:bg-[#D9CFC7] dark:text-[#A1A1A1] dark:hover:bg-[#33302D] rounded-xl transition-colors"
                                title="Collapse sidebar"
                            >
                                <Icon name="ChevronLeft" size={18} strokeWidth={2} />
                            </button>
                        </>
                    )}
                </div>

                {/* User Profile */}
                {!isSidebarCollapsed && (
                    <div className="px-5 py-4 border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
                        <div className="flex items-center gap-3">
                            <img
                                src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=FF5722&color=FFFFFF`}
                                alt="Profile"
                                className="w-9 h-9 rounded-full ring-2 ring-[#FF5722]"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#141414] dark:text-white truncate">
                                    {user?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-[#555555] dark:text-[#A1A1A1] truncate">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                    {navLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-[#FF5722] text-white font-bold shadow-sm'
                                        : 'text-[#141414]/80 hover:bg-[#D9CFC7]/50 hover:text-[#FF5722] dark:text-[#A1A1A1] dark:hover:bg-[#33302D] dark:hover:text-white'
                                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                                title={isSidebarCollapsed ? link.label : ''}
                            >
                                <Icon
                                    name={link.iconName}
                                    size={19}
                                    strokeWidth={active ? 2.2 : 1.8}
                                    className={`flex-shrink-0 ${active ? 'text-white' : 'text-[#141414]/70 dark:text-[#A1A1A1]'}`}
                                />
                                {!isSidebarCollapsed && link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Action: Sign Out only (Dark Mode removed) */}
                <div className="px-3 py-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] space-y-1">
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-3.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#000000]/80 hover:bg-[#D9CFC7] hover:text-[#000000] dark:text-[#A1A1A1] dark:hover:bg-[#33302D] transition-colors ${
                            isSidebarCollapsed ? 'justify-center px-0' : ''
                        }`}
                        title={isSidebarCollapsed ? 'Sign Out' : ''}
                    >
                        <Icon name="LogOut" size={19} strokeWidth={1.8} className="flex-shrink-0 text-[#000000]/70 dark:text-[#A1A1A1]" />
                        {!isSidebarCollapsed && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#EFE9E3]/94 dark:bg-[#262422]/94 backdrop-blur-xl border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.jpeg"
                            alt="NextStepAI Logo"
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="text-base font-bold text-[#000000] dark:text-white tracking-tight">
                            NextStep<span className="text-[#C9B59C]">AI</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-[#000000]/80 hover:bg-[#D9CFC7] dark:text-[#A1A1A1] dark:hover:bg-[#33302D] rounded-xl transition-colors"
                        >
                            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={22} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] bg-[#EFE9E3] dark:bg-[#262422]">
                        {/* User Profile - Mobile */}
                        <div className="px-4 py-3 border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#000000] dark:text-white truncate">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-[#555555] dark:text-[#A1A1A1] truncate">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links - Mobile */}
                        <nav className="px-2 py-3 space-y-1 max-h-96 overflow-y-auto">
                            {navLinks.map((link) => {
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                            active
                                                ? 'bg-[#C9B59C] text-[#000000] font-semibold'
                                                : 'text-[#000000]/80 hover:bg-[#D9CFC7] dark:text-[#A1A1A1] dark:hover:bg-[#33302D]'
                                        }`}
                                    >
                                        <Icon name={link.iconName} size={19} strokeWidth={active ? 2.2 : 1.8} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Sign Out - Mobile (Dark Mode removed) */}
                        <div className="px-2 py-3 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#000000]/80 hover:bg-[#D9CFC7] dark:hover:bg-[#33302D] transition-colors"
                            >
                                <Icon name="LogOut" size={19} strokeWidth={1.8} />
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