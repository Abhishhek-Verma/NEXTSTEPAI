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
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EFE9E3] border border-[#D9CFC7] rounded-full text-xs font-semibold text-[#000000]">
                    <Icon name={taskTypeIcons[task.taskType] || 'BookOpen'} size={14} /> {task.taskType.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`text-lg transition-transform hover:scale-110 ${task.completed ? 'text-[#000000]' : 'text-[#555555]'}`}
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                        <Icon name={task.completed ? "CheckSquare" : "Square"} size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-[#555555] hover:text-[#000000] transition-colors p-1"
                        title="Edit task"
                    >
                        <Icon name="Edit2" size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-[#555555] hover:text-[#000000] transition-colors p-1"
                        title="Delete task"
                    >
                        <Icon name="Trash2" size={16} />
                    </button>
                </div>
            </div>
            <p className={`text-[#000000] dark:text-white text-sm font-medium mb-2 leading-relaxed ${task.completed ? 'line-through text-[#555555] dark:text-[#666]' : ''}`}>
                {task.description}
            </p>
            {task.dueDate && (
                <p className="text-xs text-[#555555]">Due: {task.dueDate}</p>
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
        toggleItemComplete,
        reorderRoadmap,
        exportRoadmapJSON,
        exportRoadmapCSV,
    } = useStore();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [targetRole, setTargetRole] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        taskType: 'learn',
        description: '',
        dueDate: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = roadmap.items.findIndex((item) => item.id === active.id);
            const newIndex = roadmap.items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(roadmap.items, oldIndex, newIndex);
            reorderRoadmap(newItems);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTask) {
            updateRoadmapItem(editingTask.id, formData);
            setEditingTask(null);
        } else {
            addRoadmapItem(formData);
        }
        setFormData({ taskType: 'learn', description: '', dueDate: '' });
        setShowAddForm(false);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            taskType: task.taskType,
            description: task.description,
            dueDate: task.dueDate || '',
        });
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteRoadmapItem(id);
        }
    };

    const handleGenerate = async () => {
        if (!targetRole.trim()) {
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
                                <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleGenerate}>
                                    Generate
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 mb-8 border border-[#D9CFC7]">
                        <h3 className="text-xl font-semibold text-[#000000] dark:text-white mb-4">
                            {editingTask ? 'Edit Task' : 'Add New Task'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#555555] dark:text-[#A1A1A1] uppercase mb-2">
                                    Task Type
                                </label>
                                <select
                                    value={formData.taskType}
                                    onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#D9CFC7] rounded-xl bg-white text-[#000000] text-sm focus:ring-2 focus:ring-[#C9B59C]"
                                >
                                    <option value="learn">Learn</option>
                                    <option value="build">Build</option>
                                    <option value="apply">Apply</option>
                                </select>
                            </div>

                            <Input
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g., Complete React documentation"
                                required
                            />

                            <Input
                                label="Due Date"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />

                            <div className="flex gap-3 justify-end pt-2">
                                <Button type="submit">
                                    {editingTask ? 'Update Task' : 'Add Task'}
                                </Button>
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