import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CodingPage = () => {
    const navigate = useNavigate();
    const { coding, updatePlatform } = useStore();
    const [activeTab, setActiveTab] = useState('github');

    const platforms = [
        {
            id: 'github',
            name: 'GitHub',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            ),
            color: 'bg-gray-800',
            fields: [
                { key: 'username', label: 'Username', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://github.com/johndoe' },
            ],
            metrics: [
                { key: 'commitsPerWeek', label: 'Commits/Week', icon: '📊' },
                { key: 'stars', label: 'Total Stars', icon: '⭐' },
                { key: 'prs', label: 'Pull Requests', icon: '🔀' },
            ],
        },
        {
            id: 'leetcode',
            name: 'LeetCode',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-2.365-1.914-5.788-1.557-7.791.564L4.046 9.826a5.238 5.238 0 0 0-1.354 2.289 5.076 5.076 0 0 0-.155 1.208c-.01.184-.006.37.01.556.019.191.054.381.103.57.049.189.11.376.184.558.073.182.158.36.253.533.095.173.202.342.318.506.116.164.243.32.38.47l4.287 4.201c2.645 2.589 6.901 2.585 9.542 0l2.396-2.392a2.685 2.685 0 0 0 0-3.804 2.671 2.671 0 0 0-3.802 0l-2.396 2.391a1.631 1.631 0 0 1-2.274-.041l-4.287-4.201c-.313-.307-.48-.697-.48-1.098s.167-.791.48-1.098L9.726 7.118c.83-.889 2.288-1.134 3.301-.462l3.501 2.831a2.69 2.69 0 0 0 3.804-.405 2.684 2.684 0 0 0-.405-3.806l-3.5-2.831C15.395.68 14.45.201 13.483 0z"/>
                </svg>
            ),
            color: 'bg-orange-500',
            fields: [
                { key: 'username', label: 'Username', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://leetcode.com/johndoe' },
            ],
            metrics: [
                { key: 'problemsSolved', label: 'Problems Solved', icon: '✅' },
                { key: 'contestRating', label: 'Contest Rating', icon: '🏆' },
            ],
        },
        {
            id: 'codeforces',
            name: 'Codeforces',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/>
                </svg>
            ),
            color: 'bg-blue-600',
            fields: [
                { key: 'handle', label: 'Handle', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://codeforces.com/profile/johndoe' },
            ],
            metrics: [
                { key: 'rating', label: 'Rating', icon: '📈' },
                { key: 'contests', label: 'Contests', icon: '🎯' },
            ],
        },
        {
            id: 'codechef',
            name: 'CodeChef',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M11.257.004c-.37.01-.735.05-1.095.119a12.06 12.06 0 0 0-2.064.51 12.13 12.13 0 0 0-1.967.947c-3.17 1.89-5.453 5.162-5.97 8.876-.102.736-.103 1.494-.002 2.23.517 3.714 2.8 6.986 5.97 8.876.575.343 1.19.638 1.833.882.646.244 1.32.435 2.01.57a11.77 11.77 0 0 0 2.177.186 11.774 11.774 0 0 0 2.177-.186 11.91 11.91 0 0 0 2.01-.57 12.16 12.16 0 0 0 1.833-.882c3.17-1.89 5.453-5.162 5.97-8.876.101-.736.103-1.494.002-2.23-.517-3.714-2.8-6.986-5.97-8.876a12.096 12.096 0 0 0-1.833-.882 11.91 11.91 0 0 0-2.01-.57 11.77 11.77 0 0 0-2.177-.186c-.37-.01-.735-.05-1.095-.119z"/>
                </svg>
            ),
            color: 'bg-amber-700',
            fields: [
                { key: 'handle', label: 'Handle', placeholder: 'johndoe' },
                { key: 'profileUrl', label: 'Profile URL', placeholder: 'https://codechef.com/users/johndoe' },
            ],
            metrics: [
                { key: 'rating', label: 'Rating', icon: '⭐' },
                { key: 'contests', label: 'Contests', icon: '🏅' },
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
        // Placeholder for API call to fetch profile data
        alert(`Fetching ${activePlatform.name} profile... (API integration pending)`);
    };

    const completedPlatforms = platforms.filter(
        (p) => coding.platforms[p.id]?.profileUrl
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Coding Profiles
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Connect your coding platforms to analyze your technical skills
                        </p>
                    </div>
                    <Button onClick={() => navigate('/psychometric')}>
                        Next: Personality Test →
                    </Button>
                </div>

                {/* Progress Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Profiles Connected</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {completedPlatforms} / {platforms.length}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                                {Math.round((completedPlatforms / platforms.length) * 100)}%
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(completedPlatforms / platforms.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Platform Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px overflow-x-auto">
                            {platforms.map((platform) => (
                                <button
                                    key={platform.id}
                                    onClick={() => setActiveTab(platform.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === platform.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <span className={activeTab === platform.id ? '' : 'opacity-60'}>{platform.icon}</span>
                                    {platform.name}
                                    {coding.platforms[platform.id]?.profileUrl && (
                                        <span className="ml-1 text-green-500">✓</span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Platform Content */}
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-16 h-16 ${activePlatform.color} rounded-lg flex items-center justify-center text-3xl`}>
                                {activePlatform.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {activePlatform.name}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {coding.platforms[activeTab]?.profileUrl
                                        ? 'Profile connected'
                                        : 'Connect your profile'}
                                </p>
                            </div>
                        </div>

                        {/* Profile Fields */}
                        <div className="space-y-4 mb-6">
                            {activePlatform.fields.map((field) => (
                                <Input
                                    key={field.key}
                                    label={field.label}
                                    value={platformData[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            ))}
                            <Button onClick={handleFetchProfile} variant="outline" className="w-full">
                                🔄 Fetch Profile Data
                            </Button>
                        </div>

                        {/* Metrics Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Metrics (Optional - Auto-fetched or Manual)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activePlatform.metrics.map((metric) => (
                                    <div key={metric.key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {metric.icon} {metric.label}
                                        </label>
                                        <Input
                                            type="number"
                                            value={platformData.metrics?.[metric.key] || ''}
                                            onChange={(e) => handleMetricChange(metric.key, e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                                Why connect coding profiles?
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Our AI analyzes your coding activity patterns, problem-solving frequency,
                                and technical depth to recommend the best career paths and skill gaps.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
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