import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import apiClient from '../../api/client';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const { projects, setProjects, setProjectsLoading, setProjectsError } = useStore();
    
    // Ensure projectsList is always an array
    const projectsList = Array.isArray(projects?.list) ? projects.list : [];
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        repoUrl: '',
        liveUrl: '',
        techStack: '',
        status: 'in-progress',
    });

    // Fetch projects from database on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjectsLoading(true);
                const response = await apiClient.get('/projects');
                setProjects(response.data || []);
                setProjectsLoading(false);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                setProjectsError(error.message || 'Failed to load projects');
                setProjectsLoading(false);
            }
        };

        fetchProjects();
    }, [setProjects, setProjectsError, setProjectsLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            title: formData.title,
            description: formData.description,
            githubUrl: formData.repoUrl || null,
            liveUrl: formData.liveUrl || null,
            technologies: formData.techStack.split(',').map((tech) => tech.trim()).filter(Boolean),
            status: formData.status,
            completedAt: formData.status === 'completed' ? new Date().toISOString() : null,
        };

        try {
            setProjectsLoading(true);
            
            if (editingProject) {
                // Update existing project
                await apiClient.put(`/projects/${editingProject.id}`, projectData);
            } else {
                // Create new project
                await apiClient.post('/projects', projectData);
            }

            // Refresh projects list
            const response = await apiClient.get('/projects');
            setProjects(response.data || []);
            setProjectsLoading(false);

            setFormData({
                title: '',
                description: '',
                repoUrl: '',
                liveUrl: '',
                techStack: '',
                status: 'in-progress',
            });
            setShowAddForm(false);
            setEditingProject(null);
        } catch (error) {
            console.error('Failed to save project:', error);
            setProjectsError(error.message || 'Failed to save project');
            setProjectsLoading(false);
            alert('Failed to save project. Please try again.');
        }
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description,
            repoUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            techStack: project.technologies ? project.technologies.join(', ') : '',
            status: project.status || (project.completedAt ? 'completed' : 'in-progress'),
        });
        setEditingProject(project);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            setProjectsLoading(true);
            await apiClient.delete(`/projects/${id}`);
            
            // Refresh projects list
            const response = await apiClient.get('/projects');
            setProjects(response.data || []);
            setProjectsLoading(false);
        } catch (error) {
            console.error('Failed to delete project:', error);
            setProjectsError(error.message || 'Failed to delete project');
            setProjectsLoading(false);
            alert('Failed to delete project. Please try again.');
        }
    };

    const completedProjects = projectsList.filter((p) => p.status === 'completed' || p.completedAt).length;
    const inProgressProjects = projectsList.length - completedProjects;

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                            <h1 className="heading-serif text-display text-[#111111] dark:text-white">
                                My Projects
                            </h1>
                            <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                                Showcase your portfolio and track your builds
                            </p>
                        </div>
                        <Button onClick={() => navigate('/profile')} variant="outline">
                            ← Back to Profile
                        </Button>
                    </div>

                    {!showAddForm && (
                        <Button onClick={() => setShowAddForm(true)} size="lg">
                            ➕ Add New Project
                        </Button>
                    )}
                </div>

                {/* Stats */}
                {projectsList.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card-pastel-blue rounded-2xl p-6 border border-[rgba(216,232,252,0.6)] shadow-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#1E40AF]">Total Projects</p>
                                    <p className="text-3xl font-bold text-[#1E40AF] mt-1">
                                        {projectsList.length}
                                    </p>
                                </div>
                                <div className="text-4xl">📁</div>
                            </div>
                        </div>
                        <div className="card-pastel-mint rounded-2xl p-6 border border-[rgba(205,238,220,0.6)] shadow-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#166534]">Completed</p>
                                    <p className="text-3xl font-bold text-[#166534] mt-1">
                                        {completedProjects}
                                    </p>
                                </div>
                                <div className="text-4xl">✅</div>
                            </div>
                        </div>
                        <div className="card-pastel-yellow rounded-2xl p-6 border border-[rgba(254,243,199,0.6)] shadow-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#92400E]">In Progress</p>
                                    <p className="text-3xl font-bold text-[#92400E] mt-1">
                                        {inProgressProjects}
                                    </p>
                                </div>
                                <div className="text-4xl">🔄</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Project Form */}
                {showAddForm && (
                    <Card className="mb-8 rounded-2xl">
                        <CardHeader>
                            <CardTitle>{editingProject ? '✏️ Edit Project' : '➕ Add New Project'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                        label="Project Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., E-commerce Platform"
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 text-sm"
                                        >
                                            <option value="in-progress">🔄 In Progress</option>
                                            <option value="completed">✅ Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 text-sm"
                                        rows={3}
                                        placeholder="Brief description of the project..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                        label="GitHub Repository URL"
                                        value={formData.repoUrl}
                                        onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                                        placeholder="https://github.com/username/repo"
                                    />
                                    <Input
                                        label="Live Demo URL (Optional)"
                                        value={formData.liveUrl}
                                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                        placeholder="https://myproject.com"
                                    />
                                </div>

                                <div className="mb-6">
                                    <Input
                                        label="Tech Stack (comma separated)"
                                        value={formData.techStack}
                                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                        placeholder="React, Node.js, PostgreSQL, AWS"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit">{editingProject ? 'Update' : 'Add'} Project</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingProject(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                repoUrl: '',
                                                liveUrl: '',
                                                techStack: '',
                                                status: 'in-progress',
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Projects Grid */}
                {projectsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsList.map((project) => (
                            <Card key={project.id} hover className="overflow-hidden rounded-2xl flex flex-col justify-between">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-3 gap-2">
                                        <h3 className="text-lg font-semibold text-[#111111] dark:text-white leading-snug">
                                            {project.title}
                                        </h3>
                                        <span
                                            className={project.status === 'completed' || project.completedAt ? 'badge-success' : 'badge-warning'}
                                        >
                                            {project.status === 'completed' || project.completedAt ? '✅ Done' : '🔄 WIP'}
                                        </span>
                                    </div>

                                    <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-xs mb-4 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.technologies.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge-info"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mb-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-[#111111] dark:text-white font-medium hover:underline"
                                            >
                                                <span>🔗</span> GitHub
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-[#10B981] font-medium hover:underline"
                                            >
                                                <span>🌐</span> Live Demo
                                            </a>
                                        )}
                                    </div>

                                    {project.completedAt && (
                                        <p className="text-xs text-[#909090] mb-4">
                                            Completed: {new Date(project.completedAt).toLocaleDateString()}
                                        </p>
                                    )}

                                    <div className="flex gap-2 pt-2 border-t border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="flex-1 py-2 bg-[#F8F7F3] dark:bg-[#2a2b2e] text-[#111111] dark:text-white border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-full hover:bg-white transition-colors text-xs font-semibold"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="flex-1 py-2 bg-[#FCE5E6] dark:bg-[#991B1B]/20 text-[#991B1B] dark:text-[#FCA5A5] border border-[rgba(252,229,230,0.8)] rounded-full hover:bg-[#F8D7DA] transition-colors text-xs font-semibold"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center rounded-2xl">
                        <CardContent className="py-12">
                            <div className="text-5xl mb-4">📂</div>
                            <h3 className="heading-serif text-display text-[#111111] dark:text-white mb-2">
                                No Projects Yet
                            </h3>
                            <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-sm mb-6">
                                Start building and showcasing your portfolio projects
                            </p>
                            <Button onClick={() => setShowAddForm(true)} size="lg">
                                ➕ Add Your First Project
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;