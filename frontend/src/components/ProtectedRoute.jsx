import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { isLoaded, isSignedIn } = useAuth();
    const location = useLocation();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
}