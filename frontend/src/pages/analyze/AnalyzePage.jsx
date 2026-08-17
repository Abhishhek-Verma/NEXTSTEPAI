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
                inclination: 'Corporate Tech',
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
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="heading-serif text-display text-[#111111] dark:text-white mb-3">
                        AI Career Analysis
                    </h1>
                    <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-base">
                        Get personalized career insights based on your profile
                    </p>
                </div>

                {!canAnalyze ? (
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-10 text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-[#111111] dark:text-white mb-2">
                            Insufficient Data
                        </h2>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mb-6 text-sm">
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
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-12 text-center">
                        <div className="animate-spin text-5xl mb-6">🔬</div>
                        <h2 className="heading-serif text-display text-[#111111] dark:text-white mb-2">
                            Analyzing Your Profile...
                        </h2>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mb-6 text-sm max-w-md mx-auto">
                            Our AI is processing your academic performance, coding activity, and personality traits
                        </p>
                        <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5 max-w-md mx-auto overflow-hidden">
                            <div className="bg-[#111111] dark:bg-white h-2.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                ) : analysisResult ? (
                    <div className="space-y-6">
                        <div className="card-pastel-mint rounded-2xl p-8 border border-[rgba(205,238,220,0.6)] shadow-card">
                            <h2 className="heading-serif text-display text-[#166534] mb-2">Analysis Complete! ✨</h2>
                            <p className="text-base text-[#166534]">
                                Career Inclination: <span className="font-bold">{analysisResult.inclination}</span>
                            </p>
                            <p className="text-xs text-[#166534]/80 mt-1">
                                Confidence: {Math.round(analysisResult.confidence * 100)}%
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-8">
                            <h3 className="text-xl font-semibold text-[#111111] dark:text-white mb-4">
                                Why This Recommendation?
                            </h3>
                            <ul className="space-y-3">
                                {analysisResult.rationale.map((reason, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm">
                                        <span className="text-[#10B981] font-bold mt-0.5">✓</span>
                                        <span className="text-[#404040] dark:text-[#A1A1A1]">{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => navigate('/recommendations')} className="flex-1" size="lg">
                                View Detailed Recommendations
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/roadmap')} className="flex-1" size="lg">
                                Generate Roadmap
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-8 lg:p-10">
                        <div className="text-center mb-8">
                            <div className="text-5xl mb-3">🎯</div>
                            <h2 className="heading-serif text-display text-[#111111] dark:text-white mb-2">
                                Ready to Analyze
                            </h2>
                            <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-sm">
                                We'll analyze your data to provide personalized career guidance
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="card-pastel-blue rounded-xl p-5">
                                <p className="text-xs text-[#1E40AF]">Academic Records</p>
                                <p className="text-2xl font-bold text-[#1E40AF] mt-1">
                                    {academics.records.length} semesters
                                </p>
                            </div>
                            <div className="card-pastel-purple rounded-xl p-5">
                                <p className="text-xs text-[#6B21A8]">Coding Platforms</p>
                                <p className="text-2xl font-bold text-[#6B21A8] mt-1">
                                    {Object.values(coding.platforms).filter(p => p.profileUrl).length} connected
                                </p>
                            </div>
                            <div className="card-pastel-yellow rounded-xl p-5">
                                <p className="text-xs text-[#92400E]">Personality Test</p>
                                <p className="text-2xl font-bold text-[#92400E] mt-1">
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