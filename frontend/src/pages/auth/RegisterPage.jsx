import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Start your career journey with NextStepAI
                    </p>
                </div>
                <SignUp
                    afterSignUpUrl="/onboarding"
                    signInUrl="/auth/login"
                    routing="path"
                    path="/auth/register"
                    appearance={{
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'shadow-xl bg-white dark:bg-gray-800',
                            headerTitle: 'text-gray-900 dark:text-white',
                            headerSubtitle: 'text-gray-600 dark:text-gray-400',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default RegisterPage;