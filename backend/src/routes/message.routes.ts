import express from 'express'
import { protectRoute } from '../middleware/auth.middleware';
import { getMessage, getUsersForSidebar, sendMessage, pingServer } from '../controllers/message.controller';

const router = express.Router();

// Users for sidebar
router.get('/users', protectRoute, getUsersForSidebar);

// Message history of a user
router.get('/:id', protectRoute, getMessage);

// Send message
router.post('/send/:id', protectRoute, sendMessage);

export default router;