import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import cookieParser from 'cookie-parser'
import { authLimiter, globalLimiter } from './utils/rateLimiter';

// Route import
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import { app, server } from './lib/socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(
    cors({ 
        credentials: true, 
        origin: [
            'htttp://localhost:5173', 
            'https://social-1-wc5k.onrender.com'
        ], 
        exposedHeaders: ['Set-Cookie'] 
    })
);

// GLobal rate limiting
app.use(globalLimiter);

app.use(cookieParser());

// Swagger declaration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Docs',
            version: '1.0.0',
            description: 'Authentication API Documentation'
        },
        servers: [
            { url: `http://localhost:${PORT}`, description: 'Development server' }
        ]
    },
    apis: ['./src/docs/*.ts'],
};


app.get('/', (req: Request, res: Response) => {
    res.send('Server is healthy');
});

// Authentication
app.use('/api/auth', authLimiter, authRoutes);

// Message route
app.use('/api/message', authLimiter, messageRoutes);

// Docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

server.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    connectDB();
});