import { Router } from 'express';
import { getArticles } from '../controllers/articles.controller.js';

const router = Router();

router.get('/', getArticles);

export default router;
