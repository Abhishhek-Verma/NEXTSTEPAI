import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const RecommendationsPage = () => {
    const navigate = useNavigate();
    const { recommendations, fetchRecommendations, generateRecommendations, saveRole, unsaveRole } = useStore();
    const [activeTab, setActiveTab] = useState('roles');

    // Fetch recommendations on mount
    useEffect(() => {
        fetchRecommendations();
    }, []);

    const tabs = [
        { id: 'roles', label: 'Career Roles', iconName: 'Briefcase' },
        { id: 'skills', label: 'Skills to Learn', iconName: 'Target' },
        { id: 'companies', label: 'Target Companies', iconName: 'Building2' },
    ];

    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateRecommendations = async () => {
        try {
            setIsGenerating(true);
            await generateRecommendations();
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
            alert('Failed to generate recommendations. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const isRoleSaved = (roleId) => recommendations.savedRoles?.includes(roleId);

    const toggleSaveRole = (roleId) => {
        if (isRoleSaved(roleId)) {
            unsaveRole(roleId);
        } else {
            saveRole(roleId);
        }
    };

    // Use actual dynamic data from store
    const roles = recommendations.roles || [];
    const skills = recommendations.skills || [];
    const companies = recommendations.companies || [];

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="heading-serif text-display text-[#111111] dark:text-white">
                            Career Recommendations
                        </h1>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            Personalized suggestions based on your profile
                            {recommendations.generatedAt && (
                                <span className="ml-2 text-xs text-[#909090]">
                                    • Generated {new Date(recommendations.generatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={handleGenerateRecommendations} 
                            variant="outline"
                            disabled={recommendations.loading}
                            className="flex items-center gap-2"
                        >
                            <Icon name="Sparkles" size={17} strokeWidth={2} />
                            {recommendations.loading ? 'Generating...' : 'Generate AI Recommendations'}
                        </Button>
                        <Button onClick={() => navigate('/roadmap')}>
                            Generate Roadmap →
                        </Button>
                    </div>
                </div>

                {/* Error Display */}
                {recommendations.error && (
                    <div className="card-pastel-pink rounded-2xl p-4 mb-6">
                        <p className="text-[#991B1B] text-sm">{recommendations.error}</p>
                    </div>
                )}

                {/* Loading State */}
                {recommendations.loading && (
                    <div className="card-pastel-blue rounded-2xl p-4 mb-6 text-center">
                        <p className="text-[#1E40AF] text-sm font-medium">Loading recommendations...</p>
                    </div>
                )}

                {/* Floating Navigation Tabs */}
                <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-2 mb-8">
                    <div className="flex gap-2">
                        {tabs.map((tab) => {
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
                                        isSelected
                                            ? 'bg-[#111111] text-white shadow-soft dark:bg-white dark:text-[#111111]'
                                            : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F7F3] dark:text-[#A1A1A1] dark:hover:text-white dark:hover:bg-[#2a2b2e]'
                                    }`}
                                >
                                    <Icon name={tab.iconName} size={18} strokeWidth={2} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                    <div className="space-y-6">
                        {recommendations.loading || isGenerating ? (
                            <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-12 text-center animate-pulse">
                                <Icon name="Sparkles" size={36} className="text-[#C9B59C] mx-auto mb-3 animate-spin" />
                                <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-1">
                                    Calculating Your Multimodal Career Matches...
                                </h3>
                                <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1A1]">
                                    Synthesizing your academic records, coding telemetry, and projects.
                                </p>
                            </div>
                        ) : roles.length > 0 ? (
                            roles.map((role) => (
                                <div
                                    key={role.id || role.title}
                                    className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-xl font-semibold text-[#111111] dark:text-white">
                                                    {role.title}
                                                </h3>
                                                <span className="badge-success">
                                                    {role.score}% Match
                                                </span>
                                                {role.confidence && (
                                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFE9E3] dark:bg-white/10 text-[#555555] dark:text-[#A1A1A1]">
                                                        {Math.round(parseFloat(role.confidence) * 100)}% Confidence
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mb-4 text-sm leading-relaxed">
                                                {role.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleSaveRole(role.id)}
                                            className={`ml-4 text-2xl transition-transform hover:scale-110 p-2 rounded-full hover:bg-[#F8F7F3] dark:hover:bg-[#2a2b2e] ${
                                                isRoleSaved(role.id) ? 'text-[#EF4444]' : 'text-[#909090]'
                                            }`}
                                        >
                                            {isRoleSaved(role.id) ? '❤️' : '🤍'}
                                        </button>
                                    </div>

                                    {role.reasoning && (
                                        <div className="bg-[#FAF9F6] dark:bg-[#262422] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-3.5 mb-5 text-xs text-[#555555] dark:text-[#BBB] leading-relaxed">
                                            💡 <strong>Match Rationale:</strong> {role.reasoning}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                                            <p className="text-xs text-[#909090]">Salary Range</p>
                                            <p className="text-lg font-semibold text-[#111111] dark:text-white mt-0.5">
                                                {role.salary || '₹8L - ₹18L'}
                                            </p>
                                        </div>
                                        <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                                            <p className="text-xs text-[#909090]">Market Demand</p>
                                            <p className="text-lg font-semibold text-[#166534] dark:text-[#D4F2E3] mt-0.5">
                                                {role.demand || 'High'}
                                            </p>
                                        </div>
                                        <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                                            <p className="text-xs text-[#909090]">Skills Required</p>
                                            <p className="text-lg font-semibold text-[#111111] dark:text-white mt-0.5">
                                                {Array.isArray(role.skills) ? role.skills.length : 4}
                                            </p>
                                        </div>
                                    </div>

                                    {Array.isArray(role.skills) && role.skills.length > 0 && (
                                        <div className="mb-6">
                                            <p className="text-xs text-[#909090] mb-2 font-medium">Key Skills:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {role.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge-info"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Button 
                                            onClick={() => navigate('/roadmap', { state: { targetRole: role.title } })} 
                                            className="flex-1"
                                        >
                                            Get Roadmap for This Role →
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-12 text-center">
                                <Icon name="Briefcase" size={40} className="text-[#C9B59C] mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">
                                    No Career Recommendations Yet
                                </h3>
                                <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1A1] max-w-md mx-auto mb-6">
                                    Generate personalized career matches calculated from your GPA, coding platform handle metrics, and projects.
                                </p>
                                <Button onClick={handleGenerateRecommendations} loading={isGenerating}>
                                    Generate AI Recommendations
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <div
                                    key={skill.id || skill.name}
                                    className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#111111] dark:text-white mb-1">
                                                {skill.name}
                                            </h3>
                                            <span className="text-xs text-[#909090]">
                                                {skill.category || 'Technical'}
                                            </span>
                                        </div>
                                        <span className="badge-ai">
                                            Gap: {(skill.targetLevel || 85) - (skill.currentLevel || 40)}%
                                        </span>
                                    </div>

                                    {skill.description && (
                                        <p className="text-sm text-[#555555] dark:text-[#BBB] mb-4">
                                            {skill.description}
                                        </p>
                                    )}

                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-[#6B6B6B]">Current Proficiency</span>
                                            <span className="font-semibold text-[#111111] dark:text-white">
                                                {skill.currentLevel || 40}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5">
                                            <div
                                                className="bg-[#111111] dark:bg-white h-2.5 rounded-full"
                                                style={{ width: `${skill.currentLevel || 40}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-[#6B6B6B]">Target Industry Standard</span>
                                            <span className="font-semibold text-[#111111] dark:text-white">
                                                {skill.targetLevel || 85}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5">
                                            <div
                                                className="bg-[#10B981] h-2.5 rounded-full"
                                                style={{ width: `${skill.targetLevel || 85}%` }}
                                            />
                                        </div>
                                    </div>

                                    {Array.isArray(skill.resources) && skill.resources.length > 0 && (
                                        <div className="mb-6">
                                            <p className="text-xs text-[#909090] mb-2 font-medium">
                                                Recommended Resources:
                                            </p>
                                            <ul className="space-y-1.5">
                                                {skill.resources.map((resource, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm text-[#404040] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-white transition-colors"
                                                    >
                                                        • {typeof resource === 'string' ? resource : resource.title || resource.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button 
                                        variant="outline" 
                                        onClick={() => navigate('/roadmap', { state: { targetRole: `${skill.name} Specialist` } })}
                                        className="w-full"
                                    >
                                        Add to Learning Roadmap →
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-12 text-center">
                                <Icon name="Target" size={40} className="text-[#C9B59C] mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">
                                    No Skill Recommendations Yet
                                </h3>
                                <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1A1] max-w-md mx-auto mb-6">
                                    Click below to analyze your skill gaps against market requirements.
                                </p>
                                <Button onClick={handleGenerateRecommendations} loading={isGenerating}>
                                    Generate AI Recommendations
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Companies Tab */}
                {activeTab === 'companies' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {companies.length > 0 ? (
                            companies.map((company) => (
                                <div
                                    key={company.id || company.name}
                                    className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="text-2xl p-3 bg-[#FAF9F6] dark:bg-[#2a2b2e] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-center min-w-[52px]">
                                            <Icon name="Building2" size={24} className="text-[#111111] dark:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-[#111111] dark:text-white mb-1">
                                                {company.name}
                                            </h3>
                                            <p className="text-xs text-[#909090]">
                                                {company.domain}
                                            </p>
                                        </div>
                                        <span className="badge-success">
                                            {company.matchScore || 90}% Match
                                        </span>
                                    </div>

                                    <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mb-4 text-sm leading-relaxed">
                                        {company.notes}
                                    </p>

                                    {company.openRoles && (
                                        <div className="card-pastel-blue rounded-xl p-4 mb-6">
                                            <p className="text-xs text-[#1E40AF]">
                                                🎯 <strong>{company.openRoles}</strong> relevant open engineering positions
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Button 
                                            onClick={() => navigate('/roadmap', { state: { targetRole: `Engineer at ${company.name}` } })}
                                            className="flex-1"
                                        >
                                            Prepare for {company.name} →
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-12 text-center">
                                <Icon name="Building2" size={40} className="text-[#C9B59C] mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">
                                    No Target Companies Yet
                                </h3>
                                <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1A1] max-w-md mx-auto mb-6">
                                    Discover companies actively hiring developers with your exact profile distribution.
                                </p>
                                <Button onClick={handleGenerateRecommendations} loading={isGenerating}>
                                    Generate AI Recommendations
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationsPage;