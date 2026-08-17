import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

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
        <div className="min-h-screen py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="heading-serif text-display text-[#000000] dark:text-white mb-3">
                        AI Career Analysis
                    </h1>
                    <p className="text-[#555555] dark:text-[#A1A1A1] text-base">
                        Get personalized career insights based on your profile
                    </p>
                </div>

                {!canAnalyze ? (
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-10 text-center">
                        <Icon name="AlertTriangle" size={44} strokeWidth={1.8} className="text-[#000000] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[#000000] dark:text-white mb-2">
                            Insufficient Data
                        </h2>
                        <p className="text-[#555555] dark:text-[#A1A1A1] mb-6 text-sm">
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
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-12 text-center">
                        <Icon name="RefreshCw" size={44} strokeWidth={2} className="animate-spin text-[#C9B59C] mx-auto mb-6" />
                        <h2 className="heading-serif text-display text-[#000000] dark:text-white mb-2">
                            Analyzing Your Profile...
                        </h2>
                        <p className="text-[#555555] dark:text-[#A1A1A1] mb-6 text-sm max-w-md mx-auto">
                            Our AI is processing your academic performance, coding activity, and personality traits
                        </p>
                        <div className="w-full bg-[#D9CFC7]/50 dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5 max-w-md mx-auto overflow-hidden">
                            <div className="bg-[#000000] dark:bg-[#C9B59C] h-2.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                ) : analysisResult ? (
                    <div className="space-y-6">
                        <div className="bg-[#EFE9E3] border border-[#D9CFC7] rounded-2xl p-8 shadow-card">
                            <div className="flex items-center gap-3 mb-2">
                                <Icon name="CheckCircle2" size={24} className="text-[#000000]" />
                                <h2 className="heading-serif text-display text-[#000000]">Analysis Complete!</h2>
                            </div>
                            <p className="text-base text-[#000000]">
                                Career Inclination: <span className="font-bold">{analysisResult.inclination}</span>
                            </p>
                            <p className="text-xs text-[#555555] mt-1">
                                Confidence: {Math.round(analysisResult.confidence * 100)}%
                            </p>
                        </div>

                        <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-8">
                            <h3 className="text-xl font-semibold text-[#000000] dark:text-white mb-4">
                                Why This Recommendation?
                            </h3>
                            <ul className="space-y-3">
                                {analysisResult.rationale.map((reason, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm">
                                        <Icon name="Check" size={16} strokeWidth={2.5} className="text-[#C9B59C] flex-shrink-0 mt-0.5" />
                                        <span className="text-[#000000] dark:text-[#A1A1A1]">{reason}</span>
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
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-8 lg:p-10">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-[#C9B59C] rounded-2xl flex items-center justify-center text-[#000000] mx-auto mb-3">
                                <Icon name="Target" size={28} strokeWidth={2} />
                            </div>
                            <h2 className="heading-serif text-display text-[#000000] dark:text-white mb-2">
                                Ready to Analyze
                            </h2>
                            <p className="text-[#555555] dark:text-[#A1A1A1] text-sm">
                                We'll analyze your data to provide personalized career guidance
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-[#F9F8F6] border border-[#D9CFC7] rounded-xl p-5">
                                <p className="text-xs font-medium text-[#555555]">Academic Records</p>
                                <p className="text-2xl font-bold text-[#000000] mt-1">
                                    {academics.records.length} semesters
                                </p>
                            </div>
                            <div className="bg-[#F9F8F6] border border-[#D9CFC7] rounded-xl p-5">
                                <p className="text-xs font-medium text-[#555555]">Coding Platforms</p>
                                <p className="text-2xl font-bold text-[#000000] mt-1">
                                    {Object.values(coding.platforms).filter(p => p.profileUrl).length} connected
                                </p>
                            </div>
                            <div className="bg-[#F9F8F6] border border-[#D9CFC7] rounded-xl p-5">
                                <p className="text-xs font-medium text-[#555555]">Personality Test</p>
                                <p className="text-2xl font-bold text-[#000000] mt-1">
                                    {psychometric.takenAt ? 'Complete' : 'Pending'}
                                </p>
                            </div>
                        </div>

                        <Button onClick={handleAnalyze} size="lg" className="w-full flex items-center justify-center gap-2">
                            <Icon name="Sparkles" size={18} strokeWidth={2} />
                            Start AI Analysis
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzePage;