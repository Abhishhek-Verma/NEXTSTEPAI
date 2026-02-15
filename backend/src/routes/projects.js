import express from 'express';
import db from '../db/index.js';
import { projects } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, projectSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all projects for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, req.user.id))
            .orderBy(projects.createdAt);

        res.json({ projects: userProjects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get a single project
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        
        const [project] = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.userId, req.user.id)
                )
            );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Create a new project
router.post('/', requireAuth, validate(projectSchema), async (req, res) => {
    try {
        const projectData = {
            userId: req.user.id,
            ...req.body,
        };

        const [newProject] = await db
            .insert(projects)
            .values(projectData)
            .returning();

        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update a project
router.put('/:id', requireAuth, validate(projectSchema), async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        
        const [updatedProject] = await db
            .update(projects)
            .set({
                ...req.body,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.userId, req.user.id)
                )
            )
            .returning();

        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete a project
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        
        await db
            .delete(projects)
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.userId, req.user.id)
                )
            );

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
