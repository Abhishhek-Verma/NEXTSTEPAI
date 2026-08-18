import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import apiClient from '../../api/client';
import Icon from '../../components/AppIcon';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const { projects, setProjects, setProjectsLoading, setProjectsError } = useStore();
    const projectsList = Array.isArray(projects?.list) ? projects.list : [];
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        repoUrl: '',
        liveUrl: '',
        techStack: '',
        status: 'in-progress',
    });

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
    }, []);

    const resetForm = () => {
        setFormData({ title: '', description: '', repoUrl: '', liveUrl: '', techStack: '', status: 'in-progress' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setProjectsLoading(true);
            const technologies = formData.techStack
                ? formData.techStack.split(',').map((t) => t.trim()).filter(Boolean)
                : [];
            const projectData = {
                title: formData.title,
                description: formData.description,
                githubUrl: formData.repoUrl,
                liveUrl: formData.liveUrl,
                technologies,
                status: formData.status,
                completedAt: formData.status === 'completed' ? new Date().toISOString() : null,
            };

            if (editingProject) {
                const response = await apiClient.put(`/projects/${editingProject.id}`, projectData);
                const updatedProject = response.data;
                const updatedList = projectsList.map((p) =>
                    p.id === editingProject.id ? updatedProject : p
                );
                setProjects(updatedList);
            } else {
                const response = await apiClient.post('/projects', projectData);
                const newProject = response.data;
                setProjects([...projectsList, newProject]);
            }
            setShowAddForm(false);
            setEditingProject(null);
            resetForm();
            setProjectsLoading(false);
        } catch (error) {
            console.error('Failed to save project:', error);
            setProjectsError(error.message || 'Failed to save project');
            setProjectsLoading(false);
            alert('Failed to save project. Please try again.');
        }
    };

    const handleEdit = (project) => {
        setSelectedProject(null);
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || '',
            repoUrl: project.githubUrl || project.repoUrl || '',
            liveUrl: project.liveUrl || '',
            techStack: project.technologies ? project.technologies.join(', ') : '',
            status: project.status || 'in-progress',
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            setProjectsLoading(true);
            await apiClient.delete(`/projects/${id}`);
            const updatedList = projectsList.filter((p) => p.id !== id);
            setProjects(updatedList);
            if (selectedProject?.id === id) setSelectedProject(null);
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

    // --- PROJECT DETAIL VIEW ---
    if (selectedProject) {
        return (
            <div className="min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={() => setSelectedProject(null)}
                        className="flex items-center gap-2 text-sm font-semibold text-[#555555] hover:text-[#000000] mb-6 transition-colors"
                    >
                        <Icon name="ArrowLeft" size={16} /> Back to Projects
                    </button>

                    {/* Project Detail Card */}
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card overflow-hidden">
                        {/* Header */}
                        <div className="p-8 pb-6 border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-white tracking-tight">
                                            {selectedProject.title}
                                        </h1>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            selectedProject.status === 'completed' || selectedProject.completedAt
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                            {selectedProject.status === 'completed' || selectedProject.completedAt ? 'Completed' : 'In Progress'}
                                        </span>
                                    </div>
                                    {selectedProject.completedAt && (
                                        <p className="text-xs text-[#555555] flex items-center gap-1.5">
                                            <Icon name="Calendar" size={13} />
                                            Completed: {new Date(selectedProject.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(selectedProject)}
                                        className="px-4 py-2 bg-white dark:bg-[#1C1B1A] text-[#000000] dark:text-white border border-[#D9CFC7] rounded-xl hover:bg-[#F9F8F6] transition-colors text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <Icon name="Edit3" size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedProject.id)}
                                        className="px-4 py-2 bg-white dark:bg-[#1C1B1A] text-red-600 border border-[#D9CFC7] rounded-xl hover:bg-red-50 transition-colors text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <Icon name="Trash2" size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            {/* Description */}
                            {selectedProject.description && (
                                <div>
                                    <h3 className="text-xs font-bold text-[#555555] uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Icon name="FileText" size={14} className="text-[#C9B59C]" /> Description
                                    </h3>
                                    <p className="text-[#333333] dark:text-[#CCCCCC] text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedProject.description}
                                    </p>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-[#555555] uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Icon name="Layers" size={14} className="text-[#C9B59C]" /> Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-[#F9F8F6] dark:bg-[#1C1B1A] border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] rounded-lg text-xs font-bold text-[#000000] dark:text-white"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links */}
                            {(selectedProject.githubUrl || selectedProject.repoUrl || selectedProject.liveUrl) && (
                                <div>
                                    <h3 className="text-xs font-bold text-[#555555] uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Icon name="Link" size={14} className="text-[#C9B59C]" /> Links
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {(selectedProject.githubUrl || selectedProject.repoUrl) && (
                                            <a
                                                href={selectedProject.githubUrl || selectedProject.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-3 bg-[#141414] text-white rounded-xl text-sm font-bold hover:bg-[#262422] transition-colors"
                                            >
                                                <Icon name="Github" size={16} /> View on GitHub
                                                <Icon name="ExternalLink" size={13} className="ml-auto opacity-60" />
                                            </a>
                                        )}
                                        {selectedProject.liveUrl && (
                                            <a
                                                href={selectedProject.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-3 bg-[#FF5722] text-white rounded-xl text-sm font-bold hover:bg-[#e04d1d] transition-colors"
                                            >
                                                <Icon name="Globe" size={16} /> Live Demo
                                                <Icon name="ExternalLink" size={13} className="ml-auto opacity-60" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="pt-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
                                <div className="flex flex-wrap gap-6 text-xs text-[#555555]">
                                    {selectedProject.createdAt && (
                                        <span className="flex items-center gap-1.5">
                                            <Icon name="Clock" size={13} className="text-[#C9B59C]" />
                                            Added: {new Date(selectedProject.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Icon name="Tag" size={13} className="text-[#C9B59C]" />
                                        Status: {selectedProject.status === 'completed' || selectedProject.completedAt ? 'Completed' : 'In Progress'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN LIST VIEW ---
    return (
        <div className="min-h-screen py-6 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                            <h1 className="heading-serif text-display text-[#000000] dark:text-white">
                                My Projects
                            </h1>
                            <p className="text-[#555555] dark:text-[#A1A1A1] mt-1">
                                Showcase your portfolio and track your builds
                            </p>
                        </div>
                        <Button onClick={() => navigate('/profile')} variant="outline" className="flex items-center gap-2">
                            <Icon name="ArrowLeft" size={16} /> Back to Profile
                        </Button>
                    </div>

                    {!showAddForm && (
                        <Button onClick={() => setShowAddForm(true)} size="lg" className="flex items-center gap-2">
                            <Icon name="Plus" size={17} strokeWidth={2} /> Add New Project
                        </Button>
                    )}
                </div>

                {/* Stats */}
                {projectsList.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#000000] dark:text-white">Total Projects</p>
                                    <p className="text-3xl font-bold text-[#000000] dark:text-white mt-1">{projectsList.length}</p>
                                </div>
                                <Icon name="Folder" size={28} className="text-[#C9B59C]" />
                            </div>
                        </div>
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#000000] dark:text-white">Completed</p>
                                    <p className="text-3xl font-bold text-[#000000] dark:text-white mt-1">{completedProjects}</p>
                                </div>
                                <Icon name="CheckCircle2" size={28} className="text-[#C9B59C]" />
                            </div>
                        </div>
                        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#000000] dark:text-white">In Progress</p>
                                    <p className="text-3xl font-bold text-[#000000] dark:text-white mt-1">{inProgressProjects}</p>
                                </div>
                                <Icon name="Clock" size={28} className="text-[#C9B59C]" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Project Form */}
                {showAddForm && (
                    <Card className="mb-8 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon name={editingProject ? "Edit3" : "Plus"} size={18} />
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input label="Project Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., E-commerce Platform" required />
                                    <div>
                                        <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 border border-[#D9CFC7] rounded-xl bg-white text-[#000000] text-sm focus:ring-2 focus:ring-[#C9B59C]">
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-[#D9CFC7] rounded-xl bg-white text-[#000000] text-sm focus:ring-2 focus:ring-[#C9B59C]" rows={3} placeholder="Brief description of the project..." required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input label="GitHub Repository URL" value={formData.repoUrl} onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })} placeholder="https://github.com/username/repo" />
                                    <Input label="Live Demo URL (Optional)" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} placeholder="https://myproject.com" />
                                </div>
                                <div className="mb-6">
                                    <Input label="Tech Stack (comma separated)" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL, AWS" />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingProject(null); resetForm(); }}>Cancel</Button>
                                    <Button type="submit">{editingProject ? 'Update Project' : 'Save Project'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Projects Grid */}
                {projectsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsList.map((project) => (
                            <Card key={project.id} hover className="overflow-hidden rounded-2xl flex flex-col justify-between cursor-pointer group" onClick={() => setSelectedProject(project)}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-3 gap-2">
                                        <h3 className="text-lg font-semibold text-[#000000] dark:text-white leading-snug group-hover:text-[#FF5722] transition-colors">
                                            {project.title}
                                        </h3>
                                        <span className="px-3 py-1 bg-[#C9B59C] text-[#000000] text-xs font-semibold rounded-full flex-shrink-0">
                                            {project.status === 'completed' || project.completedAt ? 'Done' : 'WIP'}
                                        </span>
                                    </div>
                                    <p className="text-[#555555] dark:text-[#A1A1A1] text-xs mb-4 leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.technologies.slice(0, 4).map((tech, index) => (
                                                    <span key={index} className="px-2.5 py-1 bg-[#EFE9E3] border border-[#D9CFC7] rounded-md text-xs font-medium text-[#000000]">{tech}</span>
                                                ))}
                                                {project.technologies.length > 4 && (
                                                    <span className="px-2.5 py-1 bg-[#EFE9E3] border border-[#D9CFC7] rounded-md text-xs font-medium text-[#555555]">+{project.technologies.length - 4} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mb-4">
                                        {project.githubUrl && (
                                            <span className="flex items-center gap-1.5 text-xs text-[#000000] dark:text-white font-semibold">
                                                <Icon name="Github" size={14} /> GitHub
                                            </span>
                                        )}
                                        {project.liveUrl && (
                                            <span className="flex items-center gap-1.5 text-xs text-[#000000] dark:text-white font-semibold">
                                                <Icon name="ExternalLink" size={14} /> Live Demo
                                            </span>
                                        )}
                                    </div>
                                    {project.completedAt && (
                                        <p className="text-xs text-[#555555] mb-4">
                                            Completed: {new Date(project.completedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                    <div className="flex gap-2 pt-3 border-t border-[#D9CFC7] dark:border-[rgba(255,255,255,0.06)]">
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(project); }} className="flex-1 py-2 px-3 bg-white dark:bg-[#2A2826] text-[#000000] dark:text-white border border-[#D9CFC7] rounded-xl hover:bg-[#EFE9E3] transition-colors text-xs font-semibold flex items-center justify-center gap-1.5">
                                            <Icon name="Edit3" size={14} /> Edit
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} className="flex-1 py-2 px-3 bg-white dark:bg-[#2A2826] text-[#000000] dark:text-white border border-[#D9CFC7] rounded-xl hover:bg-[#EFE9E3] transition-colors text-xs font-semibold flex items-center justify-center gap-1.5">
                                            <Icon name="Trash2" size={14} /> Delete
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center rounded-2xl">
                        <CardContent className="py-12">
                            <Icon name="Folder" size={44} strokeWidth={1.8} className="text-[#000000] mx-auto mb-4" />
                            <h3 className="heading-serif text-display text-[#000000] dark:text-white mb-2">No Projects Yet</h3>
                            <p className="text-[#555555] dark:text-[#A1A1A1] text-sm mb-6">Start building and showcasing your portfolio projects</p>
                            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 mx-auto">
                                <Icon name="Plus" size={17} strokeWidth={2} /> Add Your First Project
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;