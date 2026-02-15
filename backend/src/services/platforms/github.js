/**
 * GitHub API Integration
 * Fetches user profile, repositories, and activity data
 */

export async function fetchGitHubProfile(username) {
    try {
        const baseUrl = 'https://api.github.com';
        
        // Fetch user profile
        const userResponse = await fetch(`${baseUrl}/users/${username}`);
        if (!userResponse.ok) {
            throw new Error(`GitHub user not found: ${username}`);
        }
        const userData = await userResponse.json();
        
        // Fetch user repositories
        const reposResponse = await fetch(`${baseUrl}/users/${username}/repos?per_page=100&sort=updated`);
        if (!reposResponse.ok) {
            throw new Error('Failed to fetch repositories');
        }
        const repos = await reposResponse.json();
        
        // Calculate total commits across all repos (approximation based on default branch)
        let totalCommits = 0;
        const commitPromises = repos.slice(0, 30).map(async (repo) => {
            try {
                // Get commits count for each repo
                const commitsUrl = `${baseUrl}/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`;
                const commitsResponse = await fetch(commitsUrl);
                
                if (commitsResponse.ok) {
                    // GitHub returns the total count in the Link header
                    const linkHeader = commitsResponse.headers.get('Link');
                    if (linkHeader) {
                        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                        if (match) {
                            return parseInt(match[1]);
                        }
                    }
                    // If no Link header, there's at least 1 commit
                    const commits = await commitsResponse.json();
                    return commits.length;
                }
                return 0;
            } catch (err) {
                console.warn(`Failed to fetch commits for ${repo.name}:`, err.message);
                return 0;
            }
        });
        
        const commitCounts = await Promise.all(commitPromises);
        totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);
        
        // Calculate metrics
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        // Get top languages
        const topLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang, count]) => ({ language: lang, count }));
        
        // Get featured repositories (most stars)
        const featuredRepos = repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5)
            .map(repo => ({
                name: repo.name,
                description: repo.description,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                url: repo.html_url,
                updatedAt: repo.updated_at
            }));
        
        return {
            username: userData.login,
            name: userData.name,
            bio: userData.bio,
            avatarUrl: userData.avatar_url,
            profileUrl: userData.html_url,
            publicRepos: userData.public_repos,
            totalRepos: userData.public_repos, // Explicit total repos count
            totalCommits, // Total commits across all repos
            totalStars, // Total stars received
            followers: userData.followers,
            following: userData.following,
            createdAt: userData.created_at,
            totalForks,
            topLanguages,
            featuredRepos,
            lastFetched: new Date().toISOString()
        };
    } catch (error) {
        console.error('GitHub API Error:', error.message);
        throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
    }
}

/**
 * Fetch GitHub contributions data (activity)
 */
export async function fetchGitHubContributions(username) {
    try {
        const eventsUrl = `https://api.github.com/users/${username}/events/public?per_page=100`;
        const response = await fetch(eventsUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub events');
        }
        
        const events = await response.json();
        
        // Count event types
        const eventTypes = {};
        events.forEach(event => {
            eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
        });
        
        // Calculate contribution score
        const pushEvents = eventTypes.PushEvent || 0;
        const pullRequestEvents = eventTypes.PullRequestEvent || 0;
        const issueEvents = eventTypes.IssuesEvent || 0;
        const contributionScore = (pushEvents * 2) + (pullRequestEvents * 5) + (issueEvents * 3);
        
        return {
            totalEvents: events.length,
            eventTypes,
            contributionScore,
            recentActivity: events.slice(0, 10).map(event => ({
                type: event.type,
                repo: event.repo.name,
                createdAt: event.created_at
            })),
            lastFetched: new Date().toISOString()
        };
    } catch (error) {
        console.error('GitHub Contributions Error:', error.message);
        return null;
    }
}
