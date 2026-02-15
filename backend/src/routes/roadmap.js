import express from 'express';
import db from '../db/index.js';
import { roadmaps } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, roadmapSchema } from '../middleware/validation.js';

const router = express.Router();

// Get roadmap for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        let [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        // If no roadmap exists, return empty structure
        if (!roadmap) {
            roadmap = {
                id: null,
                title: '',
                description: '',
                targetRole: '',
                items: [],
                generatedAt: null,
            };
        }

        res.json({ roadmap });
    } catch (error) {
        console.error('Error fetching roadmap:', error);
        res.status(500).json({ error: 'Failed to fetch roadmap' });
    }
});

// Generate/create a new roadmap
router.post('/generate', requireAuth, validate(roadmapSchema), async (req, res) => {
    try {
        // TODO: Integrate with AI service to generate personalized roadmap
        // For now, using provided data
        
        const roadmapData = {
            userId: req.user.id,
            title: req.body.title,
            description: req.body.description || '',
            targetRole: req.body.targetRole || '',
            items: req.body.items || [],
            generatedAt: new Date(),
            updatedAt: new Date(),
        };

        // Check if roadmap exists
        const [existing] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        let roadmap;
        if (existing) {
            // Update existing roadmap
            [roadmap] = await db
                .update(roadmaps)
                .set(roadmapData)
                .where(eq(roadmaps.userId, req.user.id))
                .returning();
        } else {
            // Insert new roadmap
            [roadmap] = await db
                .insert(roadmaps)
                .values(roadmapData)
                .returning();
        }

        res.json({ message: 'Roadmap generated successfully', roadmap });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Failed to generate roadmap' });
    }
});

// Update roadmap items
router.put('/items', requireAuth, async (req, res) => {
    try {
        const { items } = req.body;

        const [roadmap] = await db
            .update(roadmaps)
            .set({ 
                items,
                updatedAt: new Date(),
            })
            .where(eq(roadmaps.userId, req.user.id))
            .returning();

        if (!roadmap) {
            return res.status(404).json({ error: 'Roadmap not found' });
        }

        res.json({ message: 'Roadmap items updated successfully', roadmap });
    } catch (error) {
        console.error('Error updating roadmap items:', error);
        res.status(500).json({ error: 'Failed to update roadmap items' });
    }
});

// Delete roadmap
router.delete('/', requireAuth, async (req, res) => {
    try {
        await db
            .delete(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        res.json({ message: 'Roadmap deleted successfully' });
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        res.status(500).json({ error: 'Failed to delete roadmap' });
    }
});

export default router;
