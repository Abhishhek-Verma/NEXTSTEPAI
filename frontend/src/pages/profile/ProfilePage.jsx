import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ProfilePage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { academics, coding, psychometric, recommendations, roadmap, getGPAAverage, getGPATrend } = useStore();

    const gpaAverage = getGPAAverage();
    const gpaTrend = getGPATrend();

    // Transform psychometric traits for radar chart
    const psychTraits = Object.entries(psychometric.traits || {}).map(([key, value]) => ({
        trait: key.charAt(0).toUpperCase() + key.slice(1),
        score: Math.round(value * 100),
    }));

    // Platform completion stats
    const platformStats = Object.entries(coding.platforms).map(([platform, data]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        connected: data.profileUrl ? 1 : 0,
    }));

    const totalPlatforms = platformStats.length;
    const connectedPlatforms = platformStats.filter(p => p.connected).length;

    const stats = [
        {
            label: 'Academic Records',
            value: academics.records.length,
            icon: '📚',
            color: 'bg-blue-500',
            action: () => navigate('/academic'),
        },
        {
            label: 'Coding Profiles',
            value: `${connectedPlatforms}/${totalPlatforms}`,
            icon: '💻',
            color: 'bg-purple-500',
            action: () => navigate('/coding'),
        },
        {
            label: 'Personality Test',
            value: psychometric.takenAt ? 'Complete' : 'Pending',
            icon: '🧠',
            color: 'bg-green-500',
            action: () => navigate('/psychometric'),
        },
        {
            label: 'Career Roadmap',
            value: roadmap.items.length > 0 ? 'Generated' : 'Not Started',
            icon: '🗺️',
            color: 'bg-orange-500',
            action: () => navigate('/roadmap'),
        },
    ];

    const progressPercentage = Math.round(
        ((academics.records.length > 0 ? 25 : 0) +
            (connectedPlatforms > 0 ? 25 : 0) +
            (psychometric.takenAt ? 25 : 0) +
            (roadmap.items.length > 0 ? 25 : 0))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent bg-clip-text text-transparent">
                            Welcome back, {user?.firstName || 'User'}! 👋
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Here's your career progress overview
                        </p>
                    </div>
                    <Button onClick={() => navigate('/analyze')}>
                        🔬 Analyze My Profile
                    </Button>
                </div>

                {/* Overall Progress */}
                <Card className="mb-8" gradient>
                    <CardContent className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Completion</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Complete your profile to get personalized recommendations
                                </p>
                            </div>
                            <div className="text-5xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">{progressPercentage}%</div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent h-4 rounded-full transition-all duration-500 shadow-lg"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            onClick={stat.action}
                            hover
                            className="cursor-pointer"
                        >
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                    <span className="text-sm text-brand-blue">→</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* GPA Trend Chart */}
                    {gpaTrend.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>GPA Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={gpaTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="semester" label={{ value: 'Semester', position: 'insideBottom', offset: -5 }} />
                                        <YAxis domain={[0, 10]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="gpa" stroke="#2563EB" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Average GPA: <span className="font-bold text-brand-blue">{gpaAverage}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Personality Traits Radar */}
                    {psychTraits.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Personality Traits
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={psychTraits}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="trait" />
                                    <PolarRadiusAxis domain={[0, 100]} />
                                    <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Coding Platforms Bar Chart */}
                    {connectedPlatforms > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Coding Platforms
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={platformStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="platform" />
                                    <YAxis domain={[0, 1]} ticks={[0, 1]} />
                                    <Tooltip />
                                    <Bar dataKey="connected" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => navigate('/recommendations')}
                            >
                                <span className="mr-2">💼</span> View Career Recommendations
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => navigate('/roadmap')}
                            >
                                <span className="mr-2">🗺️</span> Generate Roadmap
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => navigate('/projects')}
                            >
                                <span className="mr-2">🚀</span> Manage Projects
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => navigate('/academic')}
                            >
                                <span className="mr-2">📝</span> Update Academic Records
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                {progressPercentage < 100 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl">⚡</span>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                                    Complete Your Profile
                                </h3>
                                <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
                                    {academics.records.length === 0 && (
                                        <li>• Add academic records to track your GPA trends</li>
                                    )}
                                    {connectedPlatforms === 0 && (
                                        <li>• Connect coding platforms to analyze your skills</li>
                                    )}
                                    {!psychometric.takenAt && (
                                        <li>• Complete personality test for better recommendations</li>
                                    )}
                                    {roadmap.items.length === 0 && (
                                        <li>• Generate your personalized career roadmap</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;