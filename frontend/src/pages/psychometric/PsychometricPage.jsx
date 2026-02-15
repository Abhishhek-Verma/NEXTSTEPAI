import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import useStore from '../../store';
import apiClient from '../../api/client';

const PsychometricPage = () => {
    const navigate = useNavigate();
    const { psychometric, setPsychometric, setPsychLoading } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showTest, setShowTest] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showPreviousResults, setShowPreviousResults] = useState(false);

    // Fetch existing psychometric results on mount
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await apiClient.get('/psychometric/results');
                if (response.data && response.data.takenAt) {
                    setPsychometric(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch psychometric results:', error);
                // User hasn't taken test yet - this is expected
            }
        };

        fetchResults();
    }, []);

    const questions = [
        {
            id: 1,
            category: 'Openness',
            question: 'I enjoy exploring new ideas and abstract concepts',
            trait: 'openness'
        },
        {
            id: 2,
            category: 'Conscientiousness',
            question: 'I always complete tasks on time and follow schedules strictly',
            trait: 'conscientiousness'
        },
        {
            id: 3,
            category: 'Analytical Thinking',
            question: 'I prefer solving logical problems over creative challenges',
            trait: 'analytical'
        },
        {
            id: 4,
            category: 'Communication',
            question: 'I feel comfortable presenting ideas to large groups',
            trait: 'communication'
        },
        {
            id: 5,
            category: 'Teamwork',
            question: 'I work better in collaborative environments than alone',
            trait: 'teamwork'
        },
        {
            id: 6,
            category: 'Leadership',
            question: 'I often take initiative to lead projects and teams',
            trait: 'leadership'
        },
        {
            id: 7,
            category: 'Innovation',
            question: 'I constantly think of ways to improve existing systems',
            trait: 'innovation'
        },
        {
            id: 8,
            category: 'Technical Aptitude',
            question: 'I enjoy diving deep into technical documentation and learning new tools',
            trait: 'technical'
        },
        {
            id: 9,
            category: 'Problem Solving',
            question: 'When faced with a complex issue, I break it down into smaller, manageable parts',
            trait: 'problemSolving'
        },
        {
            id: 10,
            category: 'Adaptability',
            question: 'I adjust quickly to changing priorities and new work environments',
            trait: 'adaptability'
        },
        {
            id: 11,
            category: 'Attention to Detail',
            question: 'I consistently catch errors and inconsistencies that others miss',
            trait: 'detailOriented'
        },
        {
            id: 12,
            category: 'Time Management',
            question: 'I effectively prioritize tasks to meet multiple deadlines simultaneously',
            trait: 'timeManagement'
        },
        {
            id: 13,
            category: 'Resilience',
            question: 'I remain productive and focused even under high-pressure situations',
            trait: 'resilience'
        },
        {
            id: 14,
            category: 'Critical Thinking',
            question: 'I evaluate information objectively before making decisions',
            trait: 'criticalThinking'
        },
        {
            id: 15,
            category: 'Creativity',
            question: 'I generate innovative solutions when conventional approaches fail',
            trait: 'creativity'
        },
        {
            id: 16,
            category: 'Self-Motivation',
            question: 'I take initiative on tasks without needing external supervision',
            trait: 'selfMotivation'
        },
        {
            id: 17,
            category: 'Conflict Resolution',
            question: 'I successfully mediate disagreements and find win-win solutions',
            trait: 'conflictResolution'
        },
        {
            id: 18,
            category: 'Strategic Planning',
            question: 'I develop long-term plans with clear milestones and contingencies',
            trait: 'strategicPlanning'
        },
        {
            id: 19,
            category: 'Emotional Intelligence',
            question: 'I recognize and respond appropriately to others emotional states',
            trait: 'emotionalIntelligence'
        },
        {
            id: 20,
            category: 'Decision Making',
            question: 'I make informed decisions quickly, even with incomplete information',
            trait: 'decisionMaking'
        },
        {
            id: 21,
            category: 'Learning Agility',
            question: 'I rapidly acquire new skills and apply them to unfamiliar situations',
            trait: 'learningAgility'
        },
        {
            id: 22,
            category: 'Risk Management',
            question: 'I assess potential risks and develop effective mitigation strategies',
            trait: 'riskManagement'
        },
        {
            id: 23,
            category: 'Client Focus',
            question: 'I prioritize customer needs and consistently exceed expectations',
            trait: 'clientFocus'
        },
        {
            id: 24,
            category: 'Data-Driven Thinking',
            question: 'I base my conclusions on quantitative evidence rather than intuition',
            trait: 'dataDriven'
        },
        {
            id: 25,
            category: 'Accountability',
            question: 'I take full responsibility for my work outcomes and mistakes',
            trait: 'accountability'
        },
        {
            id: 26,
            category: 'Influence',
            question: 'I persuade stakeholders to support my proposals and ideas',
            trait: 'influence'
        },
        {
            id: 27,
            category: 'Quality Orientation',
            question: 'I maintain high standards and refuse to compromise on deliverable quality',
            trait: 'qualityOrientation'
        },
        {
            id: 28,
            category: 'Continuous Improvement',
            question: 'I actively seek feedback and implement changes to enhance performance',
            trait: 'continuousImprovement'
        },
    ];

    const handleAnswer = (score) => {
        const question = questions[currentQuestion];
        const newAnswers = { ...answers, [question.trait]: score };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // All questions answered, show results
            setShowResults(true);
        }
    };

    const completeTest = async () => {
        const traits = {};
        Object.keys(answers).forEach(key => {
            traits[key] = answers[key] / 5;
        });

        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0) / questions.length;
        const now = new Date().toISOString();

        const testResults = {
            testName: 'Career Traits Assessment',
            traits,
            score: totalScore,
            progress: 100,
            responses: answers,
            takenAt: now,
        };

        try {
            setPsychLoading(true);
            
            // Save to database
            await apiClient.post('/psychometric/results', testResults);
            
            // Update local store
            setPsychometric(testResults);
            
            navigate('/profile');
        } catch (error) {
            console.error('Failed to save psychometric results:', error);
            alert('Failed to save test results. Please try again.');
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    // Prepare traits data for radar chart
    const getTraitsData = () => {
        if (Object.keys(answers).length === 0) return [];
        
        return Object.entries(answers).map(([key, value]) => ({
            trait: key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
            score: (value / 5) * 100, // Convert 1-5 scale to 0-100
        }));
    };

    // Show results preview after all questions answered
    if (showResults) {
        const traitsData = getTraitsData();
        const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / questions.length;

        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <Card className="mb-6" gradient>
                        <CardContent className="p-8 text-center">
                            <div className="text-6xl mb-4 animate-float">🎉</div>
                            <CardTitle className="mb-2 text-3xl">Assessment Complete!</CardTitle>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Review your personality profile below
                            </p>
                        </CardContent>
                    </Card>

                    {/* Large Radar Chart */}
                    <Card gradient className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Your Personality Traits</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ResponsiveContainer width="100%" height={850}>
                                <RadarChart data={traitsData}>
                                    <PolarGrid stroke="#8b5cf6" strokeOpacity={0.3} />
                                    <PolarAngleAxis 
                                        dataKey="trait" 
                                        tick={(props) => {
                                            const { x, y, payload } = props;
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor="middle"
                                                    fill="#374151"
                                                    fontSize={14}
                                                    fontWeight={600}
                                                >
                                                    {payload.value}
                                                </text>
                                            );
                                        }}
                                    />
                                    <PolarRadiusAxis 
                                        domain={[0, 100]} 
                                        tick={{ fill: '#6b7280', fontSize: 13 }}
                                        axisLine={false}
                                    />
                                    <Radar 
                                        name="Score" 
                                        dataKey="score" 
                                        stroke="#8b5cf6" 
                                        fill="#8b5cf6" 
                                        fillOpacity={0.65}
                                        strokeWidth={3}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '2px solid #8b5cf6',
                                            borderRadius: '8px',
                                            padding: '10px 14px'
                                        }}
                                        formatter={(value) => [`${Math.round(value)}%`, 'Score']}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>

                            <div className="mt-6 text-center">
                                <div className="inline-block bg-gradient-to-r from-brand-blue to-brand-purple rounded-lg px-6 py-3 text-white">
                                    <span className="text-sm font-medium">Overall Score: </span>
                                    <span className="text-2xl font-bold">{Math.round((avgScore / 5) * 100)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-4 justify-center">
                        <Button 
                            onClick={completeTest}
                            size="lg" 
                            className="px-12 py-6 text-lg"
                        >
                            🚀 Submit & View Profile
                        </Button>
                        <Button 
                            onClick={() => {
                                setShowResults(false);
                                setCurrentQuestion(0);
                                setAnswers({});
                            }}
                            variant="outline"
                            size="lg"
                            className="px-12 py-6 text-lg"
                        >
                            ← Retake Test
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Show previous results
    if (showPreviousResults && psychometric.traits) {
        const previousTraitsData = Object.entries(psychometric.traits).map(([key, value]) => ({
            trait: key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
            score: value * 100,
        }));
        const avgScore = psychometric.score || 0;

        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <Card className="mb-6" gradient>
                        <CardContent className="p-8 text-center">
                            <div className="text-6xl mb-4 animate-float">📊</div>
                            <CardTitle className="mb-2 text-3xl">Your Previous Results</CardTitle>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Completed on {new Date(psychometric.takenAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Large Radar Chart */}
                    <Card gradient className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Your Personality Traits</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ResponsiveContainer width="100%" height={850}>
                                <RadarChart data={previousTraitsData}>
                                    <PolarGrid stroke="#8b5cf6" strokeOpacity={0.3} />
                                    <PolarAngleAxis 
                                        dataKey="trait" 
                                        tick={(props) => {
                                            const { x, y, payload } = props;
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor="middle"
                                                    fill="#374151"
                                                    fontSize={14}
                                                    fontWeight={600}
                                                >
                                                    {payload.value}
                                                </text>
                                            );
                                        }}
                                    />
                                    <PolarRadiusAxis 
                                        domain={[0, 100]} 
                                        tick={{ fill: '#6b7280', fontSize: 13 }}
                                        axisLine={false}
                                    />
                                    <Radar 
                                        name="Score" 
                                        dataKey="score" 
                                        stroke="#8b5cf6" 
                                        fill="#8b5cf6" 
                                        fillOpacity={0.65}
                                        strokeWidth={3}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '2px solid #8b5cf6',
                                            borderRadius: '8px',
                                            padding: '10px 14px'
                                        }}
                                        formatter={(value) => [`${Math.round(value)}%`, 'Score']}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>

                            <div className="mt-6 text-center">
                                <div className="inline-block bg-gradient-to-r from-brand-blue to-brand-purple rounded-lg px-6 py-3 text-white">
                                    <span className="text-sm font-medium">Overall Score: </span>
                                    <span className="text-2xl font-bold">{Math.round((avgScore / 5) * 100)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Back Button */}
                    <div className="flex gap-4 justify-center">
                        <Button 
                            onClick={() => setShowPreviousResults(false)}
                            variant="outline"
                            size="lg"
                            className="px-12 py-6 text-lg"
                        >
                            ← Back
                        </Button>
                        <Button 
                            onClick={() => {
                                setShowPreviousResults(false);
                                setShowTest(true);
                                setCurrentQuestion(0);
                                setAnswers({});
                                setShowResults(false);
                            }}
                            size="lg"
                            className="px-12 py-6 text-lg"
                        >
                            Retake Assessment
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (psychometric.takenAt && !showTest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 flex items-center justify-center px-4">
                <Card className="max-w-2xl w-full">
                    <CardContent className="pt-8 text-center">
                        <div className="text-6xl mb-6 animate-float">✅</div>
                        <CardTitle className="mb-4">Personality Assessment Completed!</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            You completed the assessment on {new Date(psychometric.takenAt).toLocaleDateString()}
                        </p>
                        <div className="space-y-4">
                            <Button 
                                onClick={() => setShowPreviousResults(true)}
                                size="lg" 
                                className="w-full"
                            >
                                📊 View Previous Results
                            </Button>
                            <Button onClick={() => navigate('/profile')} size="lg" variant="outline" className="w-full">
                                View Profile
                            </Button>
                            <Button 
                                onClick={() => {
                                    setShowTest(true);
                                    setCurrentQuestion(0);
                                    setAnswers({});
                                    setShowResults(false);
                                }} 
                                variant="outline" 
                                className="w-full"
                            >
                                Retake Assessment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!showTest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 flex items-center justify-center px-4">
                <Card className="max-w-2xl w-full" gradient>
                    <CardContent className="p-8 text-center">
                        <div className="text-6xl mb-6 animate-float">🧠</div>
                        <CardTitle className="mb-4">AI-Powered Personality Assessment</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Complete a quick 5-minute personality test to help our AI understand your
                            strengths, work style, and career preferences for better recommendations.
                        </p>

                        <div className="bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl p-6 mb-8 text-white">
                            <h3 className="font-semibold text-lg mb-3">
                                What we'll assess:
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-left">
                                <div className="flex items-start gap-2">
                                    <span>🎯</span>
                                    <span>Analytical vs Creative thinking</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>👥</span>
                                    <span>Leadership potential</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>🤝</span>
                                    <span>Teamwork preferences</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>💻</span>
                                    <span>Technical aptitude</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>💬</span>
                                    <span>Communication style</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>💡</span>
                                    <span>Innovation mindset</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button onClick={() => setShowTest(true)} size="lg" className="w-full">
                                🚀 Start Test (2 min)
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/profile')} className="w-full">
                                Skip for Now →
                            </Button>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                            Your responses are used solely for career recommendations
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className="text-sm font-medium text-brand-blue">
                            {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-brand-blue to-brand-purple h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <Card className="animate-fade-in" gradient>
                    <CardHeader>
                        <span className="text-brand-blue font-semibold text-sm mb-2 block">
                            {questions[currentQuestion].category}
                        </span>
                        <CardTitle className="text-2xl">
                            {questions[currentQuestion].question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { label: 'Strongly Disagree', score: 1, emoji: '❌' },
                                { label: 'Disagree', score: 2, emoji: '👎' },
                                { label: 'Neutral', score: 3, emoji: '😐' },
                                { label: 'Agree', score: 4, emoji: '👍' },
                                { label: 'Strongly Agree', score: 5, emoji: '✅' },
                            ].map((option) => (
                                <button
                                    key={option.score}
                                    onClick={() => handleAnswer(option.score)}
                                    className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:bg-brand-blue/5 dark:hover:bg-brand-blue/10 transition-all duration-200 flex items-center gap-3 text-left group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">
                                        {option.emoji}
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium flex-1">
                                        {option.label}
                                    </span>
                                    <span className="text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                        →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Back Button */}
                {currentQuestion > 0 && (
                    <div className="mt-6 text-center">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        >
                            ← Previous Question
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PsychometricPage;