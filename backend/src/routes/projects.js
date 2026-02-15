import express from 'express';
import db from '../db/index.js';
import { projects, skills, projectSkills } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for the authenticated user with skills
router.get('/', requireAuth, async (req, res) => {
    try {
        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, req.user.id))
            .orderBy(desc(projects.createdAt));

        // For backward compatibility, convert to frontend format
        const projectsWithSkills = userProjects.map(project => ({
            ...project,
            githubUrl: project.repoUrl, // Map for frontend
            technologies: [], // Will be populated later with skills
        }));

        res.json(projectsWithSkills);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create a new project
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, description, repoUrl, githubUrl, liveUrl, status, technologies } = req.body;
        
        const projectData = {
            userId: req.user.id,
            title,
            description: description || null,
            repoUrl: repoUrl || githubUrl || null, // Accept both field names
            liveUrl: liveUrl || null,
            status: status || 'in-progress',
            completedAt: status === 'completed' ? new Date() : null,
        };

        const [newProject] = await db
            .insert(projects)
            .values(projectData)
            .returning();

        // Convert back to frontend format
        const response = {
            ...newProject,
            githubUrl: newProject.repoUrl,
            technologies: technologies || [],
        };

        res.status(201).json({ message: 'Project created successfully', project: response });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update a project
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const { title, description, repoUrl, githubUrl, liveUrl, status, technologies } = req.body;
        
        const updateData = {
            title: title,
            description: description || null,
            repoUrl: repoUrl || githubUrl || null,
            liveUrl: liveUrl || null,
            status: status || 'in-progress',
            completedAt: status === 'completed' ? new Date() : null,
            updatedAt: new Date(),
        };

        const [updatedProject] = await db
            .update(projects)
            .set(updateData)
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

        // Convert back to frontend format
        const response = {
            ...updatedProject,
            githubUrl: updatedProject.repoUrl,
            technologies: technologies || [],
        };

        res.json({ message: 'Project updated successfully', project: response });
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
