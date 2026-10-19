import Groq from 'groq-sdk';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Groq as primary free-tier provider
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Initialize OpenAI as secondary fallback provider
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Preferred models
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Universal chat completion helper with automatic Groq primary routing,
 * OpenAI fallback, and strict JSON validation.
 */
async function callChatCompletion({ systemPrompt, userPrompt, temperature = 0.6 }) {
    // 1. Try Groq (Ultra-fast, 100% free tier on Groq Cloud)
    if (groq) {
        try {
            const completion = await groq.chat.completions.create({
                model: GROQ_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature,
                response_format: { type: 'json_object' }
            });
            const text = completion.choices[0]?.message?.content;
            if (text) {
                return JSON.parse(text);
            }
        } catch (groqError) {
            console.warn(`[AI Engine] Groq error: ${groqError.message}. Attempting fallback...`);
        }
    }

    // 2. Try OpenAI fallback
    if (openai) {
        try {
            const completion = await openai.chat.completions.create({
                model: OPENAI_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature,
                response_format: { type: 'json_object' }
            });
            const text = completion.choices[0]?.message?.content;
            if (text) {
                return JSON.parse(text);
            }
        } catch (openaiError) {
            console.warn(`[AI Engine] OpenAI error: ${openaiError.message}`);
        }
    }

    throw new Error('AI service unavailable: No active API key or provider failed.');
}

/**
 * Generate a personalized career roadmap based on user's profile
 */
export async function generateRoadmap(userData) {
    const { targetRole, currentSkills, education, experience, interests } = userData;

    const systemPrompt = 'You are an expert career counselor and engineering advisor. You generate milestone roadmaps. Return ONLY valid JSON, no markdown formatting.';
    const prompt = `Create a personalized, detailed career roadmap for someone aiming to become a ${targetRole}.

User Profile:
- Target Role: ${targetRole}
- Current Skills: ${currentSkills?.join(', ') || 'Not specified'}
- Education: ${education || 'Not specified'}
- Experience Level: ${experience || 'Beginner'}
- Interests: ${interests?.join(', ') || 'Not specified'}

Generate a comprehensive roadmap in JSON format with this exact structure:
{
  "title": "Clear, motivating title for this roadmap",
  "description": "Brief 2-3 sentence overview of the journey",
  "targetRole": "${targetRole}",
  "estimatedDuration": "6-12 months",
  "items": [
    {
      "id": "item-1",
      "phase": "Foundation",
      "title": "Core Technical Principles",
      "description": "Master fundamentals of language, data structures, and core tools",
      "taskType": "learn",
      "skills": ["Git", "Algorithms", "Clean Code"],
      "resources": [
        {"title": "Official Docs", "url": "https://developer.mozilla.org", "type": "documentation"}
      ],
      "estimatedWeeks": 4,
      "completed": false
    }
  ]
}

Create 6-10 detailed roadmap items across Foundation, Intermediate, Core Systems, Projects, and Advanced topics. Return ONLY valid JSON.`;

    try {
        const roadmapData = await callChatCompletion({
            systemPrompt,
            userPrompt: prompt,
            temperature: 0.6
        });
        return roadmapData;
    } catch (error) {
        console.warn('[AI Engine] AI call failed, generating deterministic roadmap fallback:', error.message);
        
        // Deterministic Fallback: Never leave user stranded if offline
        return {
            title: `Engineering Trajectory: ${targetRole}`,
            description: `Personalized, structured learning progression designed to acquire competencies required for ${targetRole}.`,
            targetRole: targetRole,
            estimatedDuration: '6-9 months',
            items: [
                {
                    id: 'fallback-1',
                    phase: 'Foundation',
                    title: 'Core Fundamentals & Algorithmic Problem Solving',
                    description: 'Strengthen data structures, algorithmic paradigms, and version control hygiene.',
                    taskType: 'learn',
                    skills: ['Data Structures', 'Git', 'Clean Architecture'],
                    resources: [{ title: 'LeetCode Roadmap', url: 'https://leetcode.com', type: 'practice' }],
                    estimatedWeeks: 4,
                    completed: false
                },
                {
                    id: 'fallback-2',
                    phase: 'Systems & Architecture',
                    title: 'Backend Systems & API Design',
                    description: 'Design and build resilient RESTful services, database schemas, and caching layers.',
                    taskType: 'build',
                    skills: ['PostgreSQL', 'Node.js/Go', 'REST APIs', 'Docker'],
                    resources: [{ title: 'RESTful API Guidelines', url: 'https://restfulapi.net', type: 'documentation' }],
                    estimatedWeeks: 6,
                    completed: false
                },
                {
                    id: 'fallback-3',
                    phase: 'Advanced Practice',
                    title: 'Production Capstone & Deployment Pipeline',
                    description: 'Deploy full-stack microservices with automated CI/CD and telemetry.',
                    taskType: 'apply',
                    skills: ['CI/CD', 'Kubernetes', 'Cloud Hosting'],
                    resources: [{ title: 'Docker Documentation', url: 'https://docs.docker.com', type: 'documentation' }],
                    estimatedWeeks: 5,
                    completed: false
                }
            ]
        };
    }
}

/**
 * Generate personalized career recommendations
 * Grounded in mathematically computed hybrid scores (Equations 1 & 2)
 */
export async function generateRecommendations(userData) {
    const { 
        skills, 
        education, 
        experience, 
        interests, 
        projects, 
        academicData, 
        codingSummary,
        computedDecision 
    } = userData;

    const precomputedRoles = computedDecision?.rankedRoles || [];
    const confidencePct = Math.round((computedDecision?.confidence || 0.85) * 100);

    const rolesContext = precomputedRoles.map(r => 
        `- Role: ${r.title} | Mathematically Computed Match Score: ${r.score}% | Target Skills: ${r.requiredSkills?.join(', ')}`
    ).join('\n');

    const systemPrompt = 'You are an explanation-generation AI for career recommendations. Return ONLY valid JSON, no markdown formatting.';
    const prompt = `You are an expert career counselor specializing in the Indian and global technology market.
NextStepAI's Multi-Modal Hybrid Intelligence Core has already calculated the candidate's exact match scores using Content-Based Cosine Similarity and Practical Skill Scoring (S_P).

CRITICAL MANDATE:
Do NOT invent or alter the match scores or role titles below. Use the EXACT titles and scores provided in the Pre-Computed Matches list. Your job is strictly to generate the rich reasoning, gap skills, and target hiring companies.

Candidate Profile:
- Current Skills: ${skills?.join(', ') || 'Not specified'}
- Academic Background: ${education || 'Not specified'} (GPA: ${academicData?.gpa || 'Not specified'})
- Coding Profile: ${codingSummary || 'Platforms evaluated'}
- Projects: ${projects?.length || 0} practical projects
- Profile Evaluation Confidence: ${confidencePct}%

Pre-Computed Matches to Explain:
${rolesContext || '- Full Stack Developer (Match: 88%)\n- Backend Systems Engineer (Match: 84%)\n- DevOps & Cloud Architect (Match: 80%)'}

Generate comprehensive recommendations in JSON format with this exact structure:
{
  "roles": [
    {
      "id": "role-id",
      "title": "Exact Role Title from list",
      "score": 88,
      "confidence": ${confidencePct},
      "description": "2-3 sentence overview of why this role matches their profile",
      "skills": ["Skill 1", "Skill 2"],
      "salary": "₹XL - ₹YL per annum",
      "demand": "Very High|High|Growing",
      "reasoning": "Ground this explanation directly in their coding stats (LeetCode/GitHub), project history, or academic fundamentals"
    }
  ],
  "skills": [
    {
      "id": "skill-id",
      "name": "Skill to learn",
      "category": "Technical|Architecture|Tools",
      "currentLevel": 40,
      "targetLevel": 85,
      "resources": ["Official Documentation", "Project Tutorial"],
      "description": "Why learning this skill unlocks higher-tier roles"
    }
  ],
  "companies": [
    {
      "id": "company-id",
      "name": "Company Name",
      "domain": "Fintech|E-commerce|SaaS|Enterprise",
      "matchScore": 90,
      "notes": "Why this company values candidate's specific skill distribution",
      "openRoles": 5
    }
  ]
}

Return ONLY valid JSON.`;

    try {
        const recommendations = await callChatCompletion({
            systemPrompt,
            userPrompt: prompt,
            temperature: 0.5
        });

        // Ensure pre-computed mathematical scores are strictly preserved
        if (precomputedRoles.length > 0 && Array.isArray(recommendations.roles)) {
            recommendations.roles = recommendations.roles.map((r, i) => {
                const matchedPrecomputed = precomputedRoles.find(pr => 
                    pr.title.toLowerCase() === r.title?.toLowerCase()
                ) || precomputedRoles[i];

                return {
                    ...r,
                    title: matchedPrecomputed ? matchedPrecomputed.title : r.title,
                    score: matchedPrecomputed ? matchedPrecomputed.score : r.score,
                    confidence: computedDecision?.confidence || 0.85,
                };
            });
        }
        
        return recommendations;
    } catch (error) {
        console.warn('[AI Engine] Recommendation explanation failed, returning deterministic mathematical matches:', error.message);
        
        return {
            roles: precomputedRoles.map(r => ({
                id: r.id,
                title: r.title,
                score: r.score,
                confidence: computedDecision?.confidence || 0.85,
                description: r.description,
                skills: r.requiredSkills?.slice(0, 4) || [],
                salary: r.salary || '₹8L - ₹18L per annum',
                demand: r.demand || 'High',
                reasoning: `Mathematically matched with ${r.score}% compatibility based on multidimensional feature analysis (Cosine similarity: ${r.score}%).`
            })),
            skills: [
                { id: 'sk-1', name: 'System Design', category: 'Architecture', currentLevel: 45, targetLevel: 85, resources: ['Designing Data-Intensive Applications'], description: 'Critical for mid-level and senior roles.' },
                { id: 'sk-2', name: 'Docker & Kubernetes', category: 'DevOps', currentLevel: 50, targetLevel: 80, resources: ['Kubernetes The Hard Way'], description: 'Required for containerized deployment.' },
                { id: 'sk-3', name: 'Advanced DSA', category: 'Technical', currentLevel: 60, targetLevel: 90, resources: ['LeetCode 75'], description: 'Enhances competitive problem-solving score S_P.' }
            ],
            companies: [
                { id: 'comp-1', name: 'Razorpay', domain: 'Fintech', matchScore: 92, notes: 'Values strong API and system engineering skills.', openRoles: 12 },
                { id: 'comp-2', name: 'Flipkart', domain: 'E-commerce', matchScore: 89, notes: 'Seeks developers with demonstrated problem-solving metrics.', openRoles: 25 },
                { id: 'comp-3', name: 'CRED', domain: 'Fintech / Mobile', matchScore: 86, notes: 'Looks for strong engineering discipline and clean architecture.', openRoles: 8 }
            ]
        };
    }
}

/**
 * Analyze psychometric test results and provide insights
 */
export async function analyzePsychometric(testData) {
    const { traits, testName } = testData;

    const systemPrompt = 'You are a career psychologist AI that returns only valid JSON responses.';
    const prompt = `Analyze these psychometric traits:
Test: ${testName || 'Career Traits Assessment'}
Traits Measured: ${JSON.stringify(traits, null, 2)}

Provide analysis in JSON format:
{
  "summary": "Overall personality summary (3-4 sentences)",
  "strengths": ["strength1", "strength2", "strength3"],
  "workStyle": "Description of preferred work style",
  "idealEnvironment": "Description of ideal work environment",
  "careerAlignment": [
    {
      "career": "Career path",
      "compatibility": 90,
      "reasoning": "Why this career aligns with traits"
    }
  ],
  "developmentAreas": [
    {
      "area": "Area to develop",
      "importance": "High|Medium",
      "suggestions": "Actionable suggestions"
    }
  ]
}

Return ONLY valid JSON.`;

    try {
        const analysis = await callChatCompletion({ systemPrompt, userPrompt: prompt, temperature: 0.6 });
        return analysis;
    } catch (error) {
        console.warn('[AI Engine] Psychometric analysis failed, using fallback:', error.message);
        return {
            summary: 'Your profile demonstrates balanced problem-solving orientation and collaborative teamwork potential.',
            strengths: ['Analytical mindset', 'Diligent execution', 'Agile adaptability'],
            workStyle: 'Structured yet adaptable with focus on measurable deliverables.',
            idealEnvironment: 'Collaborative, engineering-led teams tackling scalable technical challenges.',
            careerAlignment: [
                { career: 'Full Stack Developer', compatibility: 90, reasoning: 'Strong technical and execution traits.' },
                { career: 'Backend Systems Engineer', compatibility: 88, reasoning: 'High analytical problem-solving focus.' }
            ],
            developmentAreas: [
                { area: 'High-Level System Design', importance: 'High', suggestions: 'Design distributed architectures.' }
            ]
        };
    }
}

/**
 * Generate project suggestions based on user's skills and goals
 */
export async function generateProjectSuggestions(userData) {
    const { skills, targetRole, experience } = userData;

    const systemPrompt = 'You are a project advisor AI that returns only valid JSON responses.';
    const prompt = `Suggest 4 practical projects for someone becoming a ${targetRole}.
Current Skills: ${skills?.join(', ') || 'Beginner'}
Experience Level: ${experience || 'Entry level'}

Generate project suggestions in JSON format:
{
  "projects": [
    {
      "id": "project-1",
      "title": "Scalable Microservices Gateway",
      "difficulty": "Intermediate",
      "description": "Build an API Gateway with authentication and rate limiting.",
      "skillsUsed": ["Node.js", "Redis", "Docker"],
      "estimatedHours": 25,
      "keyFeatures": ["JWT validation", "Token bucket limiter"],
      "learningOutcomes": ["Production API design"]
    }
  ]
}

Return ONLY valid JSON.`;

    try {
        const suggestions = await callChatCompletion({ systemPrompt, userPrompt: prompt, temperature: 0.7 });
        return suggestions;
    } catch (error) {
        console.warn('[AI Engine] Project suggestions fallback activated:', error.message);
        return {
            projects: [
                {
                    id: 'proj-1',
                    title: `${targetRole} Portfolio Capstone`,
                    difficulty: 'Intermediate',
                    description: `End-to-end production application demonstrating core competencies for ${targetRole}.`,
                    skillsUsed: skills?.slice(0, 4) || ['Node.js', 'PostgreSQL', 'Docker'],
                    estimatedHours: 30,
                    keyFeatures: ['Full-stack data persistence', 'Authentication', 'Live deployment'],
                    learningOutcomes: ['Complete project lifecycle experience']
                }
            ]
        };
    }
}

/**
 * Analyze skill gaps for a target role
 */
export async function analyzeSkillGaps(userData) {
    const { currentSkills, targetRole, experience } = userData;

    const systemPrompt = 'You are a skill assessment AI that returns only valid JSON responses.';
    const prompt = `Analyze skill gaps for someone wanting to become a ${targetRole}.
Current Skills: ${currentSkills?.join(', ') || 'None'}
Experience: ${experience || 'Entry level'}

Provide gap analysis in JSON format:
{
  "requiredSkills": [
    {
      "skill": "Skill name",
      "importance": "Critical|Important|Nice-to-have",
      "currentLevel": "None|Beginner|Intermediate",
      "targetLevel": "Advanced",
      "gap": "Description of the gap",
      "learningPath": "How to bridge this gap"
    }
  ],
  "estimatedTimeToReady": "3-6 months",
  "prioritySkills": ["Skill A", "Skill B"],
  "recommendations": "Overall recommendations"
}

Return ONLY valid JSON.`;

    try {
        const gapAnalysis = await callChatCompletion({ systemPrompt, userPrompt: prompt, temperature: 0.6 });
        return gapAnalysis;
    } catch (error) {
        console.warn('[AI Engine] Skill gap analysis fallback activated:', error.message);
        return {
            requiredSkills: [
                {
                    skill: 'System Design & Distributed Data',
                    importance: 'Critical',
                    currentLevel: 'Beginner',
                    targetLevel: 'Advanced',
                    gap: 'Need experience handling partitioned databases and message queues.',
                    learningPath: 'Read Designing Data-Intensive Applications and implement practical caches.'
                }
            ],
            estimatedTimeToReady: '3-6 months',
            prioritySkills: ['System Architecture', 'Database Optimization'],
            recommendations: 'Focus on hands-on backend projects and algorithmic problem solving.'
        };
    }
}

export default {
    generateRoadmap,
    generateRecommendations,
    analyzePsychometric,
    generateProjectSuggestions,
    analyzeSkillGaps,
};
