import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiClient from '../../api/client';

const CodingPage = () => {
    const navigate = useNavigate();
    const { coding, updatePlatform } = useStore();
    const [activeTab, setActiveTab] = useState('github');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualValues, setManualValues] = useState({});

    // Clear manual input fields when switching tabs
    useEffect(() => {
        setManualValues({});
    }, [activeTab]);

    const platforms = [
        {
            id: 'github',
            name: 'GitHub',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            ),
            color: 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]',
            fields: [
                { key: 'username', label: 'Username', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://github.com/johndoe' },
            ],
            metrics: [
                { key: 'totalRepos', label: 'Total Repositories', icon: '📁' },
                { key: 'totalCommits', label: 'Total Commits', icon: '📊' },
                { key: 'totalStars', label: 'Total Stars', icon: '⭐' },
            ],
        },
        {
            id: 'leetcode',
            name: 'LeetCode',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-2.365-1.914-5.788-1.557-7.791.564L4.046 9.826a5.238 5.238 0 0 0-1.354 2.289 5.076 5.076 0 0 0-.155 1.208c-.01.184-.006.37.01.556.019.191.054.381.103.57.049.189.11.376.184.558.073.182.158.36.253.533.095.173.202.342.318.506.116.164.243.32.38.47l4.287 4.201c2.645 2.589 6.901 2.585 9.542 0l2.396-2.392a2.685 2.685 0 0 0 0-3.804 2.671 2.671 0 0 0-3.802 0l-2.396 2.391a1.631 1.631 0 0 1-2.274-.041l-4.287-4.201c-.313-.307-.48-.697-.48-1.098s.167-.791.48-1.098L9.726 7.118c.83-.889 2.288-1.134 3.301-.462l3.501 2.831a2.69 2.69 0 0 0 3.804-.405 2.684 2.684 0 0 0-.405-3.806l-3.5-2.831C15.395.68 14.45.201 13.483 0z"/>
                </svg>
            ),
            color: 'bg-[#FFF0C9] text-[#92400E]',
            fields: [
                { key: 'username', label: 'Username', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://leetcode.com/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Total Questions Solved', icon: '✅' },
                { key: 'contestRating', label: 'Contest Rating', icon: '🏆' },
                { key: 'contestsAttended', label: 'Contests Attended', icon: '🎯' },
            ],
        },
        {
            id: 'codeforces',
            name: 'Codeforces',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/>
                </svg>
            ),
            color: 'bg-[#DCEAFF] text-[#1E40AF]',
            fields: [
                { key: 'handle', label: 'Handle', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://codeforces.com/profile/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Total Questions Solved', icon: '✅' },
                { key: 'rating', label: 'Current Rating', icon: '📈' },
                { key: 'contests', label: 'Contests Participated', icon: '🎯' },
            ],
        },
        {
            id: 'codechef',
            name: 'CodeChef',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M11.257.004c-.37.01-.735.05-1.095.119a12.06 12.06 0 0 0-2.064.51 12.13 12.13 0 0 0-1.967.947c-3.17 1.89-5.453 5.162-5.97 8.876-.102.736-.103 1.494-.002 2.23.517 3.714 2.8 6.986 5.97 8.876.575.343 1.19.638 1.833.882.646.244 1.32.435 2.01.57a11.77 11.77 0 0 0 2.177.186 11.774 11.774 0 0 0 2.177-.186 11.91 11.91 0 0 0 2.01-.57 12.16 12.16 0 0 0 1.833-.882c3.17-1.89 5.453-5.162 5.97-8.876.101-.736.103-1.494.002-2.23-.517-3.714-2.8-6.986-5.97-8.876a12.096 12.096 0 0 0-1.833-.882 11.91 11.91 0 0 0-2.01-.57 11.77 11.77 0 0 0-2.177-.186c-.37-.01-.735-.05-1.095-.119z"/>
                </svg>
            ),
            color: 'bg-[#FCE5E6] text-[#991B1B]',
            fields: [
                { key: 'handle', label: 'Handle', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://codechef.com/users/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Total Questions Solved', icon: '✅' },
                { key: 'rating', label: 'Current Rating', icon: '⭐' },
                { key: 'contests', label: 'Contests Participated', icon: '🏅' },
            ],
        },
    ];

    const activePlatform = platforms.find((p) => p.id === activeTab);
    const platformData = coding.platforms[activeTab] || {};

    const handleInputChange = (field, value) => {
        updatePlatform(activeTab, { [field]: value });
    };

    const handleMetricChange = (metric, value) => {
        const metrics = platformData.metrics || {};
        updatePlatform(activeTab, {
            metrics: { ...metrics, [metric]: value },
        });
    };

    const handleFetchProfile = async () => {
        setError(null);
        setLoading(true);

        try {
            const usernameKey = activeTab === 'github' || activeTab === 'leetcode' ? 'username' : 'handle';
            const username = platformData[usernameKey];

            if (!username) {
                alert(`Please enter your ${activePlatform.name} ${usernameKey} first`);
                setLoading(false);
                return;
            }

            const endpoint = `/coding/fetch/${activeTab}`;
            const payload = { [usernameKey]: username };

            const response = await apiClient.post(endpoint, payload);

            if (response.data && response.data.metrics) {
                const metrics = response.data.metrics;
                
                updatePlatform(activeTab, {
                    [usernameKey]: username,
                    profileUrl: metrics.profileUrl || platformData.profileUrl || '',
                    metrics: formatPlatformMetrics(activeTab, metrics)
                });

                alert(`✅ ${activePlatform.name} profile fetched successfully!\n\nData has been saved to your profile.`);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch profile';
            setError(errorMessage);
            alert(`❌ Error: ${errorMessage}\n\nPlease check your ${activeTab === 'github' || activeTab === 'leetcode' ? 'username' : 'handle'} and try again.`);
        } finally {
            setLoading(false);
        }
    };

    const formatPlatformMetrics = (platform, data) => {
        switch (platform) {
            case 'github':
                return {
                    totalRepos: data.totalRepos || data.publicRepos || 0,
                    totalCommits: data.totalCommits || 0,
                    totalStars: data.totalStars || 0,
                    followers: data.followers || 0,
                    topLanguages: data.topLanguages?.map(l => l.language).join(', ') || '',
                    lastFetched: data.lastFetched
                };
            case 'leetcode':
                return {
                    problemsSolved: data.problemsSolved?.total || 0,
                    contestRating: data.contestStats?.rating || 0,
                    contestsAttended: data.contestStats?.attended || 0,
                    easy: data.problemsSolved?.easy || 0,
                    medium: data.problemsSolved?.medium || 0,
                    hard: data.problemsSolved?.hard || 0,
                    acceptanceRate: data.acceptanceRate || 0,
                    lastFetched: data.lastFetched
                };
            case 'codeforces':
                return {
                    problemsSolved: data.stats?.problemsSolved || 0,
                    rating: data.rating || 0,
                    contests: data.stats?.contestsParticipated || 0,
                    maxRating: data.maxRating || 0,
                    rank: data.rank || 'Unrated',
                    lastFetched: data.lastFetched
                };
            case 'codechef':
                return {
                    problemsSolved: data.problemsSolved ?? null,
                    rating: data.rating || 0,
                    contests: data.contestsParticipated ?? null,
                    stars: data.stars || 0,
                    rank: data.rank || 'Unrated',
                    lastFetched: data.lastFetched,
                    note: data.note
                };
            default:
                return data;
        }
    };

    const completedPlatforms = platforms.filter(
        (p) => coding.platforms[p.id]?.profileUrl
    ).length;

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="heading-serif text-display text-[#111111] dark:text-white">
                            Coding Profiles
                        </h1>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            Connect your coding platforms to analyze your technical skills
                        </p>
                    </div>
                    <Button onClick={() => navigate('/psychometric')}>
                        Next: Personality Test →
                    </Button>
                </div>

                {/* Progress Stats Card */}
                <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-[#909090]">Profiles Connected</p>
                            <p className="text-3xl font-semibold text-[#111111] dark:text-white mt-1">
                                {completedPlatforms} / {platforms.length}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[#909090]">Completion</p>
                            <p className="text-3xl font-semibold text-[#111111] dark:text-white mt-1">
                                {Math.round((completedPlatforms / platforms.length) * 100)}%
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5">
                        <div
                            className="bg-[#111111] dark:bg-white h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${(completedPlatforms / platforms.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Platform Tabs */}
                <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card overflow-hidden mb-6">
                    {/* Floating pill navigation bar */}
                    <div className="p-4 border-b border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] bg-[#FAF9F6]/50 dark:bg-[#161719]/50">
                        <div className="flex gap-2 overflow-x-auto">
                            {platforms.map((platform) => {
                                const isSelected = activeTab === platform.id;
                                const isConnected = !!coding.platforms[platform.id]?.profileUrl;

                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => setActiveTab(platform.id)}
                                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-[#111111] text-white shadow-soft dark:bg-white dark:text-[#111111]'
                                                : 'bg-white text-[#6B6B6B] border border-[#E8E5DF] hover:text-[#111111] hover:bg-[#F8F7F3] dark:bg-[#1F2023] dark:text-[#A1A1A1] dark:border-[rgba(255,255,255,0.08)] dark:hover:text-white'
                                        }`}
                                    >
                                        <span>{platform.icon}</span>
                                        <span>{platform.name}</span>
                                        {isConnected && (
                                            <span className="text-xs bg-[#D4F2E3] text-[#166534] px-1.5 py-0.5 rounded-full">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Platform Content */}
                    <div className="p-6 lg:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 ${activePlatform.color} rounded-2xl flex items-center justify-center`}>
                                {activePlatform.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[#111111] dark:text-white">
                                    {activePlatform.name}
                                </h2>
                                <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1A1]">
                                    {coding.platforms[activeTab]?.profileUrl
                                        ? 'Profile connected'
                                        : 'Connect your profile'}
                                </p>
                            </div>
                        </div>

                        {/* Profile Fields */}
                        <div className="space-y-4 mb-8 max-w-xl">
                            {activePlatform.fields.map((field) => (
                                <Input
                                    key={field.key}
                                    label={field.label}
                                    value={platformData[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            ))}
                            <Button 
                                onClick={handleFetchProfile} 
                                variant="outline" 
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? '⏳ Fetching data...' : '🔄 Fetch Profile Data'}
                            </Button>
                            {error && (
                                <div className="card-pastel-pink rounded-2xl p-4 text-sm text-[#991B1B]">
                                    ❌ {error}
                                </div>
                            )}
                        </div>

                        {/* Metrics Section */}
                        <div className="border-t border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">
                                    Metrics (Auto-fetched from API)
                                </h3>
                                {platformData.metrics?.lastFetched && (
                                    <span className="text-xs text-[#909090]">
                                        Last updated: {new Date(platformData.metrics.lastFetched).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {activePlatform.metrics.map((metric) => {
                                    const value = platformData.metrics?.[metric.key];
                                    const displayValue = value !== null && value !== undefined ? value : 'N/A';
                                    const isUnavailable = value === null || value === undefined;
                                    const manualKey = `${activeTab}_${metric.key}`;
                                    const isEditing = manualValues[manualKey] !== undefined;
                                    
                                    return (
                                        <div key={metric.key} className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
                                            <label className="block text-xs font-medium text-[#6B6B6B] dark:text-[#A1A1A1] mb-2">
                                                {metric.icon} {metric.label}
                                            </label>
                                            
                                            {!isUnavailable ? (
                                                <div className="text-2xl font-bold text-[#111111] dark:text-white">
                                                    {displayValue}
                                                </div>
                                            ) : isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="number"
                                                        value={manualValues[manualKey] || ''}
                                                        onChange={(e) => setManualValues({
                                                            ...manualValues,
                                                            [manualKey]: e.target.value
                                                        })}
                                                        placeholder="Enter value"
                                                        className="w-full px-3 py-2 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl text-[#111111] dark:text-white bg-white dark:bg-[#1F2023] text-sm focus:ring-2 focus:ring-[#111111]/10"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                handleMetricChange(metric.key, parseInt(manualValues[manualKey]) || 0);
                                                                setManualValues({
                                                                    ...manualValues,
                                                                    [manualKey]: undefined
                                                                });
                                                            }}
                                                            className="px-3 py-1.5 text-xs bg-[#111111] text-white dark:bg-white dark:text-[#111111] rounded-full font-semibold"
                                                        >
                                                            ✓ Save
                                                        </button>
                                                        <button
                                                            onClick={() => setManualValues({
                                                                ...manualValues,
                                                                [manualKey]: undefined
                                                            })}
                                                            className="px-3 py-1.5 text-xs bg-[#F8F7F3] text-[#404040] rounded-full font-semibold border border-[#E8E5DF]"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-2xl font-bold text-[#909090]">
                                                        N/A
                                                    </div>
                                                    <p className="text-xs text-[#909090] mt-1">
                                                        Data unavailable
                                                    </p>
                                                    <button
                                                        onClick={() => setManualValues({
                                                            ...manualValues,
                                                            [manualKey]: ''
                                                        })}
                                                        className="mt-3 px-3 py-1.5 text-xs bg-[#111111] text-white rounded-full font-semibold"
                                                    >
                                                        ➕ Add Manually
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {platformData.metrics?.note && (
                                <div className="mt-4 card-pastel-yellow rounded-2xl p-4">
                                    <p className="text-xs text-[#92400E]">
                                        ℹ️ {platformData.metrics.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="card-pastel-blue rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <h4 className="font-semibold text-[#1E40AF] mb-1">
                                Why connect coding profiles?
                            </h4>
                            <p className="text-sm text-[#1E40AF]/80">
                                Our AI analyzes your coding activity patterns, problem-solving frequency,
                                and technical depth to recommend the best career paths and skill gaps.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate('/academic')}>
                        ← Back to Academic
                    </Button>
                    <Button
                        onClick={() => navigate('/psychometric')}
                        disabled={completedPlatforms === 0}
                    >
                        Continue to Personality Test →
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CodingPage;