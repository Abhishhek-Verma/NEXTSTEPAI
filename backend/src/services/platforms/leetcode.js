/**
 * LeetCode API Integration
 * Fetches user profile and problem-solving statistics
 */

export async function fetchLeetCodeProfile(username) {
    try {
        // LeetCode GraphQL endpoint
        const graphqlUrl = 'https://leetcode.com/graphql';
        
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    profile {
                        realName
                        userAvatar
                        ranking
                        reputation
                        websites
                        countryName
                        aboutMe
                    }
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                        totalSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                    badges {
                        id
                        displayName
                        icon
                        creationDate
                    }
                }
                userContestRanking(username: $username) {
                    attendedContestsCount
                    rating
                    globalRanking
                    topPercentage
                }
                recentSubmissionList(username: $username, limit: 20) {
                    title
                    timestamp
                    statusDisplay
                    lang
                }
            }
        `;
        
        const response = await fetch(graphqlUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'Origin': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        });
        
        if (!response.ok) {
            throw new Error(`LeetCode API request failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !data.data.matchedUser) {
            throw new Error(`LeetCode user not found: ${username}`);
        }
        
        const user = data.data.matchedUser;
        const contest = data.data.userContestRanking;
        const submissions = data.data.recentSubmissionList || [];
        
        // Parse submission stats
        const acStats = user.submitStats?.acSubmissionNum || [];
        const totalStats = user.submitStats?.totalSubmissionNum || [];
        
        const problemsSolved = {
            easy: acStats.find(s => s.difficulty === 'Easy')?.count || 0,
            medium: acStats.find(s => s.difficulty === 'Medium')?.count || 0,
            hard: acStats.find(s => s.difficulty === 'Hard')?.count || 0,
            total: acStats.find(s => s.difficulty === 'All')?.count || 0
        };
        
        const totalSubmissions = {
            easy: totalStats.find(s => s.difficulty === 'Easy')?.submissions || 0,
            medium: totalStats.find(s => s.difficulty === 'Medium')?.submissions || 0,
            hard: totalStats.find(s => s.difficulty === 'Hard')?.submissions || 0,
            total: totalStats.find(s => s.difficulty === 'All')?.submissions || 0
        };
        
        // Calculate acceptance rate
        const acceptanceRate = totalSubmissions.total > 0 
            ? ((problemsSolved.total / totalSubmissions.total) * 100).toFixed(2)
            : 0;
        
        return {
            username: user.username,
            name: user.profile?.realName || null,
            avatar: user.profile?.userAvatar || null,
            ranking: user.profile?.ranking || null,
            reputation: user.profile?.reputation || 0,
            countryName: user.profile?.countryName || null,
            aboutMe: user.profile?.aboutMe || null,
            problemsSolved,
            totalSubmissions,
            acceptanceRate: parseFloat(acceptanceRate),
            contestStats: contest ? {
                attended: contest.attendedContestsCount || 0,
                rating: Math.round(contest.rating || 0),
                globalRanking: contest.globalRanking || null,
                topPercentage: contest.topPercentage ? contest.topPercentage.toFixed(2) : null
            } : null,
            badges: user.badges?.map(badge => ({
                name: badge.displayName,
                icon: badge.icon,
                date: badge.creationDate
            })) || [],
            recentSubmissions: submissions.slice(0, 10).map(sub => ({
                title: sub.title,
                status: sub.statusDisplay,
                language: sub.lang,
                timestamp: sub.timestamp
            })),
            profileUrl: `https://leetcode.com/${username}`,
            lastFetched: new Date().toISOString()
        };
    } catch (error) {
        console.error('LeetCode API Error:', error.message);
        throw new Error(`Failed to fetch LeetCode profile: ${error.message}`);
    }
}
