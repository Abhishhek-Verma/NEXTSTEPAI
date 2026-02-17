/**
 * CodeChef Profile Scraper
 * Note: CodeChef doesn't have an official public API
 * */

// Request timeout (10 seconds - scraping can be slow)
const REQUEST_TIMEOUT = 10000;

// Request headers to mimic browser and avoid blocking
const REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.codechef.com'
};

/**
 * Add random delay to avoid bot detection when scraping multiple profiles
 */
async function randomDelay(minMs = 500, maxMs = 2000) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    await new Promise(resolve => setTimeout(resolve, delay));
}

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
            throw new Error('Request timeout - CodeChef is too slow or unreachable');
        }
        throw error;
    }
}

/**
 * Retry wrapper for scraping requests
 * Retries even on timeout since network issues are common with scraping
 */
async function fetchWithRetry(url, options = {}, retries = 1) {
    try {
        return await fetchWithTimeout(url, options);
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying CodeChef scrape... (${retries} retries left). Error: ${error.message}`);
            // Wait 2-3 seconds before retry (with small randomization)
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

/**
 * Calculate stars from rating (CodeChef's star system)
 */
function calculateStars(rating) {
    if (rating >= 2500) return 7;
    if (rating >= 2200) return 6;
    if (rating >= 2000) return 5;
    if (rating >= 1800) return 4;
    if (rating >= 1600) return 3;
    if (rating >= 1400) return 2;
    if (rating >= 1200) return 1;
    return 0;
}

/**
 * Get rank name from rating
 */
function getRankFromRating(rating) {
    if (rating >= 2500) return '7★ (Red)';
    if (rating >= 2200) return '6★ (Orange)';
    if (rating >= 2000) return '5★ (Violet)';
    if (rating >= 1800) return '4★ (Blue)';
    if (rating >= 1600) return '3★ (Green)';
    if (rating >= 1400) return '2★ (Cyan)';
    if (rating >= 1200) return '1★ (Gray)';
    return 'Unrated';
}

/**
 * Safe integer extraction with validation
 */
function extractInteger(match, fieldName) {
    if (!match || !match[1]) {
        console.warn(`CodeChef: Could not extract ${fieldName}`);
        return null;
    }
    const value = parseInt(match[1], 10);
    if (isNaN(value) || value < 0 || value > 1000000) {
        console.warn(`CodeChef: Invalid ${fieldName} value: ${match[1]}`);
        return null;
    }
    return value;
}

export async function fetchCodeChefProfile(handle) {
    try {
        const profileUrl = `https://www.codechef.com/users/${handle}`;
        
        console.log(`Fetching CodeChef profile for: ${handle}`);
        
        // Random delay to avoid bot detection (currently commented out)
        // WHEN TO ENABLE:
        // - Scraping multiple profiles (10+) in quick succession
        // - Dashboard loading many users simultaneously
        // - Automated batch processing
        // HOW TO ENABLE: Uncomment the line below
        // await randomDelay(500, 1500);
        
        const response = await fetchWithRetry(profileUrl, { headers: REQUEST_HEADERS });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`CodeChef user not found: ${handle}`);
            }
            throw new Error(`CodeChef request failed with status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Validate HTML response
        if (!html || html.length < 1000) {
            throw new Error('Received incomplete HTML from CodeChef');
        }
        
        // WARNING: CodeChef may lazy-load some stats via JS
        // If stats are missing, they might be JS-rendered and unavailable in raw HTML
        
        // Extract rating (most reliable field)
        const ratingMatch = html.match(/rating-number[^>]*>\s*(\d+)\s*</i);
        const rating = extractInteger(ratingMatch, 'rating') || 0;
        
        // Derive stars from rating (reliable, not from HTML)
        const stars = calculateStars(rating);
        const rank = getRankFromRating(rating);
        
        // Extract username - try specific pattern first
        let username = handle;
        const usernameMatch = html.match(/<h1[^>]*class="[^"]*h2-style[^"]*"[^>]*>\s*([^<]+)\s*<\/h1>/);
        if (usernameMatch && usernameMatch[1]) {
            username = usernameMatch[1].trim();
            console.log(`CodeChef: Extracted username: ${username}`);
        } else {
            console.warn('CodeChef: Could not extract username, using handle');
        }
        
        // Extract country
        const countryMatch = html.match(/<span[^>]*class="[^"]*user-country-name[^"]*"[^>]*>\s*([^<]+)\s*<\/span>/);
        const country = countryMatch ? countryMatch[1].trim() : null;
        
        // Extract problems solved - use only specific, reliable pattern
        let problemsSolved = null;
        const problemsMatch = html.match(/<h3[^>]*>\s*(\d+)\s*<\/h3>\s*<[^>]*>\s*Problems?\s+Solved\s*</);
        problemsSolved = extractInteger(problemsMatch, 'problems solved');
        
        if (problemsSolved === null) {
            // Try fallback pattern (less reliable)
            const fallbackMatch = html.match(/fully[\s-]*solved[^>]*>\s*(\d+)\s*</i);
            problemsSolved = extractInteger(fallbackMatch, 'problems solved (fallback)');
        }
        
        // Extract contests participated - specific pattern only
        let contestsParticipated = null;
        const contestsMatch = html.match(/<h3[^>]*>\s*(\d+)\s*<\/h3>\s*<[^>]*>\s*Contests?[^<]*</);
        contestsParticipated = extractInteger(contestsMatch, 'contests participated');
        
        if (contestsParticipated === null) {
            // Try fallback
            const fallbackMatch = html.match(/contest-participated-count[^>]*>\s*(\d+)\s*</i);
            contestsParticipated = extractInteger(fallbackMatch, 'contests (fallback)');
        }
        
        // Log parsing results
        console.log(`CodeChef parsed data for ${handle}:`, {
            rating,
            stars,
            problemsSolved,
            contestsParticipated
        });
        
        // Check if critical data is missing (possible JS-rendered content)
        if (problemsSolved === null && contestsParticipated === null && rating === 0) {
            console.warn(`CodeChef: Most stats missing for ${handle} - possible JS-rendered content or layout change`);
        }
        
        return {
            handle,
            username,
            rating,
            stars, // Derived from rating, not HTML
            rank,
            country,
            problemsSolved,
            contestsParticipated,
            profileUrl,
            lastFetched: new Date().toISOString(),
            note: (problemsSolved === null || contestsParticipated === null)
                ? 'Some metrics unavailable. May be JS-rendered or layout changed.'
                : 'Scraped from CodeChef. Data may be approximate due to HTML parsing.'
        };
    } catch (error) {
        console.error(`CodeChef Scraping Error for ${handle}:`, error.message);
        
        // Return minimal data if scraping fails completely
        return {
            handle,
            username: handle,
            rating: 0,
            stars: 0,
            rank: 'Unrated',
            country: null,
            problemsSolved: null,
            contestsParticipated: null,
            profileUrl: `https://www.codechef.com/users/${handle}`,
            lastFetched: new Date().toISOString(),
            error: error.message,
            note: 'Scraping failed. Reasons: Invalid handle, CodeChef down, layout changed, or JS-rendered content.'
        };
    }
}
