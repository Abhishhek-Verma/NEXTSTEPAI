/**
 * Codeforces API Integration
 * Fetches user profile, ratings, and contest history
 * 
 * Improvements:
 * - Parallel API calls for better performance
 * - Optimized submission fetch (2500) to balance accuracy vs performance
 * - Request timeout protection (8 seconds)
 * - Automatic retry on failure
 * - User-Agent header to prevent blocking
 * - Efficient single-pass statistics calculation
 * - Database caching handled by calling route
 */

// Request headers to mimic browser and prevent blocking
const REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Request timeout (6 seconds)
const REQUEST_TIMEOUT = 6000;

/**
 * Fetch with timeout protection
 */
async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - Codeforces API is too slow');
        }
        throw error;
    }
}

/**
 * Retry wrapper for API calls
 */
async function fetchWithRetry(url, options = {}, retries = 1) {
    try {
        return await fetchWithTimeout(url, options);
    } catch (error) {
        if (retries > 0 && !error.message.includes('timeout')) {
            console.log(`Retrying Codeforces API call... (${retries} retries left)`);
            // Wait 1 second before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

export async function fetchCodeforcesProfile(handle) {
    try {
        const baseUrl = 'https://codeforces.com/api';
        
        // Fetch all data in parallel for better performance
        // Reduced submission count to 2500 for better performance
        const [userResponse, ratingResponse, submissionsResponse] = await Promise.all([
            fetchWithRetry(`${baseUrl}/user.info?handles=${handle}`, { headers: REQUEST_HEADERS }),
            fetchWithRetry(`${baseUrl}/user.rating?handle=${handle}`, { headers: REQUEST_HEADERS }),
            // Optimized: Fetch 2500 submissions (good balance of accuracy vs performance)
            // This covers most users while avoiding slow responses
            fetchWithRetry(`${baseUrl}/user.status?handle=${handle}&from=1&count=2500`, { headers: REQUEST_HEADERS })
        ]);

        // Parse user info
        if (!userResponse.ok) {
            throw new Error(`Codeforces API request failed: ${userResponse.statusText}`);
        }
        
        const userData = await userResponse.json();
        
        // Handle rate limiting and API errors
        if (userData.status === 'FAILED') {
            if (userData.comment?.includes('limit')) {
                throw new Error('Codeforces API rate limit exceeded. Please try again in a few seconds.');
            }
            throw new Error(userData.comment || 'Codeforces API request failed');
        }
        
        if (!userData.result || userData.result.length === 0) {
            throw new Error(`Codeforces user not found: ${handle}`);
        }
        
        const user = userData.result[0];
        
        // Parse rating history
        let ratingHistory = [];
        if (ratingResponse.ok) {
            const ratingData = await ratingResponse.json();
            if (ratingData.status === 'OK') {
                ratingHistory = ratingData.result;
            }
        }
        
        // Parse submissions
        let submissions = [];
        if (submissionsResponse.ok) {
            const submissionsData = await submissionsResponse.json();
            if (submissionsData.status === 'OK') {
                submissions = submissionsData.result;
            }
        }
        
        // Calculate problem-solving stats in a single pass (efficient)
        const solvedProblems = new Set();
        const problemRatings = [];
        let acceptedSubmissions = 0;
        
        submissions.forEach(sub => {
            if (sub.verdict === 'OK') {
                acceptedSubmissions++;
                if (sub.problem) {
                    const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                    solvedProblems.add(problemId);
                    if (sub.problem.rating) {
                        problemRatings.push(sub.problem.rating);
                    }
                }
            }
        });
        
        const avgProblemRating = problemRatings.length > 0
            ? Math.round(problemRatings.reduce((a, b) => a + b, 0) / problemRatings.length)
            : 0;
        
        // Get max rating from history
        const maxRating = ratingHistory.length > 0
            ? Math.max(...ratingHistory.map(r => r.newRating))
            : user.rating || 0;
        
        // Count contests
        const contestsParticipated = ratingHistory.length;
        
        // Check if we hit the fetch limit (user likely has more submissions)
        const likelyHasMoreSubmissions = submissions.length === 2500;
        
        const profileData = {
            handle: user.handle,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            avatar: user.titlePhoto || user.avatar || null,
            rank: user.rank || 'newbie',
            maxRank: user.maxRank || user.rank || 'newbie',
            rating: user.rating || 0,
            maxRating,
            contribution: user.contribution || 0,
            friendOfCount: user.friendOfCount || 0,
            country: user.country || null,
            city: user.city || null,
            organization: user.organization || null,
            registrationTime: user.registrationTimeSeconds ? new Date(user.registrationTimeSeconds * 1000).toISOString() : null,
            stats: {
                problemsSolved: solvedProblems.size,
                contestsParticipated,
                avgProblemRating,
                totalSubmissions: submissions.length,
                acceptedSubmissions,
                // Note: problemsSolved is based on fetched submissions (up to 2500)
                // For very active users (50k+ submissions), this is an approximation
                submissionsFetched: submissions.length,
                isApproximation: likelyHasMoreSubmissions
            },
            ratingHistory: ratingHistory.slice(-10).map(r => ({
                contestName: r.contestName,
                rank: r.rank,
                oldRating: r.oldRating,
                newRating: r.newRating,
                ratingChange: r.newRating - r.oldRating,
                date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString()
            })),
            profileUrl: `https://codeforces.com/profile/${handle}`,
            lastFetched: new Date().toISOString()
        };
        
        return profileData;
    } catch (error) {
        console.error('Codeforces API Error:', error.message);
        throw new Error(`Failed to fetch Codeforces profile: ${error.message}`);
    }
}
