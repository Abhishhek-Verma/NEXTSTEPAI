import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AcademicPage = () => {
    const navigate = useNavigate();
    const { academics, addAcademicRecord, updateAcademicRecord, deleteAcademicRecord, getGPAAverage } = useStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        semester: '',
        gpa: '',
        subjects: [],
    });
    const [subjectInput, setSubjectInput] = useState({ name: '', score: '' });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(event.target.result);
                    data.forEach((record) => addAcademicRecord(record));
                    alert('Academic records imported successfully!');
                } else if (file.name.endsWith('.csv')) {
                    parseCSV(event.target.result);
                }
            } catch (error) {
                alert('Failed to parse file. Please check the format.');
            }
        };
        reader.readAsText(file);
    };

    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 2) {
                addAcademicRecord({
                    semester: parseInt(values[0]) || i,
                    gpa: parseFloat(values[1]) || 0,
                    subjects: [],
                });
            }
        }
        alert('CSV imported successfully!');
    };

    const handleAddSubject = () => {
        if (subjectInput.name && subjectInput.score) {
            setFormData({
                ...formData,
                subjects: [...formData.subjects, { ...subjectInput }],
            });
            setSubjectInput({ name: '', score: '' });
        }
    };

    const handleRemoveSubject = (index) => {
        setFormData({
            ...formData,
            subjects: formData.subjects.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const record = {
            id: editingId || Date.now(),
            semester: parseInt(formData.semester),
            gpa: parseFloat(formData.gpa),
            subjects: formData.subjects,
        };

        if (editingId) {
            updateAcademicRecord(editingId, record);
        } else {
            addAcademicRecord(record);
        }

        setFormData({ semester: '', gpa: '', subjects: [] });
        setShowAddForm(false);
        setEditingId(null);
    };

    const handleEdit = (record) => {
        setFormData({
            semester: record.semester.toString(),
            gpa: record.gpa.toString(),
            subjects: record.subjects || [],
        });
        setEditingId(record.id);
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            deleteAcademicRecord(id);
        }
    };

    const averageGPA = getGPAAverage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-purple/10 to-brand-accent/10 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-accent bg-clip-text text-transparent">
                            Academic Records
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Add your semester-wise academic performance
                        </p>
                    </div>
                    <Button onClick={() => navigate('/coding')}>
                        Next: Coding Profile →
                    </Button>
                </div>

                {/* Stats Card */}
                {academics.records.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Semesters</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {academics.records.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Average GPA</p>
                                <p className="text-3xl font-bold text-brand-blue mt-1">
                                    {averageGPA}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Trend</p>
                                <p className="text-3xl font-bold text-brand-accent mt-1">
                                    {academics.records.length >= 2 &&
                                        academics.records[academics.records.length - 1].gpa >
                                        academics.records[academics.records.length - 2].gpa
                                        ? '↗ Improving'
                                        : '→ Stable'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Import Records</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="file"
                                accept=".json,.csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <div className="text-4xl mb-2">📁</div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Upload CSV or JSON
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Click to browse files
                                </p>
                            </div>
                        </label>
                        <div className="flex items-center">
                            <span className="text-gray-500">or</span>
                        </div>
                        <Button
                            onClick={() => setShowAddForm(!showAddForm)}
                            variant="outline"
                            className="flex-1"
                        >
                            ✏️ Add Manually
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Record' : 'Add New Record'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    label="Semester"
                                    type="number"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    placeholder="e.g., 1"
                                    required
                                />
                                <Input
                                    label="GPA"
                                    type="number"
                                    step="0.01"
                                    value={formData.gpa}
                                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                    placeholder="e.g., 8.5"
                                    required
                                />
                            </div>

                            {/* Subjects Section */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Subjects (Optional)</label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        placeholder="Subject name"
                                        value={subjectInput.name}
                                        onChange={(e) => setSubjectInput({ ...subjectInput, name: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Score"
                                        value={subjectInput.score}
                                        onChange={(e) => setSubjectInput({ ...subjectInput, score: e.target.value })}
                                    />
                                    <Button type="button" onClick={handleAddSubject} variant="outline">
                                        Add
                                    </Button>
                                </div>
                                {formData.subjects.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.subjects.map((subject, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
                                            >
                                                <span>
                                                    {subject.name}: {subject.score}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSubject(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">{editingId ? 'Update' : 'Add'} Record</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingId(null);
                                        setFormData({ semester: '', gpa: '', subjects: [] });
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Records List */}
                {academics.records.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Semester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        GPA
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Subjects
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {academics.records
                                    .sort((a, b) => a.semester - b.semester)
                                    .map((record) => (
                                        <tr key={record.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                Semester {record.semester}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {record.gpa}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {record.subjects?.length || 0} subjects
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No Records Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Upload a file or add records manually to get started
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicPage;