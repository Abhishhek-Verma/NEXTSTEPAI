/**
 * NextStepAI — Deterministic Mathematical & Hybrid Fusion Engine
 * Implements the mathematical formulations from the research paper:
 * "NextStepAI: A Multi-Modal Hybrid Intelligence Framework for Holistic Career Trajectory Planning"
 * (Abhishek Verma et al., KIET Group of Institutions)
 *
 * Core components:
 * 1. Module A: Academic Score Normalization (V_A)
 * 2. Module B: Practical Skill Score (S_P) - Equation (1)
 * 3. Module C: Psychometric Vector Extraction (V_Psy = [O, C, E, A, N])
 * 4. Module D: Content-Based Cosine Similarity - Equation (2)
 * 5. Dynamic Hybridization & Cold-Start Lambda - Equation (3)
 * 6. Evidence-Based Confidence Estimation
 */

export const CONSTANTS = {
    // Reference rating ceilings for competitive platforms
    REFERENCE_CEILINGS: {
        leetcode: 2400,
        codeforces: 2400,
        codechef: 2200,
    },
    // Weights for problem difficulty in Equation (1)
    DIFFICULTY_WEIGHTS: {
        easy: 1.0,
        medium: 2.0,
        hard: 4.0,
    },
    // Normalization ceiling for cumulative solved problem log term (approx max across tiers)
    DIFFICULTY_NORMALIZATION_BASE: 35.0,
    // Normalization ceiling for GitHub contribution score
    GITHUB_SCORE_CEILING: 1000,
    // Equation (1) hyperparameters: alpha (rating), beta (solved difficulty), gamma (github)
    SP_WEIGHTS: {
        alpha: 0.40,
        beta: 0.40,
        gamma: 0.20,
    },
    // Academic scale defaults
    ACADEMIC_SCALES: {
        TEN_POINT: 10.0,
        FOUR_POINT: 4.0,
    },
    // Confidence floor to avoid presenting 0 confidence if profile has partial data
    MIN_CONFIDENCE: 0.30,
};

/**
 * Utility to clamp a numeric value within [min, max]
 */
export function clamp(val, min = 0, max = 1) {
    if (typeof val !== 'number' || isNaN(val)) return min;
    return Math.max(min, Math.min(max, val));
}

/**
 * Module A: Academic Score Normalization (V_A)
 * Maps GPA/CGPA to normalized [0, 1] scale.
 */
export function normalizeAcademicScore(gpa, explicitScale = null) {
    if (gpa === null || gpa === undefined || isNaN(gpa) || gpa <= 0) {
        return null;
    }
    const numericGpa = parseFloat(gpa);
    let scale = explicitScale;
    if (!scale) {
        // Automatic detection: if GPA <= 4.0, assume 4-point scale, else 10-point scale
        scale = numericGpa <= 4.0 ? CONSTANTS.ACADEMIC_SCALES.FOUR_POINT : CONSTANTS.ACADEMIC_SCALES.TEN_POINT;
    }
    return clamp(numericGpa / scale, 0, 1);
}

/**
 * Module B: Practical Skill Score (S_P) - Research Paper Equation (1):
 * S_P = alpha * (R_current / R_max_goal) + beta * sum(w_d * log(1 + N_d)) + gamma * G_act
 *
 * @param {Object} codingProfiles - Array or dictionary of coding profiles (github, leetcode, codeforces, codechef)
 * @returns {number|null} S_P normalized to [0, 1], or null if no coding platforms connected
 */
export function computePracticalSkillScore(codingProfiles) {
    if (!codingProfiles) return null;

    // Normalize input whether passed as array or dictionary
    const platforms = Array.isArray(codingProfiles) 
        ? codingProfiles.reduce((acc, p) => { acc[p.platform] = p.metrics || {}; return acc; }, {})
        : codingProfiles;

    const connectedPlatforms = Object.keys(platforms).filter(k => !!platforms[k]);
    if (connectedPlatforms.length === 0) return null;

    // 1. Rating Term: average rating ratio across connected competitive platforms
    const ratingRatios = [];
    
    if (platforms.leetcode?.ranking || platforms.leetcode?.contestRating) {
        const rating = platforms.leetcode.contestRating || platforms.leetcode.rating || 0;
        if (rating > 0) {
            ratingRatios.push(clamp(rating / CONSTANTS.REFERENCE_CEILINGS.leetcode, 0, 1));
        }
    }
    if (platforms.codeforces?.rating) {
        const rating = Number(platforms.codeforces.rating) || 0;
        if (rating > 0) {
            ratingRatios.push(clamp(rating / CONSTANTS.REFERENCE_CEILINGS.codeforces, 0, 1));
        }
    }
    if (platforms.codechef?.rating) {
        const rating = Number(platforms.codechef.rating) || 0;
        if (rating > 0) {
            ratingRatios.push(clamp(rating / CONSTANTS.REFERENCE_CEILINGS.codechef, 0, 1));
        }
    }

    const ratingTerm = ratingRatios.length > 0 
        ? ratingRatios.reduce((sum, r) => sum + r, 0) / ratingRatios.length 
        : 0;

    // 2. Difficulty Term: sum(w_d * log(1 + N_d))
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    if (platforms.leetcode) {
        easySolved += Number(platforms.leetcode.easySolved) || 0;
        mediumSolved += Number(platforms.leetcode.mediumSolved) || 0;
        hardSolved += Number(platforms.leetcode.hardSolved) || 0;
    }
    if (platforms.codechef?.problemsSolved) {
        // Approximate CodeChef solved distribution if available
        const total = Number(platforms.codechef.problemsSolved) || 0;
        easySolved += Math.floor(total * 0.5);
        mediumSolved += Math.floor(total * 0.35);
        hardSolved += Math.floor(total * 0.15);
    }

    const rawDifficultyScore = 
        (CONSTANTS.DIFFICULTY_WEIGHTS.easy * Math.log(1 + easySolved)) +
        (CONSTANTS.DIFFICULTY_WEIGHTS.medium * Math.log(1 + mediumSolved)) +
        (CONSTANTS.DIFFICULTY_WEIGHTS.hard * Math.log(1 + hardSolved));

    const difficultyTerm = clamp(rawDifficultyScore / CONSTANTS.DIFFICULTY_NORMALIZATION_BASE, 0, 1);

    // 3. GitHub Activity Term: G_act
    let githubTerm = 0;
    if (platforms.github) {
        const gh = platforms.github;
        const contribScore = Number(gh.contributionScore) || 
            ((Number(gh.publicRepos) || 0) * 15 + 
             (Number(gh.totalStars) || 0) * 25 + 
             (Number(gh.totalForks) || 0) * 15);
        githubTerm = clamp(contribScore / CONSTANTS.GITHUB_SCORE_CEILING, 0, 1);
    }

    // Dynamic hyperparameter reweighting if certain components have no data
    let activeAlpha = ratingRatios.length > 0 ? CONSTANTS.SP_WEIGHTS.alpha : 0;
    let activeBeta = (easySolved + mediumSolved + hardSolved > 0) ? CONSTANTS.SP_WEIGHTS.beta : 0;
    let activeGamma = platforms.github ? CONSTANTS.SP_WEIGHTS.gamma : 0;
    const totalActiveWeight = activeAlpha + activeBeta + activeGamma;

    if (totalActiveWeight === 0) return 0;

    const normalizedSp = (
        (activeAlpha * ratingTerm) + 
        (activeBeta * difficultyTerm) + 
        (activeGamma * githubTerm)
    ) / totalActiveWeight;

    return clamp(normalizedSp, 0, 1);
}

/**
 * Module C: Psychometric Vector Extraction (V_Psy = [O, C, E, A, N])
 * Maps workplace traits to normalized Big Five OCEAN traits in [0, 1].
 */
export function extractPsychometricVector(traits) {
    if (!traits || Object.keys(traits).length === 0) return null;

    // Helper to extract average trait score normalized to [0, 1] (input is on 1-5 scale)
    const getAvg = (keys) => {
        const found = keys.map(k => traits[k]).filter(v => typeof v === 'number' && !isNaN(v));
        if (found.length === 0) return 0.5; // Neutral prior
        return clamp((found.reduce((a, b) => a + b, 0) / found.length) / 5.0, 0, 1);
    };

    // OCEAN Dimensions mapping:
    const O = getAvg(['openness', 'innovation', 'creativity', 'learningAgility']);
    const C = getAvg(['conscientiousness', 'detailOriented', 'timeManagement', 'qualityOrientation']);
    const E = getAvg(['extraversion', 'communication', 'leadership', 'influence']);
    const A = getAvg(['agreeableness', 'teamwork', 'conflictResolution', 'emotionalIntelligence']);
    // Emotional stability (inverted Neuroticism)
    const N = clamp(1.0 - getAvg(['resilience', 'adaptability', 'decisionMaking']), 0, 1);

    return {
        vector: [O, C, E, A, N],
        compositeFit: clamp((O * 0.25 + C * 0.35 + E * 0.15 + A * 0.15 + (1 - N) * 0.10), 0, 1),
        ocean: { openness: O, conscientiousness: C, extraversion: E, agreeableness: A, neuroticism: N }
    };
}

/**
 * Project Evidence metric: quantifies practical engineering evidence
 */
export function computeProjectEvidence(projects) {
    if (!projects || !Array.isArray(projects) || projects.length === 0) return null;

    const count = projects.length;
    const completedCount = projects.filter(p => p.status === 'completed').length;
    const hasLiveUrl = projects.filter(p => !!p.liveUrl).length;
    const hasRepoUrl = projects.filter(p => !!p.repoUrl).length;

    const rawScore = (count * 0.2) + (completedCount * 0.3) + (hasLiveUrl * 0.25) + (hasRepoUrl * 0.25);
    return clamp(rawScore / 3.0, 0, 1);
}

