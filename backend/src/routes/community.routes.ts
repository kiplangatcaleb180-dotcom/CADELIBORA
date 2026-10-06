import { Router } from 'express';
import { getCommunityPosts, getPostById, createCommunityPost, likePost, addComment, deletePost } from '../controllers/community.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/posts', getCommunityPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', authenticate, createCommunityPost);
router.post('/posts/:postId/like', authenticate, likePost);
router.post('/posts/:postId/comments', authenticate, addComment);
router.delete('/posts/:id', authenticate, deletePost);

export default router;
