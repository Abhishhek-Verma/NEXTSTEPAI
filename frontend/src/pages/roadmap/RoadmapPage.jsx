import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

// Sortable Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const taskTypeIcons = {
        learn: 'BookOpen',
        build: 'Hammer',
        apply: 'FileText',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-[#F9F8F6] dark:bg-[#1C1B1A] border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] rounded-2xl p-5 mb-3 cursor-move hover:shadow-soft transition-all duration-200 ${
                task.completed ? 'opacity-60' : ''
            }`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EFE9E3] dark:bg-[#262422] border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] rounded-full text-xs font-semibold text-[#000000] dark:text-white">
                        <Icon name={taskTypeIcons[task.taskType] || 'BookOpen'} size={14} /> {task.taskType ? task.taskType.toUpperCase() : 'TASK'}
                    </span>
                    {task.phase && (
                        <span className="px-2.5 py-0.5 bg-[#D9CFC7]/40 dark:bg-white/10 rounded-full text-[11px] font-medium text-[#555555] dark:text-[#A1A1A1]">
                            {task.phase}
                        </span>
                    )}
                    {task.estimatedWeeks && (
                        <span className="text-[11px] text-[#555555] dark:text-[#A1A1A1]">
                            ⏱ {task.estimatedWeeks}w
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`text-lg transition-transform hover:scale-110 p-1 rounded-md ${task.completed ? 'text-[#000000] dark:text-white' : 'text-[#555555]'}`}
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                        <Icon name={task.completed ? "CheckSquare" : "Square"} size={18} />
                    </button>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-[#555555] hover:text-[#000000] dark:hover:text-white transition-colors p-1 rounded-md"
                        title="Edit task"
                    >
                        <Icon name="Edit2" size={16} />
                    </button>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-[#555555] hover:text-[#E53E3E] dark:hover:text-[#FC8181] transition-colors p-1 rounded-md"
                        title="Delete task"
                    >
                        <Icon name="Trash2" size={16} />
                    </button>
                </div>
            </div>
            {task.title && (
                <h4 className={`text-sm font-semibold text-[#000000] dark:text-white mb-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.title}
                </h4>
            )}
            <p className={`text-[#333333] dark:text-[#DDD] text-sm font-normal mb-3 leading-relaxed ${task.completed ? 'line-through text-[#555555] dark:text-[#666]' : ''}`}>
                {task.description}
            </p>
            {task.skills && Array.isArray(task.skills) && task.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {task.skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#EFE9E3]/70 dark:bg-white/5 border border-[#D9CFC7]/60 dark:border-white/10 rounded text-[11px] text-[#444] dark:text-[#BBB]">
                            {s}
                        </span>
                    ))}
                </div>
            )}
            {task.resources && Array.isArray(task.resources) && task.resources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#D9CFC7]/40 dark:border-white/10">
                    {task.resources.map((res, idx) => (
                        <a
                            key={idx}
                            href={res.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                        >
                            <Icon name="ExternalLink" size={11} /> {res.title || res.name || 'Resource'}
                        </a>
                    ))}
                </div>
            )}
            {task.dueDate && (
                <p className="text-xs text-[#555555] mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
        </div>
    );
};

const RoadmapPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        roadmap,
        fetchRoadmap,
        generateRoadmap,
        addRoadmapItem,
        updateRoadmapItem,
        deleteRoadmapItem,
        toggleItemComplete,
        reorderRoadmap,
        exportRoadmapJSON,
        exportRoadmapCSV,
    } = useStore();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [targetRole, setTargetRole] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    const initialFormData = {
        title: '',
        taskType: 'learn',
        phase: 'Foundation',
        estimatedWeeks: 2,
        skills: '',
        description: '',
        dueDate: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchRoadmap();
    }, []);

    useEffect(() => {
        if (location.state?.targetRole) {
            setTargetRole(location.state.targetRole);
            setShowGenerateModal(true);
        }
    }, [location.state]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = roadmap.items.findIndex((item) => item.id === active.id);
            const newIndex = roadmap.items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(roadmap.items, oldIndex, newIndex);
            reorderRoadmap(newItems);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: formData.title.trim() || formData.description.slice(0, 40),
                description: formData.description.trim(),
                taskType: formData.taskType,
                phase: formData.phase,
                estimatedWeeks: parseInt(formData.estimatedWeeks) || 1,
                skills: typeof formData.skills === 'string'
                    ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
                    : formData.skills,
                dueDate: formData.dueDate || null,
            };

            if (editingTask) {
                await updateRoadmapItem(editingTask.id, payload);
                setEditingTask(null);
            } else {
                await addRoadmapItem(payload);
            }
            setFormData(initialFormData);
            setShowAddForm(false);
        } catch (error) {
            console.error('Error saving roadmap item:', error);
            alert('Failed to save task. Please try again.');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title || '',
            taskType: task.taskType || 'learn',
            phase: task.phase || 'Foundation',
            estimatedWeeks: task.estimatedWeeks || 2,
            skills: Array.isArray(task.skills) ? task.skills.join(', ') : (task.skills || ''),
            description: task.description || '',
            dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteRoadmapItem(id);
        }
    };

    const handleGenerate = async () => {
        if (!targetRole.trim()) {
            alert('Please enter a target role');
            return;
        }

        try {
            setGenerating(true);
            await generateRoadmap(targetRole);
            setShowGenerateModal(false);
            setTargetRole('');
        } catch (error) {
            console.error('Generation error:', error);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const completedCount = roadmap.items.filter((item) => item.completed).length;
    const progressPercentage = roadmap.items.length > 0
        ? Math.round((completedCount / roadmap.items.length) * 100)
        : 0;

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="heading-serif text-display text-[#000000] dark:text-white">
                            Career Roadmap
                        </h1>
                        <p className="text-[#555555] dark:text-[#A1A1A1] mt-1">
                            Your personalized learning and career path
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={exportRoadmapJSON} className="flex items-center gap-2">
                            <Icon name="Download" size={16} /> Export JSON
                        </Button>
                        <Button variant="outline" onClick={exportRoadmapCSV} className="flex items-center gap-2">
                            <Icon name="FileSpreadsheet" size={16} /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Progress Card */}
                {roadmap.items.length > 0 && (
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 lg:p-8 mb-8 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-[#000000] dark:text-white">Progress Tracker</h2>
                                <p className="text-xs text-[#555555] dark:text-[#A1A1A1] mt-1">
                                    {completedCount} of {roadmap.items.length} tasks completed
                                </p>
                            </div>
                            <div className="text-4xl font-bold text-[#000000] dark:text-white">{progressPercentage}%</div>
                        </div>
                        <div className="w-full bg-[#D9CFC7]/50 dark:bg-[rgba(255,255,255,0.06)] rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-[#000000] dark:bg-[#C9B59C] h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2">
                        <Icon name="Sparkles" size={17} strokeWidth={2} /> Generate AI Roadmap
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                        <Icon name="Plus" size={17} /> Add Task Manually
                    </Button>
                </div>

                {/* Generate Modal */}
                {showGenerateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl p-6 max-w-md w-full border border-[#D9CFC7]">
                            <h3 className="text-xl font-semibold text-[#000000] dark:text-white mb-4 flex items-center gap-2">
                                <Icon name="Sparkles" size={20} className="text-[#C9B59C]" /> Generate AI Roadmap
                            </h3>
                            <Input
                                label="Target Role"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Senior Full Stack Developer"
                                className="mb-6"
                            />
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" disabled={generating} onClick={() => setShowGenerateModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleGenerate} loading={generating} disabled={generating}>
                                    {generating ? 'Generating...' : 'Generate'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 mb-8 border border-[#D9CFC7] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#000000] dark:text-white mb-4">
                            {editingTask ? 'Edit Milestone Task' : 'Add New Task Manually'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Task Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Advanced DSA & Problem Solving"
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#555555] dark:text-[#A1A1A1] uppercase mb-2">
                                        Task Type
                                    </label>
                                    <select
                                        value={formData.taskType}
                                        onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[#D9CFC7] rounded-xl bg-white dark:bg-[#1C1B1A] text-[#000000] dark:text-white text-sm focus:ring-2 focus:ring-[#C9B59C]"
                                    >
                                        <option value="learn">Learn</option>
                                        <option value="build">Build</option>
                                        <option value="apply">Apply</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#555555] dark:text-[#A1A1A1] uppercase mb-2">
                                        Phase
                                    </label>
                                    <select
                                        value={formData.phase}
                                        onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[#D9CFC7] rounded-xl bg-white dark:bg-[#1C1B1A] text-[#000000] dark:text-white text-sm focus:ring-2 focus:ring-[#C9B59C]"
                                    >
                                        <option value="Foundation">Foundation</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Production">Production</option>
                                    </select>
                                </div>

                                <Input
                                    label="Estimated Weeks"
                                    type="number"
                                    min="1"
                                    max="52"
                                    value={formData.estimatedWeeks}
                                    onChange={(e) => setFormData({ ...formData, estimatedWeeks: e.target.value })}
                                    placeholder="e.g., 2"
                                />
                            </div>

                            <Input
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the specific objectives or exercises..."
                                required
                            />

                            <Input
                                label="Skills (comma-separated)"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="e.g., Binary Trees, Dynamic Programming, LeetCode"
                            />

                            <Input
                                label="Target Due Date (Optional)"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />

                            <div className="flex gap-3 justify-end pt-2">
                                <Button type="submit">
                                    {editingTask ? 'Update Task' : 'Save Task to Roadmap'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingTask(null);
                                        setFormData(initialFormData);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Task List */}
                {roadmap.items.length > 0 ? (
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-6 lg:p-8">
                        <h2 className="text-xl font-semibold text-[#000000] dark:text-white mb-4">
                            Your Roadmap (Drag to Reorder)
                        </h2>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={roadmap.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                {roadmap.items.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleComplete={toggleItemComplete}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                ) : (
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card p-12 text-center">
                        <Icon name="Compass" size={44} strokeWidth={1.8} className="text-[#000000] mx-auto mb-4" />
                        <h3 className="heading-serif text-display text-[#000000] dark:text-white mb-2">
                            No Roadmap Yet
                        </h3>
                        <p className="text-[#555555] dark:text-[#A1A1A1] text-sm mb-6">
                            Generate an AI-powered roadmap or add tasks manually
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2">
                                <Icon name="Sparkles" size={17} strokeWidth={2} /> Generate AI Roadmap
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                                <Icon name="Plus" size={17} /> Add Task
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadmapPage;