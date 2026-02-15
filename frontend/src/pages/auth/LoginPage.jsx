import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full">
                <SignIn
                    afterSignInUrl="/onboarding"
                    signUpUrl="/auth/register"
                    routing="path"
                    path="/auth/login"
                />
            </div>
        </div>
    );
};

export default LoginPage;