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

    const handleGenerateRecommendations = async () => {
        try {
            await generateRecommendations();
            alert('Recommendations generated successfully!');
        } catch (error) {
            alert('Failed to generate recommendations. Please try again.');
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

    // Use actual data from store or fallback to empty arrays
    const roles = recommendations.roles || [];
    const skills = recommendations.skills || [];
    const companies = recommendations.companies || [];

    // Fallback data for demonstration
    const mockRoles = [
        {
            id: 1,
            title: 'Full Stack Developer',
            description: 'Build end-to-end web applications using modern frameworks like React, Node.js, and databases.',
            score: 92,
            salary: '$80k - $120k',
            demand: 'High',
            skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        },
        {
            id: 2,
            title: 'Backend Engineer',
            description: 'Design and develop scalable server-side systems, APIs, and microservices.',
            score: 88,
            salary: '$85k - $130k',
            demand: 'High',
            skills: ['Python', 'Java', 'System Design', 'Databases'],
        },
        {
            id: 3,
            title: 'DevOps Engineer',
            description: 'Automate deployment pipelines and manage cloud infrastructure.',
            score: 85,
            salary: '$90k - $140k',
            demand: 'Very High',
            skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        },
        {
            id: 4,
            title: 'Data Engineer',
            description: 'Build data pipelines and warehouses for analytics and ML.',
            score: 78,
            salary: '$85k - $125k',
            demand: 'High',
            skills: ['Python', 'Spark', 'SQL', 'Airflow'],
        },
    ];

    const mockSkills = [
        {
            id: 1,
            name: 'React',
            category: 'Frontend',
            currentLevel: 70,
            targetLevel: 90,
            resources: ['Official Docs', 'Frontend Masters', 'React Patterns'],
        },
        {
            id: 2,
            name: 'Node.js',
            category: 'Backend',
            currentLevel: 80,
            targetLevel: 95,
            resources: ['NodeSchool', 'Express.js Guide'],
        },
        {
            id: 3,
            name: 'System Design',
            category: 'Architecture',
            currentLevel: 50,
            targetLevel: 80,
            resources: ['Designing Data-Intensive Applications', 'System Design Primer'],
        },
        {
            id: 4,
            name: 'PostgreSQL',
            category: 'Database',
            currentLevel: 60,
            targetLevel: 85,
            resources: ['PostgreSQL Tutorial', 'Database Internals'],
        },
    ];

    const mockCompanies = [
        {
            id: 1,
            name: 'Google',
            logo: '🔵',
            domain: 'Search, Cloud, AI',
            matchScore: 95,
            notes: 'Excellent match for your technical profile. Strong focus on algorithms and system design.',
            openRoles: 12,
        },
        {
            id: 2,
            name: 'Microsoft',
            logo: '🟦',
            domain: 'Cloud, Enterprise Software',
            matchScore: 92,
            notes: 'Great opportunities in backend engineering and cloud services.',
            openRoles: 8,
        },
        {
            id: 3,
            name: 'Amazon',
            logo: '🟠',
            domain: 'E-commerce, AWS, Logistics',
            matchScore: 88,
            notes: 'Strong demand for full-stack and DevOps roles.',
            openRoles: 15,
        },
        {
            id: 4,
            name: 'Meta',
            logo: '🔷',
            domain: 'Social Media, VR/AR',
            matchScore: 85,
            notes: 'Focus on scalable systems and user experience.',
            openRoles: 6,
        },
    ];

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
                        {(roles.length > 0 ? roles : mockRoles).map((role) => (
                            <div
                                key={role.id}
                                className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-[#111111] dark:text-white">
                                                {role.title}
                                            </h3>
                                            <span className="badge-success">
                                                {role.score}% Match
                                            </span>
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                                        <p className="text-xs text-[#909090]">Salary Range</p>
                                        <p className="text-lg font-semibold text-[#111111] dark:text-white mt-0.5">
                                            {role.salary}
                                        </p>
                                    </div>
                                    <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                                        <p className="text-xs text-[#909090]">Market Demand</p>
                                        <p className="text-lg font-semibold text-[#166534] dark:text-[#D4F2E3] mt-0.5">
                                            {role.demand}
                                        </p>
                                    </div>
                                    <div className="bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                                        <p className="text-xs text-[#909090]">Skills Required</p>
                                        <p className="text-lg font-semibold text-[#111111] dark:text-white mt-0.5">
                                            {role.skills.length}
                                        </p>
                                    </div>
                                </div>

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

                                <div className="flex gap-3">
                                    <Button onClick={() => navigate('/roadmap')} className="flex-1">
                                        Get Roadmap for This Role
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        {(skills.length > 0 ? skills : mockSkills).map((skill) => (
                            <div
                                key={skill.id}
                                className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#111111] dark:text-white mb-1">
                                            {skill.name}
                                        </h3>
                                        <span className="text-xs text-[#909090]">
                                            {skill.category}
                                        </span>
                                    </div>
                                    <span className="badge-ai">
                                        Gap: {skill.targetLevel - skill.currentLevel}%
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-[#6B6B6B]">Current Level</span>
                                        <span className="font-semibold text-[#111111] dark:text-white">
                                            {skill.currentLevel}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5">
                                        <div
                                            className="bg-[#111111] dark:bg-white h-2.5 rounded-full"
                                            style={{ width: `${skill.currentLevel}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-[#6B6B6B]">Target Level</span>
                                        <span className="font-semibold text-[#111111] dark:text-white">
                                            {skill.targetLevel}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#F8F7F3] dark:bg-[rgba(255,255,255,0.06)] rounded-full h-2.5">
                                        <div
                                            className="bg-[#10B981] h-2.5 rounded-full"
                                            style={{ width: `${skill.targetLevel}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs text-[#909090] mb-2 font-medium">
                                        Recommended Resources:
                                    </p>
                                    <ul className="space-y-1.5">
                                        {skill.resources.map((resource, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-[#404040] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                                            >
                                                • {resource}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button variant="outline" className="w-full">
                                    Add to Learning Path
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Companies Tab */}
                {activeTab === 'companies' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(companies.length > 0 ? companies : mockCompanies).map((company) => (
                            <div
                                key={company.id}
                                className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="text-4xl p-3 bg-[#FAF9F6] dark:bg-[#2a2b2e] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">{company.logo}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-[#111111] dark:text-white mb-1">
                                            {company.name}
                                        </h3>
                                        <p className="text-xs text-[#909090]">
                                            {company.domain}
                                        </p>
                                    </div>
                                    <span className="badge-success">
                                        {company.matchScore}% Match
                                    </span>
                                </div>

                                <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mb-4 text-sm leading-relaxed">
                                    {company.notes}
                                </p>

                                <div className="card-pastel-blue rounded-xl p-4 mb-6">
                                    <p className="text-xs text-[#1E40AF]">
                                        🎯 <strong>{company.openRoles}</strong> open roles matching your profile
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button className="flex-1">View Jobs</Button>
                                    <Button variant="outline" className="flex-1">
                                        Company Info
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationsPage;