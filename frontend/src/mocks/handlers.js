import { http, HttpResponse, delay } from 'msw';
import {
    mockUser,
    mockAcademicRecords,
    mockCodingProfile,
    mockPsychometricProfile,
    mockAnalysisResult,
    mockRecommendations,
    mockRoadmap,
    mockProjects,
} from './data';

const API_BASE = '/api';

// Simulate network delay
const randomDelay = async () => await delay(300);

export const handlers = [
    // Auth
    http.get(`${API_BASE}/auth/me`, async () => {
        await randomDelay();
        return HttpResponse.json({ user: mockUser });
    }),

    // Academic Records
    http.get(`${API_BASE}/academic/records`, async () => {
        await randomDelay();
        return HttpResponse.json({ records: mockAcademicRecords });
    }),

    http.post(`${API_BASE}/academic/records`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json({ ok: true });
    }),

    // Coding Profile
    http.get(`${API_BASE}/coding/profile`, async () => {
        await randomDelay();
        return HttpResponse.json({ profile: mockCodingProfile });
    }),

    http.post(`${API_BASE}/coding/profile`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json({ ok: true });
    }),

    // Psychometric
    http.get(`${API_BASE}/psychometric/results`, async () => {
        await randomDelay();
        return HttpResponse.json({ profile: mockPsychometricProfile });
    }),

    http.post(`${API_BASE}/psychometric/results`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json({ ok: true });
    }),

    // Analysis
    http.post(`${API_BASE}/analyze`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json(mockAnalysisResult);
    }),

    // Recommendations
    http.get(`${API_BASE}/recommendations`, async () => {
        await randomDelay();
        return HttpResponse.json(mockRecommendations);
    }),

    // Roadmap
    http.get(`${API_BASE}/roadmap`, async () => {
        await randomDelay();
        return HttpResponse.json({ roadmap: mockRoadmap });
    }),

    http.post(`${API_BASE}/roadmap/generate`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json({ roadmap: mockRoadmap });
    }),

    http.post(`${API_BASE}/roadmap/save`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json({ ok: true });
    }),

    // Projects
    http.get(`${API_BASE}/projects`, async () => {
        await randomDelay();
        return HttpResponse.json({ projects: mockProjects });
    }),

    http.post(`${API_BASE}/projects`, async ({ request }) => {
        await randomDelay();
        const body = await request.json();
        return HttpResponse.json({ project: { ...body, id: Date.now() } });
    }),
];