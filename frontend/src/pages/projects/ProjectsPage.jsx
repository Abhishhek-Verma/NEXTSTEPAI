import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const { projects, addProject, updateProject, deleteProject } = useStore();
    const projectsList = projects.list || [];
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const projectData = {
            ...formData,
            techStack: formData.techStack.split(',').map((tech) => tech.trim()).filter(Boolean),
            completedAt: formData.status === 'completed' ? new Date().toISOString() : null,
        };

        if (editingProject) {
            updateProject(editingProject.id, projectData);
        } else {
            addProject(projectData);
        }

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
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description,
            repoUrl: project.repoUrl || '',
            liveUrl: project.liveUrl || '',
            techStack: project.techStack ? project.techStack.join(', ') : '',
            status: project.completedAt ? 'completed' : 'in-progress',
        });
        setEditingProject(project);
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    const statusColors = {
        'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };

    const completedProjects = projectsList.filter((p) => p.completedAt).length;
    const inProgressProjects = projectsList.length - completedProjects;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                My Projects
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
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
                        <Card hover>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                                        <p className="text-4xl font-bold text-blue-600 mt-2">
                                            {projectsList.length}
                                        </p>
                                    </div>
                                    <div className="text-5xl">📁</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card hover>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                        <p className="text-4xl font-bold text-green-600 mt-2">
                                            {completedProjects}
                                        </p>
                                    </div>
                                    <div className="text-5xl">✅</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card hover>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                                        <p className="text-4xl font-bold text-amber-600 mt-2">
                                            {inProgressProjects}
                                        </p>
                                    </div>
                                    <div className="text-5xl">🔄</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Add/Edit Project Form */}
                {showAddForm && (
                    <Card className="mb-8">
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="in-progress">🔄 In Progress</option>
                                            <option value="completed">✅ Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:text-white"
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

                                <div className="mb-4">
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
                            <Card key={project.id} hover className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {project.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded ${
                                                statusColors[project.completedAt ? 'completed' : 'in-progress']
                                            }`}
                                        >
                                            {project.completedAt ? '✅ Done' : '🔄 WIP'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        {project.description}
                                    </p>

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full font-medium"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mb-4">
                                        {project.repoUrl && (
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <span>🔗</span> GitHub
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                                            >
                                                <span>🌐</span> Live Demo
                                            </a>
                                        )}
                                    </div>

                                    {project.completedAt && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            Completed: {new Date(project.completedAt).toLocaleDateString()}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center">
                        <CardContent className="py-12">
                            <div className="text-6xl mb-4 animate-float">📂</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                No Projects Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
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