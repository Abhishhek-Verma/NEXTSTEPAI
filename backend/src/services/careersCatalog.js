/**
 * NextStepAI — Career Vector Catalog (C_j)
 * Represents canonical career tracks as parameterized multidimensional vectors matching
 * the feature dimensions of the user profile vector U = [V_A, S_P, V_Psy, V_Proj].
 */

export const CAREER_PROFILES = [
    {
        id: 'full-stack-dev',
        title: 'Full Stack Developer',
        category: 'Software Engineering',
        targetVector: {
            practicalSkill: 0.75,
            academicStrength: 0.65,
            traitFit: 0.70,
            projectEvidence: 0.85
        },
        description: 'Architect, build, and deploy end-to-end scalable web applications using modern client and server-side ecosystems.',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST APIs', 'Docker'],
        salary: '₹8L - ₹18L per annum',
        demand: 'Very High',
        targetCompanies: ['Swiggy', 'Zomato', 'Razorpay', 'Flipkart', 'CRED']
    },
    {
        id: 'backend-engineer',
        title: 'Backend Systems Engineer',
        category: 'Software Engineering',
        targetVector: {
            practicalSkill: 0.85,
            academicStrength: 0.70,
            traitFit: 0.75,
            projectEvidence: 0.80
        },
        description: 'Design distributed architectures, microservices, high-throughput database queries, and robust API infrastructure.',
        requiredSkills: ['Node.js/Go', 'PostgreSQL', 'Redis', 'System Design', 'Kafka', 'Docker'],
        salary: '₹10L - ₹22L per annum',
        demand: 'Very High',
        targetCompanies: ['Uber', 'PhonePe', 'Amazon', 'Meesho', 'Groww']
    },
    {
        id: 'ai-ml-engineer',
        title: 'Machine Learning & AI Engineer',
        category: 'Data & AI',
        targetVector: {
            practicalSkill: 0.70,
            academicStrength: 0.85,
            traitFit: 0.80,
            projectEvidence: 0.75
        },
        description: 'Train, fine-tune, and deploy predictive models, transformer architectures, and ML inference pipelines in production.',
        requiredSkills: ['Python', 'PyTorch', 'Scikit-Learn', 'Linear Algebra', 'NLP/LLMs', 'MLOps'],
        salary: '₹12L - ₹25L per annum',
        demand: 'Very High',
        targetCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Fractal', 'Postman']
    },
    {
        id: 'devops-cloud-engineer',
        title: 'DevOps & Cloud Architect',
        category: 'Infrastructure',
        targetVector: {
            practicalSkill: 0.75,
            academicStrength: 0.60,
            traitFit: 0.75,
            projectEvidence: 0.85
        },
        description: 'Manage automated CI/CD pipelines, container orchestration, infrastructure as code, and site reliability.',
        requiredSkills: ['Kubernetes', 'Docker', 'AWS/GCP', 'Terraform', 'CI/CD Pipelines', 'Linux'],
        salary: '₹9L - ₹20L per annum',
        demand: 'High',
        targetCompanies: ['InMobi', 'Jio', 'Oracle', 'Red Hat', 'Salesforce']
    },
    {
        id: 'data-engineer',
        title: 'Big Data & Pipeline Engineer',
        category: 'Data & AI',
        targetVector: {
            practicalSkill: 0.80,
            academicStrength: 0.75,
            traitFit: 0.70,
            projectEvidence: 0.75
        },
        description: 'Build enterprise-scale data pipelines, streaming architectures, and analytics warehouses for structured/unstructured telemetry.',
        requiredSkills: ['Python', 'SQL', 'Apache Spark', 'Airflow', 'Kafka', 'Snowflake'],
        salary: '₹9L - ₹21L per annum',
        demand: 'High',
        targetCompanies: ['Walmart Global Tech', 'American Express', 'Target', 'Tiger Analytics']
    },
    {
        id: 'frontend-engineer',
        title: 'Frontend & UI Systems Engineer',
        category: 'Software Engineering',
        targetVector: {
            practicalSkill: 0.70,
            academicStrength: 0.60,
            traitFit: 0.75,
            projectEvidence: 0.85
        },
        description: 'Craft responsive, high-performance web applications, complex state systems, and intuitive micro-interactions.',
        requiredSkills: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'State Management', 'Web Performance'],
        salary: '₹7L - ₹16L per annum',
        demand: 'High',
        targetCompanies: ['Urban Company', 'Licious', 'MakeMyTrip', 'Zepto']
    },
    {
        id: 'cybersecurity-analyst',
        title: 'Cybersecurity & Application Security Analyst',
        category: 'Security',
        targetVector: {
            practicalSkill: 0.75,
            academicStrength: 0.80,
            traitFit: 0.80,
            projectEvidence: 0.70
        },
        description: 'Audit systems for vulnerabilities, implement secure authentication/authorization, and prevent threat vectors.',
        requiredSkills: ['Network Security', 'OWASP Top 10', 'Penetration Testing', 'Cryptography', 'Linux'],
        salary: '₹8L - ₹19L per annum',
        demand: 'High',
        targetCompanies: ['Quick Heal', 'Palo Alto Networks', 'CrowdStrike', 'TCS Cyber']
    },
    {
        id: 'product-engineer',
        title: 'Product Engineer / Technical Founder',
        category: 'Product & Engineering',
        targetVector: {
            practicalSkill: 0.75,
            academicStrength: 0.65,
            traitFit: 0.90,
            projectEvidence: 0.90
        },
        description: 'Bridge customer product discovery with rapid full-stack software prototyping, iterative MVPs, and metrics analysis.',
        requiredSkills: ['Full Stack Dev', 'User Experience', 'Analytics', 'System Architecture', 'Product Strategy'],
        salary: '₹10L - ₹24L per annum',
        demand: 'High',
        targetCompanies: ['Zerodha', 'Postman', 'Hasura', 'BrowserStack', 'Y Combinator Startups']
    }
];

export default CAREER_PROFILES;
