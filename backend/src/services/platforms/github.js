/**
 * GitHub GraphQL API Integration
 * Fetches user profile, repositories, and activity data in a single query
 * This reduces API calls from 33+ to just 1, avoiding rate limits
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

/**
 * Execute a GraphQL query against GitHub's API
 */
async function executeGraphQLQuery(query, variables = {}) {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not configured in environment variables');
    }

    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
        console.error('GitHub GraphQL Errors:', result.errors);
        throw new Error(`GitHub API Error: ${result.errors[0]?.message || 'Unknown error'}`);
    }

    return result.data;
}

/**
 * Fetch complete GitHub profile using GraphQL (single query)
 */
export async function fetchGitHubProfile(username) {
    try {
        const query = `
            query($username: String!) {
                user(login: $username) {
                    login
                    name
                    bio
                    avatarUrl
                    url
                    createdAt
                    followers {
                        totalCount
                    }
                    following {
                        totalCount
                    }
                    repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER) {
                        totalCount
                        nodes {
                            name
                            description
                            stargazerCount
                            forkCount
                            primaryLanguage {
                                name
                            }
                            url
                            updatedAt
                            defaultBranchRef {
                                target {
                                    ... on Commit {
                                        history {
                                            totalCount
                                        }
                                    }
                                }
                            }
                        }
                    }
                    contributionsCollection {
                        totalCommitContributions
                        totalIssueContributions
                        totalPullRequestContributions
                        totalPullRequestReviewContributions
                        totalRepositoryContributions
                    }
                }
            }
        `;

        const data = await executeGraphQLQuery(query, { username });
        
        if (!data.user) {
            throw new Error(`GitHub user not found: ${username}`);
        }

        const user = data.user;
        const repos = user.repositories.nodes || [];

        // Calculate total stars and forks
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0);
        const totalForks = repos.reduce((sum, repo) => sum + (repo.forkCount || 0), 0);

        // Calculate total commits across all repositories
        const totalCommits = repos.reduce((sum, repo) => {
            const commitCount = repo.defaultBranchRef?.target?.history?.totalCount || 0;
            return sum + commitCount;
        }, 0);

        // Count repositories by language
        const languages = {};
        repos.forEach(repo => {
            if (repo.primaryLanguage?.name) {
                const lang = repo.primaryLanguage.name;
                languages[lang] = (languages[lang] || 0) + 1;
            }
        });

        // Get top 5 languages
        const topLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([language, count]) => ({ language, count }));

        // Get featured repositories (sorted by stars)
        const featuredRepos = repos
            .sort((a, b) => (b.stargazerCount || 0) - (a.stargazerCount || 0))
            .slice(0, 5)
            .map(repo => ({
                name: repo.name,
                description: repo.description || '',
                stars: repo.stargazerCount || 0,
                forks: repo.forkCount || 0,
                language: repo.primaryLanguage?.name || null,
                url: repo.url,
                updatedAt: repo.updatedAt
            }));

        return {
            username: user.login,
            name: user.name,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            profileUrl: user.url,
            publicRepos: user.repositories.totalCount,
            totalRepos: user.repositories.totalCount,
            totalCommits,
            totalStars,
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            createdAt: user.createdAt,
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
 * Fetch GitHub contributions data
 * Now included in the main profile query, but keeping this function for compatibility
 */
export async function fetchGitHubContributions(username) {
    try {
        const query = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        totalCommitContributions
                        totalIssueContributions
                        totalPullRequestContributions
                        totalPullRequestReviewContributions
                        contributionCalendar {
                            totalContributions
                        }
                    }
                }
            }
        `;

        const data = await executeGraphQLQuery(query, { username });
        
        if (!data.user) {
            throw new Error(`GitHub user not found: ${username}`);
        }

        const contributions = data.user.contributionsCollection;

        // Calculate contribution score
        const contributionScore = 
            (contributions.totalCommitContributions * 2) +
            (contributions.totalPullRequestContributions * 5) +
            (contributions.totalIssueContributions * 3) +
            (contributions.totalPullRequestReviewContributions * 4);

        return {
            totalEvents: contributions.contributionCalendar.totalContributions,
            eventTypes: {
                CommitEvent: contributions.totalCommitContributions,
                PullRequestEvent: contributions.totalPullRequestContributions,
                IssuesEvent: contributions.totalIssueContributions,
                ReviewEvent: contributions.totalPullRequestReviewContributions
            },
            contributionScore,
            totalCommitContributions: contributions.totalCommitContributions,
            totalIssueContributions: contributions.totalIssueContributions,
            totalPullRequestContributions: contributions.totalPullRequestContributions,
            totalPullRequestReviewContributions: contributions.totalPullRequestReviewContributions,
            lastFetched: new Date().toISOString()
        };
    } catch (error) {
        console.error('GitHub Contributions Error:', error.message);
        return null;
    }
}
