import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Icon from '../../components/AppIcon';

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
            iconName: 'GraduationCap',
            action: () => navigate('/academic'),
        },
        {
            label: 'Coding Profiles',
            value: `${connectedPlatforms}/${totalPlatforms}`,
            iconName: 'Code2',
            action: () => navigate('/coding'),
        },
        {
            label: 'Personality Test',
            value: psychometric.takenAt ? 'Complete' : 'Pending',
            iconName: 'UserCheck',
            action: () => navigate('/psychometric'),
        },
        {
            label: 'Career Roadmap',
            value: roadmap.items.length > 0 ? 'Generated' : 'Not Started',
            iconName: 'Compass',
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
        <div className="min-h-screen py-6 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="heading-serif text-display text-[#000000] dark:text-white">
                            Welcome back, {user?.firstName || 'User'}!
                        </h1>
                        <p className="text-[#555555] dark:text-[#A1A1A1] mt-1">
                            Here's your career progress overview
                        </p>
                    </div>
                    <Button onClick={() => navigate('/analyze')} className="flex items-center gap-2">
                        <Icon name="Sparkles" size={18} strokeWidth={2} />
                        Analyze My Profile
                    </Button>
                </div>

                {/* Overall Progress */}
                <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-6 lg:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                        <div>
                            <h2 className="text-xl font-semibold text-[#000000] dark:text-white">Profile Completion</h2>
                            <p className="text-[#555555] dark:text-[#A1A1A1] mt-1 text-sm">
                                Complete your profile to get personalized recommendations
                            </p>
                        </div>
                        <div className="text-4xl font-bold text-[#000000] dark:text-white">{progressPercentage}%</div>
                    </div>
                    <div className="w-full bg-[#D9CFC7]/50 dark:bg-[rgba(255,255,255,0.06)] rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-[#000000] dark:bg-[#C9B59C] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            onClick={stat.action}
                            className="bg-[#EFE9E3] dark:bg-[#262422] border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-11 h-11 bg-[#F9F8F6] dark:bg-[#1C1B1A] border border-[#D9CFC7] rounded-xl flex items-center justify-center text-[#000000] dark:text-white group-hover:bg-[#C9B59C] transition-colors">
                                    <Icon name={stat.iconName} size={22} strokeWidth={2} />
                                </div>
                                <Icon name="ArrowUpRight" size={18} className="text-[#555555] group-hover:text-[#000000] transition-colors" />
                            </div>
                            <p className="text-sm font-medium text-[#555555] dark:text-[#A1A1A1] mb-1">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-[#000000] dark:text-white">
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
                                        <CartesianGrid strokeDasharray="3 3" stroke="#D9CFC7" opacity={0.5} />
                                        <XAxis dataKey="semester" stroke="#555555" fontSize={12} label={{ value: 'Semester', position: 'insideBottom', offset: -5, fill: '#555555' }} />
                                        <YAxis domain={[0, 10]} stroke="#555555" fontSize={12} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #D9CFC7', backgroundColor: '#F9F8F6', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="gpa" stroke="#000000" strokeWidth={2.5} dot={{ fill: '#C9B59C', r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-[#555555]">
                                        Average GPA: <span className="font-semibold text-[#000000] dark:text-white">{gpaAverage}</span>
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
                                <p className="text-sm text-[#555555] dark:text-[#A1A1A1] mt-1">
                                    Hover over the chart to see trait names and scores
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={500}>
                                    <RadarChart data={psychTraits}>
                                        <PolarGrid stroke="#D9CFC7" strokeOpacity={0.8} />
                                        <PolarAngleAxis
                                            dataKey="trait"
                                            tick={false}
                                        />
                                        <PolarRadiusAxis
                                            domain={[0, 100]}
                                            tick={{ fill: '#555555', fontSize: 11 }}
                                            axisLine={false}
                                        />
                                        <Radar
                                            name="Score"
                                            dataKey="score"
                                            stroke="#000000"
                                            fill="#C9B59C"
                                            fillOpacity={0.6}
                                            strokeWidth={2}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#F9F8F6',
                                                border: '1px solid #D9CFC7',
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
                                        <CartesianGrid strokeDasharray="3 3" stroke="#D9CFC7" opacity={0.5} />
                                        <XAxis dataKey="platform" stroke="#555555" fontSize={12} />
                                        <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#555555" fontSize={12} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #D9CFC7', backgroundColor: '#F9F8F6' }} />
                                        <Bar dataKey="connected" fill="#C9B59C" stroke="#000000" strokeWidth={1} radius={[8, 8, 0, 0]} />
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
                                    className="w-full justify-start gap-2.5"
                                    onClick={() => navigate('/recommendations')}
                                >
                                    <Icon name="Briefcase" size={18} strokeWidth={1.8} /> View Career Recommendations
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2.5"
                                    onClick={() => navigate('/roadmap')}
                                >
                                    <Icon name="Compass" size={18} strokeWidth={1.8} /> Generate Roadmap
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2.5"
                                    onClick={() => navigate('/projects')}
                                >
                                    <Icon name="FolderKanban" size={18} strokeWidth={1.8} /> Manage Projects
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2.5"
                                    onClick={() => navigate('/academic')}
                                >
                                    <Icon name="GraduationCap" size={18} strokeWidth={1.8} /> Update Academic Records
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Next Steps */}
                {progressPercentage < 100 && (
                    <div className="bg-[#EFE9E3] border border-[#D9CFC7] rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#C9B59C] rounded-xl flex items-center justify-center text-[#000000] flex-shrink-0 mt-0.5">
                                <Icon name="Sparkles" size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#000000] mb-2">
                                    Complete Your Profile
                                </h3>
                                <ul className="space-y-2 text-sm text-[#555555]">
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