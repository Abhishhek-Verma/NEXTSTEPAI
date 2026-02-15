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
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h2 className="text-2xl font-bold">Hi {user?.firstName || 'there'}!</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        We'll guide you through a quick setup to understand your academic background,
                        coding skills, and career interests.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
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
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="text-xl font-semibold">Academic Performance</h3>
                        <p className="text-gray-600 mt-2">
                            We'll analyze your GPA trends and subject strengths
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="text-green-600 mt-1">✓</span>
                            <div>
                                <p className="font-medium">Upload transcripts or enter manually</p>
                                <p className="text-sm text-gray-600">CSV, JSON, or manual entry supported</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-green-600 mt-1">✓</span>
                            <div>
                                <p className="font-medium">Track semester-wise progress</p>
                                <p className="text-sm text-gray-600">Visualize your academic growth</p>
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
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">💻</span>
                        </div>
                        <h3 className="text-xl font-semibold">Coding Activity</h3>
                        <p className="text-gray-600 mt-2">
                            Link your profiles to analyze your coding patterns
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['GitHub', 'LeetCode', 'Codeforces', 'CodeChef'].map((platform) => (
                            <div key={platform} className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="font-medium">{platform}</p>
                                <p className="text-xs text-gray-500 mt-1">Optional</p>
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
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h3 className="text-xl font-semibold">What's Your Goal?</h3>
                        <p className="text-gray-600 mt-2">
                            We'll tailor recommendations based on your interests
                        </p>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="goal" className="w-4 h-4" />
                            <div>
                                <p className="font-medium">Corporate Job</p>
                                <p className="text-sm text-gray-600">Product companies, startups</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="goal" className="w-4 h-4" />
                            <div>
                                <p className="font-medium">Higher Studies</p>
                                <p className="text-sm text-gray-600">MS, PhD programs</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="goal" className="w-4 h-4" />
                            <div>
                                <p className="font-medium">Entrepreneurship</p>
                                <p className="text-sm text-gray-600">Build your own startup</p>
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
            // Complete onboarding
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
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <button
                            onClick={handleSkip}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Skip for now →
                        </button>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-brand-blue to-brand-purple h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentStepData.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
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
                <p className="text-center text-sm text-gray-500 mt-6">
                    Need help? Contact support@nextstepai.com
                </p>
            </div>
        </div>
    );
};

export default OnboardingPage;