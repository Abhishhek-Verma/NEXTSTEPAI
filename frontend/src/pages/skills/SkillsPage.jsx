import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiClient from '../../api/client';
import Icon from '../../components/AppIcon';

const SkillsPage = () => {
    const navigate = useNavigate();
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddToProfile, setShowAddToProfile] = useState(false);
    
    // Manual skill input fields
    const [skillName, setSkillName] = useState('');
    const [category, setCategory] = useState('Programming');
    const [proficiencyLevel, setProficiencyLevel] = useState('Beginner');

    const categories = ['Programming', 'Framework', 'Database', 'Tool', 'Soft Skill', 'Other'];
    const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    // Fetch skills on mount
    useEffect(() => {
        fetchMySkills();
    }, []);

    const fetchMySkills = async () => {
        try {
            const response = await apiClient.get('/skills/my-skills');
            setMySkills(response.data.skills || []);
        } catch (err) {
            console.error('Failed to fetch user skills:', err);
        }
    };

    const handleAddSkillToProfile = async (e) => {
        e.preventDefault();
        if (!skillName.trim()) {
            alert('Please enter a skill name');
            return;
        }

        try {
            setLoading(true);
            
            // Step 1: Create the skill in the skills table (or get existing)
            let skillId;
            try {
                const createResponse = await apiClient.post('/skills', {
                    skillName: skillName.trim(),
                    category,
                });
                // The backend should return the created skill with its id
                skillId = createResponse.data?.skill?.id || createResponse.data?.id;
            } catch (createErr) {
                // If skill already exists, try to find it
                if (createErr.response?.status === 409 || createErr.response?.data?.error?.includes('already exists')) {
                    const allSkillsResponse = await apiClient.get('/skills');
                    const existingSkill = (allSkillsResponse.data.skills || []).find(
                        s => s.skillName.toLowerCase() === skillName.trim().toLowerCase()
                    );
                    if (existingSkill) {
                        skillId = existingSkill.id;
                    } else {
                        throw new Error('Failed to find or create skill');
                    }
                } else {
                    throw createErr;
                }
            }

            if (!skillId) {
                // Fallback: try to fetch the skill we just created
                const allSkillsResponse = await apiClient.get('/skills');
                const found = (allSkillsResponse.data.skills || []).find(
                    s => s.skillName.toLowerCase() === skillName.trim().toLowerCase()
                );
                if (found) {
                    skillId = found.id;
                } else {
                    throw new Error('Could not find the skill after creation');
                }
            }

            // Step 2: Add the skill to the user's profile
            await apiClient.post('/skills/my-skills', {
                skillId: parseInt(skillId),
                proficiencyLevel,
            });

            // Reset form and refresh
            setSkillName('');
            setCategory('Programming');
            setProficiencyLevel('Beginner');
            setShowAddToProfile(false);
            fetchMySkills();
        } catch (err) {
            console.error('Failed to add skill to profile:', err);
            alert(err.response?.data?.error || 'Failed to add skill. Please try again.');
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

    const getProficiencyBadge = (level) => {
        const badges = {
            Beginner: 'bg-[#F8F7F3] text-[#6B6B6B]',
            Intermediate: 'badge-info',
            Advanced: 'badge-ai',
            Expert: 'badge-success',
        };
        return badges[level] || badges.Beginner;
    };

    const getCategoryColor = (category) => {
        const colors = {
            Programming: 'card-pastel-blue',
            Framework: 'card-pastel-purple',
            Database: 'card-pastel-mint',
            Tool: 'card-pastel-yellow',
            'Soft Skill': 'card-pastel-pink',
            Other: 'bg-[#F8F7F3] border border-[#E8E5DF]',
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
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="heading-serif text-display text-[#111111] dark:text-white">
                            Skills Management
                        </h1>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            Manage your technical and soft skills
                        </p>
                    </div>
                    <Button onClick={() => navigate('/projects')}>
                        Next: Projects →
                    </Button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="card-pastel-pink rounded-2xl p-4 mb-6">
                        <p className="text-[#6B6B6B]">{error}</p>
                    </div>
                )}

                {/* Stats Card */}
                {mySkills.length > 0 && (
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm text-[#909090]">Total Skills</p>
                                <p className="text-3xl font-semibold text-[#111111] dark:text-white mt-1">
                                    {mySkills.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[#909090]">Expert Level</p>
                                <p className="text-3xl font-semibold text-[#111111] dark:text-white mt-1">
                                    {mySkills.filter(s => s.proficiencyLevel === 'Expert').length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[#909090]">Advanced</p>
                                <p className="text-3xl font-semibold text-[#111111] dark:text-white mt-1">
                                    {mySkills.filter(s => s.proficiencyLevel === 'Advanced').length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[#909090]">Categories</p>
                                <p className="text-3xl font-semibold text-[#111111] dark:text-white mt-1">
                                    {Object.keys(groupedSkills).length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex gap-4 mb-6">
                    <Button onClick={() => setShowAddToProfile(!showAddToProfile)} className="flex-1 flex items-center justify-center gap-2">
                        <Icon name="Plus" size={17} strokeWidth={2} /> Add Skill to Profile
                    </Button>
                </div>

                {/* Add Skill Form — Manual text input instead of dropdown */}
                {showAddToProfile && (
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 mb-6">
                        <h2 className="text-xl font-semibold text-[#111111] dark:text-white mb-4">Add Skill to Your Profile</h2>
                        <form onSubmit={handleAddSkillToProfile}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Skill Name</label>
                                    <input
                                        type="text"
                                        value={skillName}
                                        onChange={(e) => setSkillName(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all"
                                        placeholder="e.g., React, Python, Docker..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Proficiency Level</label>
                                    <select
                                        value={proficiencyLevel}
                                        onChange={(e) => setProficiencyLevel(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all"
                                    >
                                        {proficiencyLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3">
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

                {/* My Skills - Grouped by Category */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#111111] dark:text-white">
                        Your Skills ({mySkills.length})
                    </h2>

                    {mySkills.length === 0 ? (
                        <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-8 text-center">
                            <p className="text-[#6B6B6B] text-lg mb-4">
                                No skills added yet
                            </p>
                            <p className="text-[#909090] text-sm">
                                Click "Add Skill to Profile" to get started
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedSkills).map(([category, skills]) => (
                            <div key={category} className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        category === 'Programming' ? 'badge-info' :
                                        category === 'Framework' ? 'badge-ai' :
                                        category === 'Database' ? 'badge-success' :
                                        category === 'Tool' ? 'badge-pending' :
                                        category === 'Soft Skill' ? 'badge-warning' :
                                        'bg-[#F8F7F3] text-[#6B6B6B]'
                                    }`}>
                                        {category}
                                    </span>
                                    <span className="text-[#909090] text-sm">({skills.length})</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-4 hover:shadow-soft transition-all duration-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-[#111111] dark:text-white">
                                                    {skill.skillName}
                                                </h4>
                                                <button
                                                    onClick={() => handleRemoveSkill(skill.skillId)}
                                                    className="text-[#EF4444]/60 hover:text-[#EF4444] text-sm transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div>
                                                <label className="text-xs text-[#909090] block mb-1">
                                                    Proficiency
                                                </label>
                                                <select
                                                    value={skill.proficiencyLevel}
                                                    onChange={(e) =>
                                                        handleUpdateProficiency(skill.skillId, e.target.value)
                                                    }
                                                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white font-medium focus:ring-2 focus:ring-[#111111]/10 transition-all"
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
