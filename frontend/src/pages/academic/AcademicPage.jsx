import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiClient from '../../api/client';

const AcademicPage = () => {
    const navigate = useNavigate();
    const { academics, setAcademicRecords, setAcademicsLoading, setAcademicsError } = useStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        semester: '',
        gpa: '',
        subjects: [],
    });
    const [subjectInput, setSubjectInput] = useState({ name: '', score: '' });

    // Fetch academic records from database on mount
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setAcademicsLoading(true);
                const response = await apiClient.get('/academic/records');
                setAcademicRecords(response.data.records || []);
            } catch (error) {
                console.error('Failed to fetch academic records:', error);
                setAcademicsError(error.message || 'Failed to load academic records');
            }
        };

        fetchRecords();
    }, []);

    // Save all records to database
    const saveRecordsToDatabase = async (updatedRecordsList) => {
        try {
            setAcademicsLoading(true);
            
            // Map frontend format to backend format
            const recordsToSave = updatedRecordsList.map(record => ({
                semester: parseInt(record.semester) || null,
                gpa: parseFloat(record.gpa) || null,
                details: record.details || (record.subjects && record.subjects.length > 0 ? { subjects: record.subjects } : null)
            }));

            console.log('Saving records:', recordsToSave);
            const response = await apiClient.post('/academic/records', { records: recordsToSave });
            console.log('Save response:', response.data);
            
            // Refresh records from server
            const fetchResponse = await apiClient.get('/academic/records');
            setAcademicRecords(fetchResponse.data.records || []);
            setAcademicsLoading(false);
        } catch (error) {
            console.error('Failed to save academic records:', error);
            console.error('Error response:', error.response?.data);
            setAcademicsLoading(false);
            setAcademicsError(error.response?.data?.error || error.message || 'Failed to save academic records');
            throw error;
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                let newRecords = [];
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(event.target.result);
                    newRecords = data;
                } else if (file.name.endsWith('.csv')) {
                    newRecords = parseCSV(event.target.result);
                }

                // Save to database
                const updatedList = [...academics.records, ...newRecords];
                await saveRecordsToDatabase(updatedList);
                alert('Academic records imported successfully!');
            } catch (error) {
                alert('Failed to import records. Please check the format and try again.');
            }
        };
        reader.readAsText(file);
    };

    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const records = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 2) {
                records.push({
                    semester: parseInt(values[0]) || i,
                    gpa: parseFloat(values[1]) || 0,
                    subjects: [],
                });
            }
        }
        
        return records;
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!formData.semester || !formData.gpa) {
            alert('Please fill in both Semester and GPA fields');
            return;
        }

        const semesterNum = parseInt(formData.semester);
        const gpaNum = parseFloat(formData.gpa);

        if (isNaN(semesterNum) || semesterNum < 1) {
            alert('Please enter a valid semester number (1 or greater)');
            return;
        }

        if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) {
            alert('Please enter a valid GPA between 0 and 10');
            return;
        }

        const record = {
            semester: semesterNum,
            gpa: gpaNum,
            subjects: formData.subjects,
        };

        try {
            let updatedRecords;
            if (editingId) {
                // Update existing record
                updatedRecords = academics.records.map((r) =>
                    r.id === editingId ? { ...r, ...record } : r
                );
            } else {
                // Add new record with temporary ID
                updatedRecords = [...academics.records, { ...record, id: Date.now() }];
            }

            // Save to database
            await saveRecordsToDatabase(updatedRecords);

            setFormData({ semester: '', gpa: '', subjects: [] });
            setShowAddForm(false);
            setEditingId(null);
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save record. Please try again.');
        }
    };

    const handleEdit = (record) => {
        setFormData({
            semester: record.semester.toString(),
            gpa: record.gpa.toString(),
            subjects: record.additionalInfo?.subjects || record.subjects || [],
        });
        setEditingId(record.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) {
            return;
        }

        try {
            setAcademicsLoading(true);
            await apiClient.delete(`/academic/records/${id}`);
            
            // Refresh records from server
            const response = await apiClient.get('/academic/records');
            setAcademicRecords(response.data.records || []);
        } catch (error) {
            console.error('Failed to delete record:', error);
            setAcademicsError(error.message || 'Failed to delete record');
            alert('Failed to delete record. Please try again.');
        }
    };

    // Calculate average GPA from records
    const averageGPA = academics.records.length > 0
        ? (academics.records.reduce((acc, r) => acc + (parseFloat(r.gpa) || 0), 0) / academics.records.length).toFixed(2)
        : '0.00';

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

                {/* Error Display */}
                {academics.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <span className="text-red-600 dark:text-red-400 text-xl mr-3">⚠️</span>
                            <div className="flex-1">
                                <h3 className="text-red-800 dark:text-red-300 font-semibold">Error</h3>
                                <p className="text-red-700 dark:text-red-400 text-sm mt-1">{academics.error}</p>
                            </div>
                            <button 
                                onClick={() => setAcademicsError(null)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading Indicator */}
                {academics.loading && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-center">
                        <p className="text-blue-700 dark:text-blue-300">Saving your data...</p>
                    </div>
                )}

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
                                    min="1"
                                    max="20"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    placeholder="e.g., 1"
                                    required
                                />
                                <Input
                                    label="GPA"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
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
                                                {record.additionalInfo?.subjects?.length || record.subjects?.length || 0} subjects
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