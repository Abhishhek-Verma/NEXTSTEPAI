import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark p-4 bg-dots">
            {/* Soft background shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-pastel-blue/25 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-pastel-purple/20 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-md w-full relative z-10">
                <SignIn
                    afterSignInUrl="/onboarding"
                    signUpUrl="/auth/register"
                    routing="path"
                    path="/auth/login"
                    appearance={{
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'shadow-card bg-white dark:bg-[#1F2023] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-2xl',
                            headerTitle: 'text-[#111111] dark:text-white font-semibold',
                            headerSubtitle: 'text-[#6B6B6B] dark:text-[#A1A1A1]',
                            formButtonPrimary: 'bg-[#111111] hover:bg-[#2a2a2a] text-white rounded-full',
                            formFieldInput: 'rounded-xl border-[#E8E5DF] focus:border-[#111111]/30 focus:ring-[#111111]/10',
                            footerActionLink: 'text-[#111111] dark:text-white font-medium',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default LoginPage;