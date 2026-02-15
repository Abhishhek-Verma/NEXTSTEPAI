import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';

const AnalyzePage = () => {
    const navigate = useNavigate();
    const { academics, coding, psychometric } = useStore();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const canAnalyze =
        academics.records.length > 0 ||
        Object.values(coding.platforms).some(p => p.profileUrl);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        // Simulate API call
        setTimeout(() => {
            const mockResult = {
                inclination: 'Corporate',
                confidence: 0.82,
                rationale: [
                    'Strong technical skills with consistent GitHub activity',
                    'High GPA trend showing academic excellence',
                    'Balanced personality traits favoring team collaboration',
                    'Problem-solving abilities demonstrated through LeetCode ratings',
                ],
            };
            setAnalysisResult(mockResult);
            setIsAnalyzing(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent bg-clip-text text-transparent mb-4">
                        AI Career Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Get personalized career insights based on your profile
                    </p>
                </div>

                {!canAnalyze ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Insufficient Data
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Please add academic records or connect coding profiles to run analysis
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => navigate('/academic')}>
                                Add Academic Data
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/coding')}>
                                Connect Platforms
                            </Button>
                        </div>
                    </div>
                ) : isAnalyzing ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin text-6xl mb-6">🔬</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Analyzing Your Profile...
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our AI is processing your academic performance, coding activity, and personality traits
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-md mx-auto">
                            <div className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                ) : analysisResult ? (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2">Analysis Complete! ✨</h2>
                            <p className="text-lg">
                                Career Inclination: <span className="font-bold">{analysisResult.inclination}</span>
                            </p>
                            <p className="text-sm mt-2">
                                Confidence: {Math.round(analysisResult.confidence * 100)}%
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Why This Recommendation?
                            </h3>
                            <ul className="space-y-3">
                                {analysisResult.rationale.map((reason, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => navigate('/recommendations')} className="flex-1">
                                View Detailed Recommendations
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/roadmap')} className="flex-1">
                                Generate Roadmap
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🎯</div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to Analyze
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We'll analyze your data to provide personalized career guidance
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Academic Records</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {academics.records.length} semesters
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Coding Platforms</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {Object.values(coding.platforms).filter(p => p.profileUrl).length} connected
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Personality Test</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {psychometric.takenAt ? 'Complete' : 'Pending'}
                                </p>
                            </div>
                        </div>

                        <Button onClick={handleAnalyze} size="lg" className="w-full">
                            🔬 Start AI Analysis
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzePage;