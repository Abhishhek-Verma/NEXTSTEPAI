import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Use GPT-4o-mini for cost-effective, fast responses
const MODEL = 'gpt-4o-mini';

/**
 * Generate a personalized career roadmap based on user's profile
 */
export async function generateRoadmap(userData) {
    try {
        const { targetRole, currentSkills, education, experience, interests } = userData;

        const prompt = `You are an expert career advisor. Create a personalized, detailed career roadmap for someone aiming to become a ${targetRole}.

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
  "estimatedDuration": "Time estimate (e.g., '6-12 months')",
  "items": [
    {
      "id": "unique-id-1",
      "phase": "Phase name (e.g., Foundation, Intermediate, Advanced)",
      "title": "Clear milestone title",
      "description": "Detailed explanation of what to learn/do",
      "skills": ["skill1", "skill2"],
      "resources": [
        {"title": "Resource name", "url": "url", "type": "course|documentation|project"}
      ],
      "estimatedWeeks": 4,
      "completed": false
    }
  ]
}

Create 6-10 detailed roadmap items covering fundamentals, core skills, projects, and advanced topics. Be specific and actionable. Return ONLY valid JSON, no markdown formatting.`;

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a career advisor AI that returns only valid JSON responses.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0].message.content;
        const roadmapData = JSON.parse(responseText);
        
        return roadmapData;
    } catch (error) {
        console.error('Error generating roadmap with OpenAI:', error);
        throw new Error('Failed to generate roadmap. Please try again.');
    }
}

/**
 * Generate personalized career recommendations
 */
export async function generateRecommendations(userData) {
    try {
        const { skills, education, experience, interests, projects, academicData } = userData;

        const prompt = `You are an expert career counselor specializing in the Indian tech job market. Analyze this user's profile and provide personalized career recommendations.

User Profile:
- Skills: ${skills?.join(', ') || 'Not specified'}
- Education: ${education || 'Not specified'}
- Experience: ${experience || 'Entry level'}
- Interests: ${interests?.join(', ') || 'Not specified'}
- Projects: ${projects?.length || 0} projects completed
- Academic Performance: ${academicData?.cgpa ? `CGPA ${academicData.cgpa}` : 'Not specified'}

Generate comprehensive recommendations in JSON format with this exact structure:
{
  "roles": [
    {
      "id": "role-id",
      "title": "Job Role Title",
      "score": 85,
      "description": "Why this role suits the user",
      "skills": ["skill1", "skill2"],
      "salary": "₹XL - ₹YL per annum",
      "demand": "High|Medium|Very High",
      "reasoning": "Detailed explanation of why this role is recommended"
    }
  ],
  "skills": [
    {
      "id": "skill-id",
      "name": "Skill Name",
      "category": "Technical|Soft|Domain",
      "currentLevel": 50,
      "targetLevel": 85,
      "resources": ["Resource 1", "Resource 2"],
      "description": "Why learn this skill"
    }
  ],
  "companies": [
    {
      "id": "company-id",
      "name": "Company Name",
      "logo": "emoji icon",
      "domain": "Company domain",
      "matchScore": 90,
      "notes": "Why this company matches user profile",
      "openRoles": 5
    }
  ]
}

IMPORTANT RULES:
- All salaries MUST be in Indian Rupees (INR) using ₹ symbol and "L" for lakhs (e.g., "₹6L - ₹15L" for entry level, "₹12L - ₹25L" for mid-level)
- Use realistic Indian market salary ranges. Entry-level: ₹4L-₹12L, Mid-level: ₹10L-₹25L, Senior: ₹20L-₹45L
- Include Indian companies like TCS, Infosys, Wipro, Flipkart, Razorpay, Zerodha, PhonePe, CRED, along with MNCs
- Provide 4-6 role recommendations, 6-8 skill recommendations, and 5-7 company suggestions
- Be specific and realistic for the Indian job market
- Return ONLY valid JSON, no markdown formatting.`;

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a career counselor AI that returns only valid JSON responses.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0].message.content;
        const recommendations = JSON.parse(responseText);
        
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations with OpenAI:', error);
        throw new Error('Failed to generate recommendations. Please try again.');
    }
}

/**
 * Analyze psychometric test results and provide insights
 */
export async function analyzePsychometric(testData) {
    try {
        const { traits, responses, testName } = testData;

        const prompt = `You are a career psychologist. Analyze these psychometric test results and provide detailed insights.

Test: ${testName}
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

Provide 4-6 career alignments and 3-5 development areas. Return ONLY valid JSON, no markdown formatting.`;

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a career psychologist AI that returns only valid JSON responses.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0].message.content;
        const analysis = JSON.parse(responseText);
        
        return analysis;
    } catch (error) {
        console.error('Error analyzing psychometric data with OpenAI:', error);
        throw new Error('Failed to analyze psychometric results. Please try again.');
    }
}

/**
 * Generate project suggestions based on user's skills and goals
 */
export async function generateProjectSuggestions(userData) {
    try {
        const { skills, targetRole, experience } = userData;

        const prompt = `Suggest 5-7 practical projects for someone learning to become a ${targetRole}.

Current Skills: ${skills?.join(', ') || 'Beginner'}
Experience Level: ${experience || 'Entry level'}

Generate project suggestions in JSON format:
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project Name",
      "difficulty": "Beginner|Intermediate|Advanced",
      "description": "What the project involves",
      "skillsUsed": ["skill1", "skill2"],
      "estimatedHours": 20,
      "keyFeatures": ["feature1", "feature2"],
      "learningOutcomes": ["outcome1", "outcome2"]
    }
  ]
}

Return ONLY valid JSON, no markdown formatting.`;

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a project advisor AI that returns only valid JSON responses.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0].message.content;
        const suggestions = JSON.parse(responseText);
        
        return suggestions;
    } catch (error) {
        console.error('Error generating project suggestions with OpenAI:', error);
        throw new Error('Failed to generate project suggestions. Please try again.');
    }
}

/**
 * Analyze skill gaps for a target role
 */
export async function analyzeSkillGaps(userData) {
    try {
        const { currentSkills, targetRole, experience } = userData;

        const prompt = `Analyze skill gaps for someone wanting to become a ${targetRole}.

Current Skills: ${currentSkills?.join(', ') || 'None'}
Experience: ${experience || 'Entry level'}

Provide gap analysis in JSON format:
{
  "requiredSkills": [
    {
      "skill": "Skill name",
      "importance": "Critical|Important|Nice-to-have",
      "currentLevel": "None|Beginner|Intermediate|Advanced",
      "targetLevel": "Intermediate|Advanced|Expert",
      "gap": "Description of the gap",
      "learningPath": "How to bridge this gap"
    }
  ],
  "estimatedTimeToReady": "Time estimate",
  "prioritySkills": ["skill1", "skill2", "skill3"],
  "recommendations": "Overall recommendations"
}

Return ONLY valid JSON, no markdown formatting.`;

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a skill assessment AI that returns only valid JSON responses.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0].message.content;
        const gapAnalysis = JSON.parse(responseText);
        
        return gapAnalysis;
    } catch (error) {
        console.error('Error analyzing skill gaps with OpenAI:', error);
        throw new Error('Failed to analyze skill gaps. Please try again.');
    }
}

export default {
    generateRoadmap,
    generateRecommendations,
    analyzePsychometric,
    generateProjectSuggestions,
    analyzeSkillGaps,
};
