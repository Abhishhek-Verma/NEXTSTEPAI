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

    // Transform psychometric traits for charts
    const psychTraits = Object.entries(psychometric.traits || {}).map(([key, value]) => ({
        trait: key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
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
            bgClass: 'card-pastel-blue',
            action: () => navigate('/academic'),
        },
        {
            label: 'Coding Profiles',
            value: `${connectedPlatforms}/${totalPlatforms}`,
            icon: '💻',
            bgClass: 'card-pastel-purple',
            action: () => navigate('/coding'),
        },
        {
            label: 'Personality Test',
            value: psychometric.takenAt ? 'Complete' : 'Pending',
            icon: '🧠',
            bgClass: 'card-pastel-mint',
            action: () => navigate('/psychometric'),
        },
        {
            label: 'Career Roadmap',
            value: roadmap.items.length > 0 ? 'Generated' : 'Not Started',
            icon: '🗺️',
            bgClass: 'card-pastel-yellow',
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
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="heading-serif text-display text-[#111111] dark:text-white">
                            Welcome back, {user?.firstName || 'User'}! 👋
                        </h1>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            Here's your career progress overview
                        </p>
                    </div>
                    <Button onClick={() => navigate('/analyze')}>
                        🔬 Analyze My Profile
                    </Button>
                </div>

                {/* Overall Progress */}
                <Card className="mb-8" pastel="blue">
                    <CardContent className="p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                            <div>
                                <h2 className="text-xl font-semibold text-[#111111] dark:text-white">Profile Completion</h2>
                                <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1 text-sm">
                                    Complete your profile to get personalized recommendations
                                </p>
                            </div>
                            <div className="text-4xl font-bold text-[#111111] dark:text-white">{progressPercentage}%</div>
                        </div>
                        <div className="w-full bg-white/50 dark:bg-white/10 rounded-full h-3">
                            <div
                                className="bg-[#111111] dark:bg-white h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            onClick={stat.action}
                            className={`${stat.bgClass} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <span className="text-sm text-[#6B6B6B]">→</span>
                            </div>
                            <p className="text-sm text-[#6B6B6B] mb-1">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-semibold text-[#111111]">
                                {stat.value}
                            </p>
                        </div>
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
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DF" />
                                        <XAxis dataKey="semester" stroke="#909090" fontSize={12} label={{ value: 'Semester', position: 'insideBottom', offset: -5, fill: '#909090' }} />
                                        <YAxis domain={[0, 10]} stroke="#909090" fontSize={12} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E8E5DF', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="gpa" stroke="#111111" strokeWidth={2.5} dot={{ fill: '#111111', r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-[#6B6B6B]">
                                        Average GPA: <span className="font-semibold text-[#111111] dark:text-white">{gpaAverage}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Personality Traits - Full Radar Chart */}
                    {psychTraits.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Personality Traits</CardTitle>
                                <p className="text-sm text-[#909090] mt-1">
                                    Hover over the chart to see trait names and scores
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={500}>
                                    <RadarChart data={psychTraits}>
                                        <PolarGrid stroke="#E8E5DF" strokeOpacity={0.8} />
                                        <PolarAngleAxis
                                            dataKey="trait"
                                            tick={false}
                                        />
                                        <PolarRadiusAxis
                                            domain={[0, 100]}
                                            tick={{ fill: '#909090', fontSize: 11 }}
                                            axisLine={false}
                                        />
                                        <Radar
                                            name="Score"
                                            dataKey="score"
                                            stroke="#111111"
                                            fill="#DCEAFF"
                                            fillOpacity={0.6}
                                            strokeWidth={2}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E8E5DF',
                                                borderRadius: '16px',
                                                padding: '10px 14px',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
                                            }}
                                            formatter={(value, name, props) => [
                                                `${Math.round(value)}%`,
                                                props.payload.trait
                                            ]}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Coding Platforms Bar Chart */}
                    {connectedPlatforms > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Coding Platforms</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={platformStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DF" />
                                        <XAxis dataKey="platform" stroke="#909090" fontSize={12} />
                                        <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#909090" fontSize={12} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E8E5DF' }} />
                                        <Bar dataKey="connected" fill="#D4F2E3" stroke="#10B981" strokeWidth={1} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>

                {/* Next Steps */}
                {progressPercentage < 100 && (
                    <div className="card-pastel-yellow rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl">⚡</span>
                            <div>
                                <h3 className="text-lg font-semibold text-[#111111] mb-2">
                                    Complete Your Profile
                                </h3>
                                <ul className="space-y-2 text-sm text-[#6B6B6B]">
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