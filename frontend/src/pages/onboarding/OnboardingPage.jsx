import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Button from '../../components/ui/Button';

const OnboardingPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const steps = [
        {
            id: 1,
            title: 'Welcome to NextStepAI',
            description: 'Let\'s build your personalized tech career roadmap',
            content: (
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-[#FAF9F6] border border-[#E8E5DF] dark:bg-[#2a2b2e] rounded-full flex items-center justify-center mx-auto shadow-soft">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h2 className="heading-serif text-display text-[#111111] dark:text-white">Hi {user?.firstName || 'there'}!</h2>
                    <p className="text-[#6B6B6B] dark:text-[#A1A1A1] max-w-md mx-auto text-sm leading-relaxed">
                        We'll guide you through a quick setup to understand your academic background,
                        coding skills, and career interests.
                    </p>
                    <div className="card-pastel-blue p-4 rounded-2xl">
                        <p className="text-xs font-semibold text-[#1E40AF]">
                            ⏱️ This will take approximately 5 minutes
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 2,
            title: 'Academic Records',
            description: 'Add your semester-wise academic performance',
            content: (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#D4F2E3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#111111] dark:text-white">Academic Performance</h3>
                        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            We'll analyze your GPA trends and subject strengths
                        </p>
                    </div>
                    <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] p-6 rounded-2xl space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="text-[#10B981] font-bold mt-0.5">✓</span>
                            <div>
                                <p className="font-semibold text-sm text-[#111111] dark:text-white">Upload transcripts or enter manually</p>
                                <p className="text-xs text-[#6B6B6B]">CSV, JSON, or manual entry supported</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-[#10B981] font-bold mt-0.5">✓</span>
                            <div>
                                <p className="font-semibold text-sm text-[#111111] dark:text-white">Track semester-wise progress</p>
                                <p className="text-xs text-[#6B6B6B]">Visualize your academic growth</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 3,
            title: 'Coding Profiles',
            description: 'Connect your coding platforms',
            content: (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#E9D5FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">💻</span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#111111] dark:text-white">Coding Activity</h3>
                        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            Link your profiles to analyze your coding patterns
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['GitHub', 'LeetCode', 'Codeforces', 'CodeChef'].map((platform) => (
                            <div key={platform} className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] p-4 rounded-2xl text-center">
                                <p className="font-semibold text-sm text-[#111111] dark:text-white">{platform}</p>
                                <p className="text-xs text-[#909090] mt-1">Optional</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 4,
            title: 'Career Preferences',
            description: 'Tell us about your interests',
            content: (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#FEF3C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#111111] dark:text-white">What's Your Goal?</h3>
                        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            We'll tailor recommendations based on your interests
                        </p>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-2xl cursor-pointer hover:bg-[#FAF9F6] dark:hover:bg-[#2a2b2e] transition-colors">
                            <input type="radio" name="goal" className="w-4 h-4 text-[#111111] accent-[#111111]" />
                            <div>
                                <p className="font-semibold text-sm text-[#111111] dark:text-white">Corporate Job</p>
                                <p className="text-xs text-[#6B6B6B]">Product companies, startups</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-2xl cursor-pointer hover:bg-[#FAF9F6] dark:hover:bg-[#2a2b2e] transition-colors">
                            <input type="radio" name="goal" className="w-4 h-4 text-[#111111] accent-[#111111]" />
                            <div>
                                <p className="font-semibold text-sm text-[#111111] dark:text-white">Higher Studies</p>
                                <p className="text-xs text-[#6B6B6B]">MS, PhD programs</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-2xl cursor-pointer hover:bg-[#FAF9F6] dark:hover:bg-[#2a2b2e] transition-colors">
                            <input type="radio" name="goal" className="w-4 h-4 text-[#111111] accent-[#111111]" />
                            <div>
                                <p className="font-semibold text-sm text-[#111111] dark:text-white">Entrepreneurship</p>
                                <p className="text-xs text-[#6B6B6B]">Build your own startup</p>
                            </div>
                        </label>
                    </div>
                </div>
            ),
        },
    ];

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate('/academic');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        navigate('/academic');
    };

    const currentStepData = steps[currentStep - 1];

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-[#6B6B6B] dark:text-[#A1A1A1]">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <button
                            onClick={handleSkip}
                            className="text-xs font-semibold text-[#909090] hover:text-[#111111] dark:hover:text-white transition-colors"
                        >
                            Skip for now →
                        </button>
                    </div>
                    <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2">
                        <div
                            className="bg-[#111111] dark:bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-[#1F2023] rounded-3xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-8 lg:p-10">
                    <div className="mb-6">
                        <h1 className="heading-serif text-display text-[#111111] dark:text-white mb-2">
                            {currentStepData.title}
                        </h1>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-sm">
                            {currentStepData.description}
                        </p>
                    </div>

                    <div className="mb-8">
                        {currentStepData.content}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep === totalSteps ? 'Get Started' : 'Next'}
                        </Button>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs text-[#909090] mt-6">
                    Need help? Contact support@nextstepai.com
                </p>
            </div>
        </div>
    );
};

export default OnboardingPage;