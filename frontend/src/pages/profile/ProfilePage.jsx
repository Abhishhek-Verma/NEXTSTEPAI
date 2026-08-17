import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../../store';
import Icon from '../../components/AppIcon';

const ProfilePage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { academics, coding, psychometric, roadmap, getGPAAverage, getGPATrend } = useStore();

    const gpaAverage = getGPAAverage();
    const gpaTrend = getGPATrend();

    // Transform psychometric traits for radar chart
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

    // Profile Completion score calculation
    const progressPercentage = Math.round(
        ((academics.records.length > 0 ? 25 : 0) +
            (connectedPlatforms > 0 ? 25 : 0) +
            (psychometric.takenAt ? 25 : 0) +
            (roadmap.items.length > 0 ? 25 : 0))
    );

    const stats = [
        {
            label: 'Academic Records',
            value: academics.records.length > 0 ? `${academics.records.length} Semesters` : 'No Data',
            subtext: `Avg GPA: ${gpaAverage}`,
            iconName: 'GraduationCap',
            action: () => navigate('/academic'),
            statusColor: academics.records.length > 0 ? 'text-[#FF5722]' : 'text-[#555555]'
        },
        {
            label: 'Coding Profiles',
            value: `${connectedPlatforms}/${totalPlatforms}`,
            subtext: connectedPlatforms > 0 ? 'Platforms Linked' : 'Connect Platforms',
            iconName: 'Code2',
            action: () => navigate('/coding'),
            statusColor: connectedPlatforms > 0 ? 'text-[#FF5722]' : 'text-[#555555]'
        },
        {
            label: 'Personality Assessment',
            value: psychometric.takenAt ? 'Completed' : 'Pending',
            subtext: psychometric.takenAt ? 'Traits Mapped' : 'Take 5-min Test',
            iconName: 'Brain',
            action: () => navigate('/psychometric'),
            statusColor: psychometric.takenAt ? 'text-[#FF5722]' : 'text-[#555555]'
        },
        {
            label: 'Career Roadmap',
            value: roadmap.items.length > 0 ? 'Generated' : 'Not Started',
            subtext: roadmap.items.length > 0 ? `${roadmap.items.length} Milestones` : 'Create Roadmap',
            iconName: 'Compass',
            action: () => navigate('/roadmap'),
            statusColor: roadmap.items.length > 0 ? 'text-[#FF5722]' : 'text-[#555555]'
        },
    ];

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 bg-[#F9F8F6] dark:bg-[#1C1B1A]">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141414] dark:text-white tracking-tight">
                            Welcome back, <span className="text-[#FF5722]">{user?.firstName || 'Student'}!</span>
                        </h1>
                        <p className="text-sm text-[#555555] dark:text-[#A1A1A1] mt-1">
                            Here's your live career & skill progress overview
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/analyze')}
                        className="px-6 py-3 bg-[#FF5722] hover:bg-[#e04d1d] text-white text-sm font-extrabold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <Icon name="Sparkles" size={18} />
                        Analyze My Profile
                    </button>
                </div>

                {/* BENTO CONTAINER ROW 1: PROFILE SUMMARY & SCORE GAUGE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* CARD 1: PROFILE COMPLETION GAUGE (DARK ONYX CARD) */}
                    <div className="bg-[#141414] text-white rounded-3xl p-6 border border-[#262422] shadow-xl flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FF5722]/20 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex justify-between items-center text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5 text-white">
                                <Icon name="Target" size={15} className="text-[#FF5722]" />
                                PROFILE COMPLETION
                            </span>
                            <span className="text-[#FF5722] font-extrabold">{progressPercentage}%</span>
                        </div>

                        {/* Gauge Ring Visual */}
                        <div className="relative py-4 flex items-center justify-center">
                            <svg className="w-44 h-44 transform -rotate-90">
                                <circle
                                    cx="88"
                                    cy="88"
                                    r="68"
                                    stroke="#262422"
                                    strokeWidth="14"
                                    fill="transparent"
                                />
                                <circle
                                    cx="88"
                                    cy="88"
                                    r="68"
                                    stroke="#FF5722"
                                    strokeWidth="14"
                                    strokeDasharray="427"
                                    strokeDashoffset={427 - (427 * progressPercentage) / 100}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-extrabold text-white tracking-tight">
                                    {progressPercentage}%
                                </span>
                                <span className="text-xs text-[#A1A1A1] font-medium mt-0.5">Readiness</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#262422] text-xs flex justify-between items-center text-[#A1A1A1]">
                            <span>Status:</span>
                            <span className="font-bold text-white">
                                {progressPercentage === 100 ? '100% Ready' : 'In Progress'}
                            </span>
                        </div>
                    </div>

                    {/* CARD 2: DASHBOARD STATS GRID (WARM BENTO CARD) */}
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between lg:col-span-2">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-[#141414] dark:text-white flex items-center gap-2">
                                    <Icon name="Activity" size={18} className="text-[#FF5722]" />
                                    Profile Modules Overview
                                </h3>
                                <span className="text-xs font-bold text-[#555555] dark:text-[#A1A1A1]">
                                    Click module to manage
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        onClick={stat.action}
                                        className="bg-[#F9F8F6] dark:bg-[#1C1B1A] border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] p-4 rounded-2xl cursor-pointer hover:border-[#FF5722] hover:shadow-md transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center text-[#FF5722] group-hover:scale-105 transition-transform">
                                                <Icon name={stat.iconName} size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-[#555555] dark:text-[#A1A1A1] uppercase tracking-wider">
                                                    {stat.label}
                                                </h4>
                                                <p className="text-base font-extrabold text-[#141414] dark:text-white">
                                                    {stat.value}
                                                </p>
                                                <span className="text-[11px] text-[#555555] dark:text-[#A1A1A1] font-medium">
                                                    {stat.subtext}
                                                </span>
                                            </div>
                                        </div>
                                        <Icon name="ArrowUpRight" size={16} className="text-[#555555] group-hover:text-[#FF5722] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Navigation Pills */}
                        <div className="pt-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex flex-wrap gap-2 mt-4">
                            <button
                                onClick={() => navigate('/recommendations')}
                                className="px-4 py-2 bg-[#141414] hover:bg-[#262422] text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                            >
                                <Icon name="Briefcase" size={14} /> Career Recommendations
                            </button>
                            <button
                                onClick={() => navigate('/roadmap')}
                                className="px-4 py-2 bg-white dark:bg-[#1C1B1A] border border-[#D9CFC7] text-[#141414] dark:text-white text-xs font-bold rounded-full hover:bg-[#F9F8F6] transition-all flex items-center gap-1.5"
                            >
                                <Icon name="Compass" size={14} /> Career Roadmap
                            </button>
                            <button
                                onClick={() => navigate('/projects')}
                                className="px-4 py-2 bg-white dark:bg-[#1C1B1A] border border-[#D9CFC7] text-[#141414] dark:text-white text-xs font-bold rounded-full hover:bg-[#F9F8F6] transition-all flex items-center gap-1.5"
                            >
                                <Icon name="FolderKanban" size={14} /> Manage Projects
                            </button>
                        </div>
                    </div>
                </div>

                {/* BENTO CONTAINER ROW 2: REAL RECHARTS CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* GPA TREND CHART CARD */}
                    {gpaTrend.length > 0 ? (
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-[#141414] dark:text-white flex items-center gap-2">
                                        <Icon name="TrendingUp" size={18} className="text-[#FF5722]" />
                                        GPA Performance Trend
                                    </h3>
                                    <p className="text-xs text-[#555555] dark:text-[#A1A1A1]">Semester wise academic record</p>
                                </div>
                                <span className="px-3 py-1 bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20 font-extrabold text-xs rounded-full">
                                    Avg GPA: {gpaAverage}
                                </span>
                            </div>

                            <div className="h-80 w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={gpaTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#D9CFC7" opacity={0.4} />
                                        <XAxis dataKey="semester" stroke="#555555" fontSize={11} />
                                        <YAxis domain={[0, 10]} stroke="#555555" fontSize={11} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: '1px solid #D9CFC7',
                                                backgroundColor: '#F9F8F6',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="gpa"
                                            stroke="#FF5722"
                                            strokeWidth={3}
                                            dot={{ fill: '#FF5722', r: 6, stroke: '#141414', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="pt-3 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-between items-center text-xs">
                                <span className="text-[#555555] dark:text-[#A1A1A1]">Semesters Logged: {gpaTrend.length}</span>
                                <button onClick={() => navigate('/academic')} className="font-bold text-[#141414] dark:text-white hover:text-[#FF5722] transition-colors">
                                    Update Academic Records →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between items-center text-center py-12">
                            <div className="w-12 h-12 rounded-2xl bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] mb-3">
                                <Icon name="GraduationCap" size={24} />
                            </div>
                            <h3 className="text-base font-bold text-[#141414] dark:text-white">Academic Records Pending</h3>
                            <p className="text-xs text-[#555555] dark:text-[#A1A1A1] max-w-xs mt-1 mb-4">
                                Add your semester GPA data to unlock GPA trend analysis and placement predictions.
                            </p>
                            <button
                                onClick={() => navigate('/academic')}
                                className="px-5 py-2.5 bg-[#FF5722] text-white text-xs font-bold rounded-full hover:bg-[#e04d1d] transition-all"
                            >
                                Add Academic Records
                            </button>
                        </div>
                    )}

                    {/* PERSONALITY TRAITS RADAR CHART CARD */}
                    {psychTraits.length > 0 ? (
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-[#141414] dark:text-white flex items-center gap-2">
                                        <Icon name="Brain" size={18} className="text-[#FF5722]" />
                                        Personality & Work Traits
                                    </h3>
                                    <p className="text-xs text-[#555555] dark:text-[#A1A1A1]">Psychometric fit breakdown</p>
                                </div>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-extrabold text-xs rounded-full">
                                    Assessed
                                </span>
                            </div>

                            <div className="h-80 w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="68%" data={psychTraits}>
                                        <PolarGrid stroke="#D9CFC7" strokeOpacity={0.6} />
                                        <PolarAngleAxis
                                            dataKey="trait"
                                            tick={{ fill: '#555555', fontSize: 8, fontWeight: 600 }}
                                            tickFormatter={(t) => (t.length > 13 ? `${t.substring(0, 11)}…` : t)}
                                        />
                                        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#888888', fontSize: 8 }} axisLine={false} />
                                        <Radar name="Score" dataKey="score" stroke="#FF5722" fill="#FF5722" fillOpacity={0.35} strokeWidth={2} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#F9F8F6',
                                                border: '1px solid #D9CFC7',
                                                borderRadius: '14px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                                            }}
                                            formatter={(val, name, props) => [`${val}%`, props?.payload?.trait || 'Score']}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="pt-3 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-between items-center text-xs">
                                <span className="text-[#555555] dark:text-[#A1A1A1]">Traits Measured: {psychTraits.length}</span>
                                <button onClick={() => navigate('/psychometric')} className="font-bold text-[#141414] dark:text-white hover:text-[#FF5722] transition-colors">
                                    Retake Test →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between items-center text-center py-12">
                            <div className="w-12 h-12 rounded-2xl bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] mb-3">
                                <Icon name="Brain" size={24} />
                            </div>
                            <h3 className="text-base font-bold text-[#141414] dark:text-white">Psychometric Test Pending</h3>
                            <p className="text-xs text-[#555555] dark:text-[#A1A1A1] max-w-xs mt-1 mb-4">
                                Complete your 5-minute personality assessment to unlock work environment fit and career mapping.
                            </p>
                            <button
                                onClick={() => navigate('/psychometric')}
                                className="px-5 py-2.5 bg-[#FF5722] text-white text-xs font-bold rounded-full hover:bg-[#e04d1d] transition-all"
                            >
                                Take Assessment
                            </button>
                        </div>
                    )}
                </div>

                {/* BENTO CONTAINER ROW 3: CODING PLATFORMS & NEXT STEPS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* CODING PLATFORMS BAR CHART CARD */}
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-[#141414] dark:text-white flex items-center gap-2">
                                    <Icon name="Code2" size={18} className="text-[#FF5722]" />
                                    Coding Platforms
                                </h3>
                                <span className="text-xs font-bold text-[#FF5722]">
                                    {connectedPlatforms}/{totalPlatforms} Connected
                                </span>
                            </div>

                            <div className="h-44 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={platformStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#D9CFC7" opacity={0.4} />
                                        <XAxis dataKey="platform" stroke="#555555" fontSize={11} />
                                        <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#555555" fontSize={11} />
                                        <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #D9CFC7', backgroundColor: '#F9F8F6', fontSize: '12px' }} />
                                        <Bar dataKey="connected" fill="#FF5722" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-between items-center text-xs mt-4">
                            <span className="text-[#555555] dark:text-[#A1A1A1]">GitHub, LeetCode, etc.</span>
                            <button onClick={() => navigate('/coding')} className="font-bold text-[#141414] dark:text-white hover:text-[#FF5722] transition-colors">
                                Manage Links →
                            </button>
                        </div>
                    </div>

                    {/* COMPLETE YOUR PROFILE CHECKLIST CARD (LG SPAN 2) */}
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card lg:col-span-2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#FF5722] rounded-2xl flex items-center justify-center text-white shadow-md">
                                    <Icon name="CheckCircle2" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#141414] dark:text-white">
                                        Action Checklist for Full Readiness
                                    </h3>
                                    <p className="text-xs text-[#555555] dark:text-[#A1A1A1]">
                                        Complete pending steps to generate high-accuracy AI recommendations
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div
                                    onClick={() => navigate('/academic')}
                                    className="p-3.5 bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex items-center justify-between cursor-pointer hover:border-[#FF5722] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            name={academics.records.length > 0 ? "Check" : "Circle"}
                                            size={18}
                                            className={academics.records.length > 0 ? "text-[#FF5722]" : "text-[#555555]"}
                                        />
                                        <span className="text-xs font-bold text-[#141414] dark:text-white">Academic Transcripts & GPA</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#555555]">
                                        {academics.records.length > 0 ? 'Completed' : 'Action Needed →'}
                                    </span>
                                </div>

                                <div
                                    onClick={() => navigate('/coding')}
                                    className="p-3.5 bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex items-center justify-between cursor-pointer hover:border-[#FF5722] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            name={connectedPlatforms > 0 ? "Check" : "Circle"}
                                            size={18}
                                            className={connectedPlatforms > 0 ? "text-[#FF5722]" : "text-[#555555]"}
                                        />
                                        <span className="text-xs font-bold text-[#141414] dark:text-white">Connect Coding Platform Handles</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#555555]">
                                        {connectedPlatforms > 0 ? `${connectedPlatforms} Connected` : 'Action Needed →'}
                                    </span>
                                </div>

                                <div
                                    onClick={() => navigate('/psychometric')}
                                    className="p-3.5 bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex items-center justify-between cursor-pointer hover:border-[#FF5722] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            name={psychometric.takenAt ? "Check" : "Circle"}
                                            size={18}
                                            className={psychometric.takenAt ? "text-[#FF5722]" : "text-[#555555]"}
                                        />
                                        <span className="text-xs font-bold text-[#141414] dark:text-white">Psychometric Personality Test</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#555555]">
                                        {psychometric.takenAt ? 'Completed' : 'Action Needed →'}
                                    </span>
                                </div>

                                <div
                                    onClick={() => navigate('/roadmap')}
                                    className="p-3.5 bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex items-center justify-between cursor-pointer hover:border-[#FF5722] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            name={roadmap.items.length > 0 ? "Check" : "Circle"}
                                            size={18}
                                            className={roadmap.items.length > 0 ? "text-[#FF5722]" : "text-[#555555]"}
                                        />
                                        <span className="text-xs font-bold text-[#141414] dark:text-white">Personalized Career Roadmap</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#555555]">
                                        {roadmap.items.length > 0 ? 'Generated' : 'Action Needed →'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-between items-center text-xs mt-4">
                            <span className="text-[#555555] dark:text-[#A1A1A1]">Step 4 of 4 Completed</span>
                            <button onClick={() => navigate('/analyze')} className="font-bold text-[#FF5722] hover:underline">
                                Run Full Profile AI Analysis →
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;