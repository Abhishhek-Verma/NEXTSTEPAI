import express from 'express';
import db from '../db/index.js';
import { skills, studentSkills } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all available skills
router.get('/', async (req, res) => {
    try {
        const allSkills = await db
            .select()
            .from(skills)
            .orderBy(skills.category, skills.skillName);

        res.json({ skills: allSkills });
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// Get user's skills with proficiency levels
router.get('/my-skills', requireAuth, async (req, res) => {
    try {
        const userSkills = await db
            .select({
                id: studentSkills.id,
                skillId: studentSkills.skillId,
                proficiencyLevel: studentSkills.proficiencyLevel,
                skillName: skills.skillName,
                category: skills.category,
            })
            .from(studentSkills)
            .innerJoin(skills, eq(studentSkills.skillId, skills.id))
            .where(eq(studentSkills.studentId, req.user.id))
            .orderBy(skills.category, skills.skillName);

        res.json({ skills: userSkills });
    } catch (error) {
        console.error('Error fetching user skills:', error);
        res.status(500).json({ error: 'Failed to fetch user skills' });
    }
});

// Add a new skill to the master list
router.post('/', requireAuth, async (req, res) => {
    try {
        const { skillName, category } = req.body;

        if (!skillName) {
            return res.status(400).json({ error: 'Skill name is required' });
        }

        const [skill] = await db
            .insert(skills)
            .values({
                skillName,
                category: category || 'Other',
            })
            .returning();

        res.json({ message: 'Skill created successfully', skill });
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
});

// Add a skill to user's profile
router.post('/my-skills', requireAuth, async (req, res) => {
    try {
        const { skillId, proficiencyLevel } = req.body;

        if (!skillId) {
            return res.status(400).json({ error: 'Skill ID is required' });
        }

        // Check if user already has this skill
        const [existing] = await db
            .select()
            .from(studentSkills)
            .where(and(
                eq(studentSkills.studentId, req.user.id),
                eq(studentSkills.skillId, skillId)
            ));

        let userSkill;
        if (existing) {
            // Update proficiency level
            [userSkill] = await db
                .update(studentSkills)
                .set({ proficiencyLevel: proficiencyLevel || 'Beginner' })
                .where(and(
                    eq(studentSkills.studentId, req.user.id),
                    eq(studentSkills.skillId, skillId)
                ))
                .returning();
        } else {
            // Add new skill to user
            [userSkill] = await db
                .insert(studentSkills)
                .values({
                    studentId: req.user.id,
                    skillId,
                    proficiencyLevel: proficiencyLevel || 'Beginner',
                })
                .returning();
        }

        res.json({ message: 'Skill added to profile successfully', skill: userSkill });
    } catch (error) {
        console.error('Error adding skill to profile:', error);
        res.status(500).json({ error: 'Failed to add skill to profile' });
    }
});

// Update skill proficiency level
router.put('/my-skills/:skillId', requireAuth, async (req, res) => {
    try {
        const { skillId } = req.params;
        const { proficiencyLevel } = req.body;

        if (!proficiencyLevel) {
            return res.status(400).json({ error: 'Proficiency level is required' });
        }

        const [userSkill] = await db
            .update(studentSkills)
            .set({ proficiencyLevel })
            .where(and(
                eq(studentSkills.studentId, req.user.id),
                eq(studentSkills.skillId, skillId)
            ))
            .returning();

        if (!userSkill) {
            return res.status(404).json({ error: 'Skill not found in user profile' });
        }

        res.json({ message: 'Skill proficiency updated successfully', skill: userSkill });
    } catch (error) {
        console.error('Error updating skill proficiency:', error);
        res.status(500).json({ error: 'Failed to update skill proficiency' });
    }
});

// Remove a skill from user's profile
router.delete('/my-skills/:skillId', requireAuth, async (req, res) => {
    try {
        const { skillId } = req.params;

        await db
            .delete(studentSkills)
            .where(and(
                eq(studentSkills.studentId, req.user.id),
                eq(studentSkills.skillId, skillId)
            ));

        res.json({ message: 'Skill removed from profile successfully' });
    } catch (error) {
        console.error('Error removing skill from profile:', error);
        res.status(500).json({ error: 'Failed to remove skill from profile' });
    }
});

export default router;
