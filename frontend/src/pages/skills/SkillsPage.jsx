import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import apiClient from '../../api/client';

const SkillsPage = () => {
    const navigate = useNavigate();
    const [allSkills, setAllSkills] = useState([]);
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [showAddToProfile, setShowAddToProfile] = useState(false);
    
    const [newSkill, setNewSkill] = useState({
        skillName: '',
        category: 'Programming',
    });
    
    const [selectedSkill, setSelectedSkill] = useState('');
    const [proficiencyLevel, setProficiencyLevel] = useState('Beginner');

    const categories = ['Programming', 'Framework', 'Database', 'Tool', 'Soft Skill', 'Other'];
    const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    // Fetch skills on mount
    useEffect(() => {
        fetchAllSkills();
        fetchMySkills();
    }, []);

    const fetchAllSkills = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/skills');
            setAllSkills(response.data.skills || []);
        } catch (err) {
            console.error('Failed to fetch skills:', err);
            setError('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const fetchMySkills = async () => {
        try {
            const response = await apiClient.get('/skills/my-skills');
            setMySkills(response.data.skills || []);
        } catch (err) {
            console.error('Failed to fetch user skills:', err);
        }
    };

    const handleAddNewSkill = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await apiClient.post('/skills', newSkill);
            setNewSkill({ skillName: '', category: 'Programming' });
            setShowAddSkill(false);
            fetchAllSkills(); // Refresh list
            alert('Skill added successfully!');
        } catch (err) {
            console.error('Failed to add skill:', err);
            alert('Failed to add skill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToProfile = async (e) => {
        e.preventDefault();
        if (!selectedSkill) {
            alert('Please select a skill');
            return;
        }

        try {
            setLoading(true);
            await apiClient.post('/skills/my-skills', {
                skillId: parseInt(selectedSkill),
                proficiencyLevel,
            });
            setSelectedSkill('');
            setProficiencyLevel('Beginner');
            setShowAddToProfile(false);
            fetchMySkills(); // Refresh list
        } catch (err) {
            console.error('Failed to add skill to profile:', err);
            alert('Failed to add skill to profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProficiency = async (skillId, newLevel) => {
        try {
            await apiClient.put(`/skills/my-skills/${skillId}`, {
                proficiencyLevel: newLevel,
            });
            fetchMySkills(); // Refresh list
        } catch (err) {
            console.error('Failed to update proficiency:', err);
            alert('Failed to update proficiency');
        }
    };

    const handleRemoveSkill = async (skillId) => {
        if (!confirm('Remove this skill from your profile?')) return;

        try {
            await apiClient.delete(`/skills/my-skills/${skillId}`);
            fetchMySkills(); // Refresh list
        } catch (err) {
            console.error('Failed to remove skill:', err);
            alert('Failed to remove skill');
        }
    };

    const getProficiencyColor = (level) => {
        const colors = {
            Beginner: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            Intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            Expert: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        };
        return colors[level] || colors.Beginner;
    };

    const getCategoryColor = (category) => {
        const colors = {
            Programming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            Framework: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            Database: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            Tool: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            'Soft Skill': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
            Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        return colors[category] || colors.Other;
    };

    // Group skills by category
    const groupedSkills = mySkills.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent bg-clip-text text-transparent">
                            Skills Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage your technical and soft skills
                        </p>
                    </div>
                    <Button onClick={() => navigate('/projects')}>
                        Next: Projects →
                    </Button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Stats Card */}
                {mySkills.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Skills</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {mySkills.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Expert Level</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {mySkills.filter(s => s.proficiencyLevel === 'Expert').length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">
                                    {mySkills.filter(s => s.proficiencyLevel === 'Advanced').length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                                <p className="text-3xl font-bold text-brand-blue mt-1">
                                    {Object.keys(groupedSkills).length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <Button onClick={() => setShowAddToProfile(!showAddToProfile)} className="flex-1">
                        ➕ Add Skill to Profile
                    </Button>
                    <Button onClick={() => setShowAddSkill(!showAddSkill)} variant="outline" className="flex-1">
                        🆕 Create New Skill
                    </Button>
                </div>

                {/* Add to Profile Form */}
                {showAddToProfile && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Add Skill to Your Profile</h2>
                        <form onSubmit={handleAddToProfile}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Select Skill</label>
                                    <select
                                        value={selectedSkill}
                                        onChange={(e) => setSelectedSkill(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Choose a skill...</option>
                                        {allSkills.map((skill) => (
                                            <option key={skill.id} value={skill.id}>
                                                {skill.skillName} ({skill.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Proficiency Level</label>
                                    <select
                                        value={proficiencyLevel}
                                        onChange={(e) => setProficiencyLevel(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        {proficiencyLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add to Profile'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddToProfile(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Create New Skill Form */}
                {showAddSkill && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Skill</h2>
                        <form onSubmit={handleAddNewSkill}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    label="Skill Name"
                                    value={newSkill.skillName}
                                    onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                                    placeholder="e.g., React, Python, Communication"
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={newSkill.category}
                                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Skill'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddSkill(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* My Skills - Grouped by Category */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Skills ({mySkills.length})
                    </h2>

                    {mySkills.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                                No skills added yet
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm">
                                Click "Add Skill to Profile" to get started
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedSkills).map(([category, skills]) => (
                            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(category)}`}>
                                        {category}
                                    </span>
                                    <span className="text-gray-500 text-sm">({skills.length})</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {skill.skillName}
                                                </h4>
                                                <button
                                                    onClick={() => handleRemoveSkill(skill.skillId)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                                                    Proficiency
                                                </label>
                                                <select
                                                    value={skill.proficiencyLevel}
                                                    onChange={(e) =>
                                                        handleUpdateProficiency(skill.skillId, e.target.value)
                                                    }
                                                    className={`w-full px-2 py-1 text-sm rounded ${getProficiencyColor(
                                                        skill.proficiencyLevel
                                                    )} border-0 font-medium`}
                                                >
                                                    {proficiencyLevels.map((level) => (
                                                        <option key={level} value={level}>
                                                            {level}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillsPage;
