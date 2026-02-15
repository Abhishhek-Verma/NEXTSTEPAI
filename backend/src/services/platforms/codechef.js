/**
 * CodeChef API Integration
 * Fetches user profile and contest ratings
 * Note: CodeChef doesn't have an official public API, so we use web scraping approach
 */

export async function fetchCodeChefProfile(handle) {
    try {
        // CodeChef profile page
        const profileUrl = `https://www.codechef.com/users/${handle}`;
        
        const response = await fetch(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`CodeChef user not found: ${handle}`);
        }
        
        const html = await response.text();
        
        // Parse basic profile info using regex (simple parsing)
        // In production, consider using a proper HTML parser like cheerio
        
        // Extract username
        const usernameMatch = html.match(/<h1[^>]*class="[^"]*h2-style[^"]*"[^>]*>([^<]+)<\/h1>/);
        const username = usernameMatch ? usernameMatch[1].trim() : handle;
        
        // Extract rating
        const ratingMatch = html.match(/rating-number[^>]*>(\d+)</i);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
        
        // Extract stars (rating badge)
        const starsMatch = html.match(/rating-star[^>]*>(?:\d+\s*)?<span[^>]*>★<\/span>/g);
        const stars = starsMatch ? starsMatch.length : 0;
        
        // Extract country
        const countryMatch = html.match(/<span class="user-country-name">([^<]+)<\/span>/);
        const country = countryMatch ? countryMatch[1].trim() : null;
        
        // Extract problems solved
        const problemsMatch = html.match(/<h3>(\d+)<\/h3>\s*<p>Problems Solved<\/p>/i);
        const problemsSolved = problemsMatch ? parseInt(problemsMatch[1]) : 0;
        
        // Determine rank based on rating
        let rank = 'Unrated';
        if (rating >= 2500) rank = '7★ (Red)';
        else if (rating >= 2200) rank = '6★ (Orange)';
        else if (rating >= 2000) rank = '5★ (Violet)';
        else if (rating >= 1800) rank = '4★ (Blue)';
        else if (rating >= 1600) rank = '3★ (Green)';
        else if (rating >= 1400) rank = '2★ (Cyan)';
        else if (rating >= 1200) rank = '1★ (Gray)';
        
        // Get rating divisions
        const divisions = {
            div1: { rating: 0, stars: 0, highestRating: 0 },
            div2: { rating: 0, stars: 0, highestRating: 0 },
            div3: { rating: 0, stars: 0, highestRating: 0 }
        };
        
        // Try to extract more detailed contest stats
        const contestsMatch = html.match(/contest-participated-count[^>]*>(\d+)/);
        const contestsParticipated = contestsMatch ? parseInt(contestsMatch[1]) : 0;
        
        return {
            handle,
            username,
            rating,
            stars,
            rank,
            country,
            problemsSolved,
            contestsParticipated,
            divisions,
            profileUrl,
            lastFetched: new Date().toISOString(),
            note: 'Limited data due to CodeChef API restrictions. Some fields may be approximate.'
        };
    } catch (error) {
        console.error('CodeChef Scraping Error:', error.message);
        
        // Return minimal data if scraping fails
        return {
            handle,
            username: handle,
            rating: 0,
            stars: 0,
            rank: 'Unrated',
            country: null,
            problemsSolved: 0,
            contestsParticipated: 0,
            divisions: {
                div1: { rating: 0, stars: 0, highestRating: 0 },
                div2: { rating: 0, stars: 0, highestRating: 0 },
                div3: { rating: 0, stars: 0, highestRating: 0 }
            },
            profileUrl: `https://www.codechef.com/users/${handle}`,
            lastFetched: new Date().toISOString(),
            error: error.message,
            note: 'Failed to fetch profile data. Please verify the username is correct.'
        };
    }
}

/**
 * Alternative: Fetch basic CodeChef data using their internal API
 * This might be rate-limited or change without notice
 */
export async function fetchCodeChefProfileAlt(handle) {
    try {
        const apiUrl = `https://www.codechef.com/users/${handle}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        if (!response.ok) {
            // Fallback to scraping
            return await fetchCodeChefProfile(handle);
        }
        
        const data = await response.json();
        
        return {
            handle: data.username || handle,
            username: data.username || handle,
            rating: data.rating || 0,
            stars: data.stars || 0,
            rank: data.rank || 'Unrated',
            country: data.country || null,
            problemsSolved: data.problemsSolved || 0,
            contestsParticipated: data.contestsParticipated || 0,
            profileUrl: `https://www.codechef.com/users/${handle}`,
            lastFetched: new Date().toISOString()
        };
    } catch (error) {
        // Fallback to scraping method
        return await fetchCodeChefProfile(handle);
    }
}
