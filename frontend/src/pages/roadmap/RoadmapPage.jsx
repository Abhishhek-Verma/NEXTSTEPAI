import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const taskTypeColors = {
        learn: 'badge-info',
        build: 'badge-success',
        apply: 'badge-ai',
    };

    const taskTypeIcons = {
        learn: '📚',
        build: '🔨',
        apply: '📝',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-[#FAF9F6] dark:bg-[#2a2b2e] border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)] rounded-2xl p-5 mb-3 cursor-move hover:shadow-soft transition-all duration-200 ${
                task.completed ? 'opacity-60' : ''
            }`}
        >
            <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-semibold ${taskTypeColors[task.taskType] || 'badge-pending'}`}>
                    {taskTypeIcons[task.taskType]} {task.taskType.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`text-lg transition-transform hover:scale-110 ${task.completed ? 'text-[#10B981]' : 'text-[#909090]'}`}
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                        {task.completed ? '✅' : '⬜'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white transition-colors text-sm p-1"
                        title="Edit task"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-[#EF4444]/70 hover:text-[#EF4444] transition-colors text-sm p-1"
                        title="Delete task"
                    >
                        🗑️
                    </button>
                </div>
            </div>
            <p className={`text-[#111111] dark:text-white text-sm font-medium mb-2 leading-relaxed ${task.completed ? 'line-through text-[#909090] dark:text-[#666]' : ''}`}>
                {task.description}
            </p>
            {task.dueDate && (
                <p className="text-xs text-[#909090]">
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}
        </div>
    );
};

const RoadmapPage = () => {
    const navigate = useNavigate();
    const {
        roadmap,
        fetchRoadmap,
        generateRoadmap,
        addRoadmapItem,
        updateRoadmapItem,
        deleteRoadmapItem,
        reorderRoadmapItems,
        toggleItemComplete,
        exportRoadmapJSON,
        exportRoadmapCSV,
    } = useStore();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [targetRole, setTargetRole] = useState('');
    const [formData, setFormData] = useState({
        taskType: 'learn',
        description: '',
        dueDate: '',
    });

    // Fetch roadmap on mount
    useEffect(() => {
        fetchRoadmap();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = roadmap.items.findIndex((item) => item.id === active.id);
            const newIndex = roadmap.items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(roadmap.items, oldIndex, newIndex).map((item, index) => ({
                ...item,
                sequenceNo: index + 1,
            }));

            reorderRoadmapItems(newItems);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingTask) {
            updateRoadmapItem(editingTask.id, formData);
        } else {
            addRoadmapItem({
                ...formData,
                sequenceNo: roadmap.items.length + 1,
                completed: false,
            });
        }

        setFormData({ taskType: 'learn', description: '', dueDate: '' });
        setShowAddForm(false);
        setEditingTask(null);
    };

    const handleEdit = (task) => {
        setFormData({
            taskType: task.taskType,
            description: task.description,
            dueDate: task.dueDate || '',
        });
        setEditingTask(task);
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteRoadmapItem(id);
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!targetRole || targetRole.trim() === '') {
            alert('Please enter a target role');
            return;
        }

        try {
            await generateRoadmap(targetRole);
            setShowGenerateModal(false);
            setTargetRole('');
        } catch (error) {
            alert('Failed to generate roadmap. Please try again.');
        }
    };

    const completedCount = roadmap.items.filter((item) => item.completed).length;
    const progressPercentage = roadmap.items.length > 0
        ? Math.round((completedCount / roadmap.items.length) * 100)
        : 0;

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="heading-serif text-display text-[#111111] dark:text-white">
                            Career Roadmap
                        </h1>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mt-1">
                            Your personalized learning and career path
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={exportRoadmapJSON}>
                            📥 Export JSON
                        </Button>
                        <Button variant="outline" onClick={exportRoadmapCSV}>
                            📊 Export CSV
                        </Button>
                    </div>
                </div>

                {/* Progress Card */}
                {roadmap.items.length > 0 && (
                    <div className="card-pastel-blue rounded-2xl p-6 lg:p-8 mb-8 border border-[rgba(216,232,252,0.6)] shadow-card">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-[#1E40AF]">Progress Tracker</h2>
                                <p className="text-xs text-[#1E40AF]/80 mt-1">
                                    {completedCount} of {roadmap.items.length} tasks completed
                                </p>
                            </div>
                            <div className="text-4xl font-bold text-[#1E40AF]">{progressPercentage}%</div>
                        </div>
                        <div className="w-full bg-white/60 dark:bg-white/10 rounded-full h-3">
                            <div
                                className="bg-[#1E40AF] h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mb-6">
                    <Button onClick={() => setShowAddForm(!showAddForm)} className="flex-1">
                        ➕ Add Task Manually
                    </Button>
                    <Button onClick={() => setShowGenerateModal(true)} variant="outline" className="flex-1">
                        🤖 Generate AI Roadmap
                    </Button>
                </div>

                {/* Generate Roadmap Modal */}
                {showGenerateModal && (
                    <div className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-[#1F2023] rounded-3xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-lift p-8 max-w-md w-full">
                            <h2 className="heading-serif text-display text-[#111111] dark:text-white mb-2">
                                Generate AI Roadmap
                            </h2>
                            <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-sm mb-6">
                                Enter your target role and we'll create a personalized learning roadmap for you.
                            </p>
                            <Input
                                label="Target Role"
                                placeholder="e.g., Full Stack Developer, Data Scientist"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="mb-6"
                            />
                            <div className="flex gap-3">
                                <Button onClick={handleGenerateRoadmap} className="flex-1" disabled={roadmap.loading}>
                                    {roadmap.loading ? 'Generating...' : 'Generate'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowGenerateModal(false);
                                        setTargetRole('');
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 mb-6">
                        <h2 className="text-xl font-semibold text-[#111111] dark:text-white mb-4">
                            {editingTask ? 'Edit Task' : 'Add New Task'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Task Type</label>
                                    <select
                                        value={formData.taskType}
                                        onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 text-sm"
                                        required
                                    >
                                        <option value="learn">📚 Learn</option>
                                        <option value="build">🔨 Build</option>
                                        <option value="apply">📝 Apply</option>
                                    </select>
                                </div>
                                <Input
                                    label="Due Date"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] rounded-xl bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111]/10 text-sm"
                                    rows={3}
                                    placeholder="Describe the task..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit">{editingTask ? 'Update' : 'Add'} Task</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingTask(null);
                                        setFormData({ taskType: 'learn', description: '', dueDate: '' });
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
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-6 lg:p-8">
                        <h2 className="text-xl font-semibold text-[#111111] dark:text-white mb-4">
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
                    <div className="bg-white dark:bg-[#1F2023] rounded-2xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-12 text-center">
                        <div className="text-5xl mb-4">🗺️</div>
                        <h3 className="heading-serif text-display text-[#111111] dark:text-white mb-2">
                            No Roadmap Yet
                        </h3>
                        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-sm mb-6">
                            Generate an AI-powered roadmap or add tasks manually
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => setShowGenerateModal(true)}>🤖 Generate AI Roadmap</Button>
                            <Button variant="outline" onClick={() => setShowAddForm(true)}>
                                ➕ Add Task
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadmapPage;