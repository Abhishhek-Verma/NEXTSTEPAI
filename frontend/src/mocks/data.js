export const mockUser = {
    id: 'mock-user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
};

export const mockAcademicRecords = [
    {
        id: 1,
        semester: 1,
        gpa: 8.5,
        subjects: [
            { name: 'Mathematics I', score: 85 },
            { name: 'Physics', score: 82 },
            { name: 'Programming', score: 90 },
        ],
    },
    {
        id: 2,
        semester: 2,
        gpa: 8.8,
        subjects: [
            { name: 'Mathematics II', score: 88 },
            { name: 'Data Structures', score: 92 },
            { name: 'Digital Logic', score: 85 },
        ],
    },
    {
        id: 3,
        semester: 3,
        gpa: 9.0,
        subjects: [
            { name: 'Algorithms', score: 95 },
            { name: 'Database Systems', score: 88 },
            { name: 'Computer Networks', score: 87 },
        ],
    },
];

export const mockCodingProfile = {
    platforms: {
        github: {
            profileUrl: 'https://github.com/johndoe',
            username: 'johndoe',
            metrics: { commitsPerWeek: 15, stars: 42, prs: 28 },
        },
        leetcode: {
            profileUrl: 'https://leetcode.com/johndoe',
            username: 'johndoe',
            metrics: { problemsSolved: 245, contestRating: 1850 },
        },
        codeforces: {
            profileUrl: 'https://codeforces.com/profile/johndoe',
            handle: 'johndoe',
            metrics: { rating: 1650, contests: 32 },
        },
        codechef: {
            profileUrl: 'https://codechef.com/users/johndoe',
            handle: 'johndoe',
            metrics: { rating: 1720, contests: 28 },
        },
    },
};

export const mockPsychometricProfile = {
    testName: 'Career Traits Assessment',
    takenAt: new Date().toISOString(),
    traits: {
        analytical: 0.85,
        creative: 0.72,
        leadership: 0.68,
        teamwork: 0.90,
        technical: 0.88,
        communication: 0.75,
    },
};

export const mockAnalysisResult = {
    inclination: 'Corporate',
    confidence: 0.82,
    rationale: [
        'Strong technical skills with consistent GitHub activity',
        'High GPA trend showing academic excellence',
        'Balanced personality traits favoring team collaboration',
        'Problem-solving abilities demonstrated through LeetCode ratings',
    ],
};

export const mockRecommendations = {
    roles: [
        {
            id: 1,
            type: 'role',
            title: 'Full Stack Developer',
            content: 'Build end-to-end web applications using modern frameworks',
            score: 0.92,
            relatedSkillIds: [1, 2, 3],
        },
        {
            id: 2,
            type: 'role',
            title: 'Backend Engineer',
            content: 'Design and develop scalable server-side systems',
            score: 0.88,
            relatedSkillIds: [2, 4, 5],
        },
        {
            id: 3,
            type: 'role',
            title: 'DevOps Engineer',
            content: 'Automate deployment and manage cloud infrastructure',
            score: 0.85,
            relatedSkillIds: [6, 7, 8],
        },
    ],
    skills: [
        {
            id: 1,
            name: 'React',
            category: 'Frontend',
            currentLevel: 0.7,
            targetLevel: 0.9,
        },
        {
            id: 2,
            name: 'Node.js',
            category: 'Backend',
            currentLevel: 0.8,
            targetLevel: 0.95,
        },
        {
            id: 3,
            name: 'PostgreSQL',
            category: 'Database',
            currentLevel: 0.6,
            targetLevel: 0.85,
        },
        {
            id: 4,
            name: 'System Design',
            category: 'Architecture',
            currentLevel: 0.5,
            targetLevel: 0.8,
        },
    ],
    companies: [
        {
            id: 1,
            name: 'Google',
            domain: 'Search, Cloud, AI',
            notes: 'Excellent match for your technical profile',
        },
        {
            id: 2,
            name: 'Microsoft',
            domain: 'Cloud, Enterprise Software',
            notes: 'Strong backend engineering opportunities',
        },
        {
            id: 3,
            name: 'Amazon',
            domain: 'E-commerce, AWS, Logistics',
            notes: 'Great for full-stack and DevOps roles',
        },
    ],
};

export const mockRoadmap = {
    id: 'roadmap-123',
    title: 'Full Stack Developer Roadmap',
    generatedAt: new Date().toISOString(),
    items: [
        {
            id: 1,
            sequenceNo: 1,
            taskType: 'learn',
            description: 'Master React Advanced Patterns (Hooks, Context, Custom Hooks)',
            completed: false,
            dueDate: '2025-01-15',
        },
        {
            id: 2,
            sequenceNo: 2,
            taskType: 'build',
            description: 'Build a full-stack project: Real-time chat application',
            completed: false,
            dueDate: '2025-02-01',
        },
        {
            id: 3,
            sequenceNo: 3,
            taskType: 'learn',
            description: 'Study System Design fundamentals (Scalability, Databases, Caching)',
            completed: false,
            dueDate: '2025-02-20',
        },
        {
            id: 4,
            sequenceNo: 4,
            taskType: 'apply',
            description: 'Apply to 10 companies: Google, Microsoft, Amazon, etc.',
            completed: false,
            dueDate: '2025-03-01',
        },
    ],
};

export const mockProjects = [
    {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Full-stack online store with payment integration',
        repoUrl: 'https://github.com/johndoe/ecommerce',
        skills: [1, 2, 3],
        completedAt: '2024-12-01',
    },
    {
        id: 2,
        title: 'Task Management App',
        description: 'Collaborative task tracker with real-time updates',
        repoUrl: 'https://github.com/johndoe/taskmanager',
        skills: [1, 2],
        completedAt: null,
    },
];