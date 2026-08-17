import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiClient from '../../api/client';
import Icon from '../../components/AppIcon';

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
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            ),
            color: 'bg-[#000000] text-white dark:bg-white dark:text-[#000000]',
            fields: [
                { key: 'username', label: 'Username', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://github.com/johndoe' },
            ],
            metrics: [
                { key: 'totalRepos', label: 'Total Repositories', iconName: 'Folder' },
                { key: 'totalCommits', label: 'Total Commits', iconName: 'GitCommit' },
                { key: 'totalStars', label: 'Total Stars', iconName: 'Star' },
            ],
        },
        {
            id: 'leetcode',
            name: 'LeetCode',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-2.365-1.914-5.788-1.557-7.791.564L4.046 9.826a5.238 5.238 0 0 0-1.354 2.289 5.076 5.076 0 0 0-.155 1.208c-.01.184-.006.37.01.556.019.191.054.381.103.57.049.189.11.376.184.558.073.182.158.36.253.533.095.173.202.342.318.506.116.164.243.32.38.47l4.287 4.201c2.645 2.589 6.901 2.585 9.542 0l2.396-2.392a2.685 2.685 0 0 0 0-3.804 2.671 2.671 0 0 0-3.802 0l-2.396 2.391a1.631 1.631 0 0 1-2.274-.041l-4.287-4.201c-.313-.307-.48-.697-.48-1.098s.167-.791.48-1.098L9.726 7.118c.83-.889 2.288-1.134 3.301-.462l3.501 2.831a2.69 2.69 0 0 0 3.804-.405 2.684 2.684 0 0 0-.405-3.806l-3.5-2.831C15.395.68 14.45.201 13.483 0z"/>
                </svg>
            ),
            color: 'bg-[#C9B59C] text-[#000000]',
            fields: [
                { key: 'username', label: 'Username', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://leetcode.com/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Total Questions Solved', iconName: 'CheckCircle2' },
                { key: 'contestRating', label: 'Contest Rating', iconName: 'Trophy' },
                { key: 'contestsAttended', label: 'Contests Attended', iconName: 'Target' },
            ],
        },
        {
            id: 'codeforces',
            name: 'Codeforces',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/>
                </svg>
            ),
            color: 'bg-[#EFE9E3] text-[#000000] border border-[#D9CFC7]',
            fields: [
                { key: 'handle', label: 'Handle', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://codeforces.com/profile/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Total Questions Solved', iconName: 'CheckCircle2' },
                { key: 'rating', label: 'Current Rating', iconName: 'TrendingUp' },
                { key: 'contests', label: 'Contests Participated', iconName: 'Target' },
            ],
        },
        {
            id: 'codechef',
            name: 'CodeChef',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z"/>
                    <line x1="6" y1="17" x2="18" y2="17"/>
                </svg>
            ),
            color: 'bg-[#C9B59C] text-[#000000]',
            fields: [
                { key: 'handle', label: 'Handle', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://codechef.com/users/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Total Questions Solved', iconName: 'CheckCircle2' },
                { key: 'rating', label: 'Current Rating', iconName: 'Star' },
                { key: 'contests', label: 'Contests Participated', iconName: 'Award' },
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

                alert(`${activePlatform.name} profile fetched successfully!\n\nData has been saved to your profile.`);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch profile';
            setError(errorMessage);
            alert(`Error: ${errorMessage}\n\nPlease check your ${activeTab === 'github' || activeTab === 'leetcode' ? 'username' : 'handle'} and try again.`);
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
        <div className="min-h-screen py-6 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="heading-serif text-display text-[#000000] dark:text-white">
                            Coding Profiles
                        </h1>
                        <p className="text-[#555555] dark:text-[#A1A1A1] mt-1">
                            Connect your coding platforms to analyze your technical skills
                        </p>
                    </div>
                    <Button onClick={() => navigate('/psychometric')}>
                        Next: Personality Test →
                    </Button>
                </div>

                {/* Progress Stats Card */}
                <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm font-medium text-[#555555] dark:text-[#A1A1A1]">Profiles Connected</p>
                            <p className="text-3xl font-semibold text-[#000000] dark:text-white mt-1">
                                {completedPlatforms} / {platforms.length}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-[#555555] dark:text-[#A1A1A1]">Completion</p>
                            <p className="text-3xl font-semibold text-[#000000] dark:text-white mt-1">
                                {Math.round((completedPlatforms / platforms.length) * 100)}%
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-[#D9CFC7]/50 dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-[#000000] dark:bg-[#C9B59C] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${(completedPlatforms / platforms.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Platform Tabs */}
                <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card overflow-hidden mb-6">
                    {/* Floating pill navigation bar */}
                    <div className="p-4 border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] bg-[#F9F8F6]/70 dark:bg-[#1C1B1A]/70">
                        <div className="flex gap-2.5 overflow-x-auto">
                            {platforms.map((platform) => {
                                const isSelected = activeTab === platform.id;
                                const isConnected = !!coding.platforms[platform.id]?.profileUrl;

                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => setActiveTab(platform.id)}
                                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-[#000000] text-white shadow-soft dark:bg-white dark:text-[#000000]'
                                                : 'bg-[#F9F8F6] text-[#000000]/80 border border-[#D9CFC7] hover:text-[#000000] hover:bg-[#EFE9E3] dark:bg-[#1C1B1A] dark:text-[#A1A1A1] dark:border-[rgba(217,207,199,0.15)] dark:hover:text-white'
                                        }`}
                                    >
                                        <span className="flex-shrink-0">{platform.icon}</span>
                                        <span>{platform.name}</span>
                                        {isConnected && (
                                            <span className="w-5 h-5 rounded-full bg-[#C9B59C] text-[#000000] flex items-center justify-center text-xs font-bold">
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
                            <div className={`w-14 h-14 ${activePlatform.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                                {activePlatform.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[#000000] dark:text-white">
                                    {activePlatform.name}
                                </h2>
                                <p className="text-sm text-[#555555] dark:text-[#A1A1A1]">
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
                            <button 
                                onClick={handleFetchProfile} 
                                disabled={loading}
                                className="w-full py-3 px-6 bg-[#C9B59C] hover:bg-[#B8A388] text-[#000000] rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                            >
                                <Icon name="RefreshCw" size={17} strokeWidth={2.2} className={loading ? "animate-spin" : ""} />
                                {loading ? 'Fetching Profile Data...' : 'Fetch Profile Data'}
                            </button>
                            {error && (
                                <div className="bg-[#EFE9E3] border border-[#D9CFC7] rounded-2xl p-4 text-sm text-[#000000] flex items-center gap-2">
                                    <Icon name="AlertCircle" size={18} className="text-[#000000]" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* Metrics Section */}
                        <div className="border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[#000000] dark:text-white">
                                    Metrics (Auto-fetched from API)
                                </h3>
                                {platformData.metrics?.lastFetched && (
                                    <span className="text-xs text-[#555555]">
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
                                        <div key={metric.key} className="bg-[#F9F8F6] dark:bg-[#1C1B1A] border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon name={metric.iconName} size={16} strokeWidth={2} className="text-[#C9B59C]" />
                                                <label className="block text-xs font-medium text-[#555555] dark:text-[#A1A1A1]">
                                                    {metric.label}
                                                </label>
                                            </div>
                                            
                                            {!isUnavailable ? (
                                                <div className="text-2xl font-bold text-[#000000] dark:text-white">
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
                                                        className="w-full px-3 py-2 border border-[#D9CFC7] rounded-xl text-[#000000] bg-white text-sm focus:ring-2 focus:ring-[#C9B59C]"
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
                                                            className="px-3 py-1.5 text-xs bg-[#000000] text-white rounded-full font-semibold"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setManualValues({
                                                                ...manualValues,
                                                                [manualKey]: undefined
                                                            })}
                                                            className="px-3 py-1.5 text-xs bg-[#EFE9E3] text-[#000000] rounded-full font-semibold border border-[#D9CFC7]"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-2xl font-bold text-[#555555]">
                                                        N/A
                                                    </div>
                                                    <p className="text-xs text-[#555555] mt-1">
                                                        Data unavailable
                                                    </p>
                                                    <button
                                                        onClick={() => setManualValues({
                                                            ...manualValues,
                                                            [manualKey]: ''
                                                        })}
                                                        className="mt-3 px-3 py-1.5 text-xs bg-[#000000] text-white rounded-full font-semibold flex items-center gap-1"
                                                    >
                                                        <Icon name="Plus" size={13} /> Add Manually
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {platformData.metrics?.note && (
                                <div className="mt-4 bg-[#EFE9E3] border border-[#D9CFC7] rounded-2xl p-4">
                                    <p className="text-xs text-[#000000] flex items-center gap-2">
                                        <Icon name="Info" size={15} className="text-[#C9B59C]" />
                                        <span>{platformData.metrics.note}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-[#EFE9E3] border border-[#D9CFC7] rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <Icon name="Lightbulb" size={22} className="text-[#C9B59C] flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-[#000000] mb-1">
                                Why connect coding profiles?
                            </h4>
                            <p className="text-sm text-[#555555]">
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