/**
 * Builds the complete 4D User Feature Vector U = [V_A, S_P, V_Psy, V_Proj]
 * Returns { vector, activeDimensions, droppedCount }
 */
export function buildUserVector({ gpa, codingProfiles, traits, projects }) {
    const vA = normalizeAcademicScore(gpa);
    const sP = computePracticalSkillScore(codingProfiles);
    const psy = extractPsychometricVector(traits);
    const vPsy = psy ? psy.compositeFit : null;
    const vProj = computeProjectEvidence(projects);

    const dims = [
        { name: 'academicStrength', value: vA },
        { name: 'practicalSkill', value: sP },
        { name: 'traitFit', value: vPsy },
        { name: 'projectEvidence', value: vProj }
    ];

    const activeDimensions = dims.filter(d => d.value !== null);
    const droppedCount = dims.length - activeDimensions.length;

    return {
        raw: { academicStrength: vA, practicalSkill: sP, traitFit: vPsy, projectEvidence: vProj },
        activeDimensions,
        droppedCount,
        totalDimensions: dims.length,
        ocean: psy ? psy.ocean : null
    };
}

/**
 * Module D: Content-Based Filtering (CBF) - Research Paper Equation (2)
 * Cosine Similarity:
 * Score_CBF(U, C_j) = (U . C_j) / (||U|| * ||C_j||)
 *
 * Missing dimensions use Pairwise Deletion: if a dimension is missing in the user vector,
 * it is dropped from BOTH vectors before calculating cosine similarity.
 */
export function computeCosineSimilarity(userVectorObj, careerTargetVector) {
    const userValues = [];
    const careerValues = [];

    // Compare over active dimensions only
    for (const dim of userVectorObj.activeDimensions) {
        const key = dim.name;
        if (typeof careerTargetVector[key] === 'number') {
            userValues.push(dim.value);
            careerValues.push(careerTargetVector[key]);
        }
    }

    if (userValues.length === 0) {
        return 0.5; // Baseline default if completely empty profile
    }

    // Dot product
    let dotProduct = 0;
    let normU = 0;
    let normC = 0;

    for (let i = 0; i < userValues.length; i++) {
        dotProduct += userValues[i] * careerValues[i];
        normU += userValues[i] * userValues[i];
        normC += careerValues[i] * careerValues[i];
    }

    normU = Math.sqrt(normU);
    normC = Math.sqrt(normC);

    if (normU === 0 || normC === 0) return 0;

    return clamp(dotProduct / (normU * normC), 0, 1);
}

/**
 * Dynamic Hybridization Parameter Lambda - Research Paper Equation (3):
 * Score_Final = lambda * Score_CBF + (1 - lambda) * Score_CF
 * Where lambda -> 1 for cold-start (new users) and decays as interaction history grows.
 */
export function computeDynamicLambda(interactionCount = 0) {
    if (interactionCount <= 0) return 1.0;
    // Decays smoothly from 1.0 down towards 0.5
    return clamp(0.5 + 0.5 * Math.exp(-0.25 * interactionCount), 0.5, 1.0);
}

/**
 * Evidence-based confidence estimation:
 * Distinguishes between "no data measured" vs "measured and found lacking".
 */
export function computeConfidence(droppedCount, totalDimensions = 4) {
    const rawConfidence = 1.0 - (droppedCount / totalDimensions);
    return clamp(Math.max(CONSTANTS.MIN_CONFIDENCE, rawConfidence), 0, 1);
}

/**
 * Predicts the candidate track inclination (Corporate Tech, R&D/Specialist, Product/Startup)
 * Matching the Inclination Classifier from Figure 1 of the paper.
 */
export function classifyCareerInclination(userVectorObj) {
    const raw = userVectorObj.raw;
    const academic = raw.academicStrength || 0.5;
    const practical = raw.practicalSkill || 0.5;
    const project = raw.projectEvidence || 0.5;
    const traits = userVectorObj.ocean || {};

    let inclination = 'Corporate Tech';
    let rationale = [];

    if (practical >= 0.70 && project >= 0.60) {
        inclination = 'Product Engineering & High-Growth Startups';
        rationale.push('High practical coding score (S_P) paired with verifiable project building.');
    } else if (academic >= 0.75 && (traits.openness || 0.5) >= 0.65) {
        inclination = 'R&D / Systems & Applied Research';
        rationale.push('Strong academic fundamentals combined with high openness to abstract problem solving.');
    } else {
        inclination = 'Enterprise Software & Technology Solutions';
        rationale.push('Balanced profile aligning with structured engineering and team collaboration.');
    }

    if (practical > 0.6) rationale.push('Demonstrated problem-solving abilities on competitive platforms.');
    if (academic > 0.6) rationale.push('Consistent academic performance.');
    if (project > 0.5) rationale.push('Hands-on repository commit and project delivery history.');

    return { inclination, rationale };
}
