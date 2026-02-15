import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') === 'true'
    );

    useEffect(() => {
        const handleStorage = () => {
            setIsSidebarCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
        };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(handleStorage, 100);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className={`transition-all duration-300 ${
                isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;