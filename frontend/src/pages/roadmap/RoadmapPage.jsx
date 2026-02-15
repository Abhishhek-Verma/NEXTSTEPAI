import React, { useState } from 'react';
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
        learn: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        build: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        apply: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
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
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 cursor-move hover:shadow-lg transition-shadow ${task.completed ? 'opacity-60' : ''
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${taskTypeColors[task.taskType]}`}>
                    {taskTypeIcons[task.taskType]} {task.taskType.toUpperCase()}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`text-xl ${task.completed ? 'text-green-500' : 'text-gray-300'}`}
                    >
                        {task.completed ? '✅' : '⬜'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                    >
                        🗑️
                    </button>
                </div>
            </div>
            <p className={`text-gray-900 dark:text-white mb-2 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
            </p>
            {task.dueDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
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

    const handleGenerateRoadmap = () => {
        // Mock AI-generated roadmap
        const mockTasks = [
            {
                taskType: 'learn',
                description: 'Master React Advanced Patterns (Hooks, Context, Custom Hooks)',
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            {
                taskType: 'build',
                description: 'Build a full-stack project: Real-time chat application',
                dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            {
                taskType: 'learn',
                description: 'Study System Design fundamentals (Scalability, Databases, Caching)',
                dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            {
                taskType: 'apply',
                description: 'Apply to 10 companies: Google, Microsoft, Amazon, etc.',
                dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
        ];

        mockTasks.forEach((task, index) => {
            addRoadmapItem({
                ...task,
                sequenceNo: roadmap.items.length + index + 1,
                completed: false,
            });
        });

        alert('AI Roadmap generated! (Mock data)');
    };

    const completedCount = roadmap.items.filter((item) => item.completed).length;
    const progressPercentage = roadmap.items.length > 0
        ? Math.round((completedCount / roadmap.items.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent bg-clip-text text-transparent">
                            Career Roadmap
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Progress Tracker</h2>
                                <p className="text-blue-100 mt-1">
                                    {completedCount} of {roadmap.items.length} tasks completed
                                </p>
                            </div>
                            <div className="text-5xl font-bold">{progressPercentage}%</div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-brand-accent to-white h-4 rounded-full transition-all duration-500"
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
                    <Button onClick={handleGenerateRoadmap} variant="outline" className="flex-1">
                        🤖 Generate AI Roadmap
                    </Button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {editingTask ? 'Edit Task' : 'Add New Task'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Task Type</label>
                                    <select
                                        value={formData.taskType}
                                        onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

                {/* Kanban Board */}
                {roadmap.items.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🗺️</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No Roadmap Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Generate an AI-powered roadmap or add tasks manually
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={handleGenerateRoadmap}>🤖 Generate AI Roadmap</Button>
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