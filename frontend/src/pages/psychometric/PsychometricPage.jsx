import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import useStore from '../../store';

const PsychometricPage = () => {
    const navigate = useNavigate();
    const { psychometric, setPsychometric } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showTest, setShowTest] = useState(false);

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
    ];

    const handleAnswer = (score) => {
        const question = questions[currentQuestion];
        setAnswers({ ...answers, [question.trait]: score });

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            completeTest();
        }
    };

    const completeTest = () => {
        const traits = {};
        Object.keys(answers).forEach(key => {
            traits[key] = answers[key] / 5;
        });

        setPsychometric({
            traits,
            takenAt: new Date().toISOString(),
            score: Object.values(answers).reduce((a, b) => a + b, 0) / questions.length,
        });

        navigate('/profile');
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

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
                            <Button onClick={() => navigate('/profile')} size="lg" className="w-full">
                                View Profile
                            </Button>
                            <Button onClick={() => setShowTest(true)} variant="outline" className="w-full">
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