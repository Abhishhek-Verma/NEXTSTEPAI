import { clerkClient } from '@clerk/clerk-sdk-node';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Middleware to verify Clerk JWT token and attach user
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authorization token provided' });
        }

        const token = authHeader.substring(7);
        
        // Verify the token with Clerk
        const sessionClaims = await clerkClient.verifyToken(token);
        
        if (!sessionClaims || !sessionClaims.sub) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Get or create user in our database
        let [user] = await db.select().from(users).where(eq(users.clerkId, sessionClaims.sub));
        
        if (!user) {
            // Fetch user details from Clerk
            const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
            
            // Create user in our database
            [user] = await db.insert(users).values({
                clerkId: sessionClaims.sub,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                imageUrl: clerkUser.imageUrl,
            }).returning();
        }

        // Attach user to request
        req.user = user;
        req.clerkId = sessionClaims.sub;
        
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

// Optional auth - doesn't fail if no token provided
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const sessionClaims = await clerkClient.verifyToken(token);
            
            if (sessionClaims && sessionClaims.sub) {
                const [user] = await db.select().from(users).where(eq(users.clerkId, sessionClaims.sub));
                if (user) {
                    req.user = user;
                    req.clerkId = sessionClaims.sub;
                }
            }
        }
        
        next();
    } catch (error) {
        // Don't fail on optional auth
        next();
    }
};
