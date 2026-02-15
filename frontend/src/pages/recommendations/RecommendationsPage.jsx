import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';

const RecommendationsPage = () => {
    const navigate = useNavigate();
    const { recommendations, saveRole, unsaveRole } = useStore();
    const [activeTab, setActiveTab] = useState('roles');

    const tabs = [
        { id: 'roles', label: 'Career Roles', icon: '💼' },
        { id: 'skills', label: 'Skills to Learn', icon: '🎯' },
        { id: 'companies', label: 'Target Companies', icon: '🏢' },
    ];

    const isRoleSaved = (roleId) => recommendations.savedRoles.includes(roleId);

    const toggleSaveRole = (roleId) => {
        if (isRoleSaved(roleId)) {
            unsaveRole(roleId);
        } else {
            saveRole(roleId);
        }
    };

    // Mock data (will be replaced with API data)
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
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent bg-clip-text text-transparent">
                            Career Recommendations
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Personalized suggestions based on your profile
                        </p>
                    </div>
                    <Button onClick={() => navigate('/roadmap')}>
                        Generate Roadmap →
                    </Button>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-brand-blue text-brand-blue'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <span className="text-xl">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                    <div className="space-y-6">
                        {mockRoles.map((role) => (
                            <div
                                key={role.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {role.title}
                                            </h3>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium rounded-full">
                                                {role.score}% Match
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {role.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleSaveRole(role.id)}
                                        className={`ml-4 text-2xl transition-transform hover:scale-110 ${isRoleSaved(role.id) ? 'text-red-500' : 'text-gray-300'
                                            }`}
                                    >
                                        {isRoleSaved(role.id) ? '❤️' : '🤍'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Salary Range</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {role.salary}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Market Demand</p>
                                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            {role.demand}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Skills Required</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {role.skills.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm rounded-full"
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
                        {mockSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {skill.name}
                                        </h3>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {skill.category}
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-medium rounded-full">
                                        Gap: {skill.targetLevel - skill.currentLevel}%
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {skill.currentLevel}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full"
                                            style={{ width: `${skill.currentLevel}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Target Level</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {skill.targetLevel}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-green-600 h-3 rounded-full"
                                            style={{ width: `${skill.targetLevel}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Recommended Resources:
                                    </p>
                                    <ul className="space-y-1">
                                        {skill.resources.map((resource, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                        {mockCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="text-5xl">{company.logo}</div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {company.domain}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium rounded-full">
                                        {company.matchScore}% Match
                                    </span>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {company.notes}
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-blue-900 dark:text-blue-200">
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