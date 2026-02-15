/**
 * Codeforces API Integration
 * Fetches user profile, ratings, and contest history
 */

export async function fetchCodeforcesProfile(handle) {
    try {
        const baseUrl = 'https://codeforces.com/api';
        
        // Fetch user info
        const userResponse = await fetch(`${baseUrl}/user.info?handles=${handle}`);
        if (!userResponse.ok) {
            throw new Error(`Codeforces API request failed: ${userResponse.statusText}`);
        }
        
        const userData = await userResponse.json();
        if (userData.status !== 'OK' || !userData.result || userData.result.length === 0) {
            throw new Error(`Codeforces user not found: ${handle}`);
        }
        
        const user = userData.result[0];
        
        // Fetch user rating history
        let ratingHistory = [];
        try {
            const ratingResponse = await fetch(`${baseUrl}/user.rating?handle=${handle}`);
            if (ratingResponse.ok) {
                const ratingData = await ratingResponse.json();
                if (ratingData.status === 'OK') {
                    ratingHistory = ratingData.result;
                }
            }
        } catch (error) {
            console.warn('Failed to fetch rating history:', error.message);
        }
        
        // Fetch user submissions (last 100)
        let submissions = [];
        try {
            const submissionsResponse = await fetch(`${baseUrl}/user.status?handle=${handle}&from=1&count=100`);
            if (submissionsResponse.ok) {
                const submissionsData = await submissionsResponse.json();
                if (submissionsData.status === 'OK') {
                    submissions = submissionsData.result;
                }
            }
        } catch (error) {
            console.warn('Failed to fetch submissions:', error.message);
        }
        
        // Calculate problem-solving stats
        const solvedProblems = new Set();
        const problemRatings = [];
        submissions.forEach(sub => {
            if (sub.verdict === 'OK' && sub.problem) {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedProblems.add(problemId);
                if (sub.problem.rating) {
                    problemRatings.push(sub.problem.rating);
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
        
        return {
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
                acceptedSubmissions: submissions.filter(s => s.verdict === 'OK').length
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
    } catch (error) {
        console.error('Codeforces API Error:', error.message);
        throw new Error(`Failed to fetch Codeforces profile: ${error.message}`);
    }
}
