import express from 'express';
import db from '../db/index.js';
import { roadmaps, roadmapItems, users, onboardingData, academicRecords } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
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
            .where(eq(users.id, req.user.id));

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
            education: userOnboarding?.currentEducation || academicData?.details || 'Not specified',
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

        // Insert roadmap items as separate rows with rich attributes preserved
        const items = aiRoadmap.items || [];
        const itemsToInsert = items.map((item, index) => ({
            roadmapId: roadmap.id,
            sequenceNo: index + 1,
            phase: item.phase || null,
            title: item.title || null,
            taskType: item.taskType || item.type || 'learn',
            description: item.description || item.title || '',
            skills: item.skills || [],
            resources: item.resources || [],
            estimatedWeeks: item.estimatedWeeks ? Number(item.estimatedWeeks) : null,
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

// Create a new roadmap item manually
router.post('/items', requireAuth, async (req, res) => {
    try {
        const { title, description, taskType, phase, skills, resources, estimatedWeeks, dueDate, targetRole } = req.body;

        if (!description && !title) {
            return res.status(400).json({ error: 'Title or description is required' });
        }

        // Find or create roadmap for this user
        let [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        if (!roadmap) {
            [roadmap] = await db
                .insert(roadmaps)
                .values({
                    userId: req.user.id,
                    title: 'My Career Roadmap',
                    description: 'Custom personalized milestone roadmap',
                    targetRole: targetRole || 'Software Engineer',
                    generatedAt: new Date(),
                })
                .returning();
        }

        // Get max sequence number
        const existingItems = await db
            .select()
            .from(roadmapItems)
            .where(eq(roadmapItems.roadmapId, roadmap.id));

        const maxSeq = existingItems.reduce((max, i) => Math.max(max, i.sequenceNo || 0), 0);

        const parsedSkills = Array.isArray(skills)
            ? skills
            : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : []);

        const [item] = await db
            .insert(roadmapItems)
            .values({
                roadmapId: roadmap.id,
                sequenceNo: maxSeq + 1,
                title: title || 'Milestone Task',
                taskType: taskType || 'learn',
                description: description || title || '',
                phase: phase || 'Milestone',
                skills: parsedSkills,
                resources: Array.isArray(resources) ? resources : [],
                estimatedWeeks: estimatedWeeks ? Number(estimatedWeeks) : 1,
                completed: false,
                dueDate: dueDate ? new Date(dueDate) : null,
            })
            .returning();

        res.json({ message: 'Roadmap task added successfully', item });
    } catch (error) {
        console.error('Error adding roadmap item:', error);
        res.status(500).json({ error: 'Failed to add roadmap task' });
    }
});

// Update a specific roadmap item
router.put('/items/:itemId', requireAuth, async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const { title, description, taskType, phase, skills, resources, estimatedWeeks, completed, dueDate } = req.body;

        const [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        if (!roadmap) {
            return res.status(404).json({ error: 'Roadmap not found' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (taskType !== undefined) updateData.taskType = taskType;
        if (phase !== undefined) updateData.phase = phase;
        if (skills !== undefined) {
            updateData.skills = Array.isArray(skills) 
                ? skills 
                : String(skills).split(',').map(s => s.trim()).filter(Boolean);
        }
        if (resources !== undefined) updateData.resources = Array.isArray(resources) ? resources : [];
        if (estimatedWeeks !== undefined) updateData.estimatedWeeks = estimatedWeeks ? Number(estimatedWeeks) : null;
        if (completed !== undefined) updateData.completed = completed;
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

        const [item] = await db
            .update(roadmapItems)
            .set(updateData)
            .where(
                and(
                    eq(roadmapItems.id, itemId),
                    eq(roadmapItems.roadmapId, roadmap.id)
                )
            )
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

// Delete a specific roadmap item
router.delete('/items/:itemId', requireAuth, async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);

        const [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        if (!roadmap) {
            return res.status(404).json({ error: 'Roadmap not found' });
        }

        await db
            .delete(roadmapItems)
            .where(
                and(
                    eq(roadmapItems.id, itemId),
                    eq(roadmapItems.roadmapId, roadmap.id)
                )
            );

        res.json({ message: 'Roadmap item deleted successfully', itemId });
    } catch (error) {
        console.error('Error deleting roadmap item:', error);
        res.status(500).json({ error: 'Failed to delete roadmap item' });
    }
});

// Reorder roadmap items
router.post('/reorder', requireAuth, async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'items array is required' });
        }

        const [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        if (!roadmap) {
            return res.status(404).json({ error: 'Roadmap not found' });
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemId = item.id || item;
            if (itemId) {
                await db
                    .update(roadmapItems)
                    .set({ sequenceNo: i + 1 })
                    .where(
                        and(
                            eq(roadmapItems.id, Number(itemId)),
                            eq(roadmapItems.roadmapId, roadmap.id)
                        )
                    );
            }
        }

        res.json({ message: 'Roadmap reordered successfully' });
    } catch (error) {
        console.error('Error reordering roadmap:', error);
        res.status(500).json({ error: 'Failed to reorder roadmap' });
    }
});

// Delete entire roadmap
router.delete('/', requireAuth, async (req, res) => {
    try {
        const [roadmap] = await db
            .select()
            .from(roadmaps)
            .where(eq(roadmaps.userId, req.user.id));

        if (roadmap) {
            await db
                .delete(roadmapItems)
                .where(eq(roadmapItems.roadmapId, roadmap.id));
            
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
