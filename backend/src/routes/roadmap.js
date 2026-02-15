import express from 'express';
import db from '../db/index.js';
import { roadmaps, roadmapItems, users, onboardingData, academicRecords } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, roadmapSchema } from '../middleware/validation.js';
import { generateRoadmap } from '../services/ai.js';

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
            return res.json({ roadmap });
        }

        // Fetch roadmap items from roadmapItems table
        const items = await db
            .select()
            .from(roadmapItems)
            .where(eq(roadmapItems.roadmapId, roadmap.id))
            .orderBy(roadmapItems.sequenceNo);

        // Add items to roadmap response
        roadmap.items = items;

        res.json({ roadmap });
    } catch (error) {
        console.error('Error fetching roadmap:', error);
        res.status(500).json({ error: 'Failed to fetch roadmap' });
    }
});

// Generate/create a new roadmap
router.post('/generate', requireAuth, async (req, res) => {
    try {
        const { targetRole } = req.body;
        
        if (!targetRole) {
            return res.status(400).json({ error: 'Target role is required' });
        }

        // Gather user data from various sources
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, req.user.id));

        const [userOnboarding] = await db
            .select()
            .from(onboardingData)
            .where(eq(onboardingData.userId, req.user.id));

        const [academicData] = await db
            .select()
            .from(academicRecords)
            .where(eq(academicRecords.userId, req.user.id));

        // Prepare user data for AI
        const userData = {
            targetRole,
            currentSkills: userOnboarding?.skills || [],
            education: userOnboarding?.currentEducation || academicData?.degree || 'Not specified',
            experience: userOnboarding?.experience || 'Beginner',
            interests: userOnboarding?.interests || [],
        };

        // Generate AI-powered roadmap
        const aiRoadmap = await generateRoadmap(userData);
        
        const roadmapData = {
            userId: req.user.id,
            title: aiRoadmap.title,
            description: aiRoadmap.description || '',
            targetRole: aiRoadmap.targetRole || targetRole,
            generatedAt: new Date(),
        };

        // Check if roadmap exists
        const [existing] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        let roadmap;
        if (existing) {
            // Delete old items
            await db
                .delete(roadmapItems)
                .where(eq(roadmapItems.roadmapId, existing.id));
            
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

        // Insert roadmap items as separate rows
        const items = aiRoadmap.items || [];
        const itemsToInsert = items.map((item, index) => ({
            roadmapId: roadmap.id,
            sequenceNo: index + 1,
            taskType: item.type || item.taskType || 'task',
            description: item.description || item.title || '',
            completed: false,
            dueDate: item.dueDate || null,
        }));

        if (itemsToInsert.length > 0) {
            roadmap.items = await db
                .insert(roadmapItems)
                .values(itemsToInsert)
                .returning();
        } else {
            roadmap.items = [];
        }

        res.json({ message: 'Roadmap generated successfully', roadmap });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Failed to generate roadmap' });
    }
});

// Update a specific roadmap item
router.put('/items/:itemId', requireAuth, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { completed, description, dueDate } = req.body;

        const updateData = {};
        if (completed !== undefined) updateData.completed = completed;
        if (description !== undefined) updateData.description = description;
        if (dueDate !== undefined) updateData.dueDate = dueDate;

        const [item] = await db
            .update(roadmapItems)
            .set(updateData)
            .where(eq(roadmapItems.id, itemId))
            .returning();

        if (!item) {
            return res.status(404).json({ error: 'Roadmap item not found' });
        }

        res.json({ message: 'Roadmap item updated successfully', item });
    } catch (error) {
        console.error('Error updating roadmap item:', error);
        res.status(500).json({ error: 'Failed to update roadmap item' });
    }
});

// Delete roadmap (cascade deletes items due to foreign key)
router.delete('/', requireAuth, async (req, res) => {
    try {
        const [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        if (roadmap) {
            // Delete items first
            await db
                .delete(roadmapItems)
                .where(eq(roadmapItems.roadmapId, roadmap.id));
            
            // Delete roadmap
            await db
                .delete(roadmaps)
                .where(eq(roadmaps.userId, req.user.id));
        }

        res.json({ message: 'Roadmap deleted successfully' });
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        res.status(500).json({ error: 'Failed to delete roadmap' });
    }
});

export default router;
