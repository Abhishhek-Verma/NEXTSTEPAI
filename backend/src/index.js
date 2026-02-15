import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import academicRoutes from './routes/academic.js';
import codingRoutes from './routes/coding.js';
import projectsRoutes from './routes/projects.js';
import psychometricRoutes from './routes/psychometric.js';
import recommendationsRoutes from './routes/recommendations.js';
import roadmapRoutes from './routes/roadmap.js';
import onboardingRoutes from './routes/onboarding.js';
import userRoutes from './routes/user.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/psychometric', psychometricRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/onboarding', onboardingRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});

// Start server
app.listen(PORT, () => {
    // Server started successfully
    // Access health check at /health for status
});

export default app;
