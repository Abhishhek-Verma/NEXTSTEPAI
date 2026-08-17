import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark p-4 bg-dots">
            {/* Soft background shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-pastel-mint/25 rounded-full blur-[100px]" />
                <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] bg-pastel-blue/20 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <h2 className="heading-serif text-display text-[#111111] dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-[#6B6B6B] dark:text-[#A1A1A1]">
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

export default RegisterPage;