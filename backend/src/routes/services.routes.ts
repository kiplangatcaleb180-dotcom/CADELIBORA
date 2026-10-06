import { Router } from 'express';
import { getServicesAndCaseStudies, orderOrRequestService, orderProduct, getUserOrders } from '../controllers/services.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getServicesAndCaseStudies);
router.get('/orders/me', authenticate, getUserOrders);
router.post('/:id/order', authenticate, orderOrRequestService);
router.post('/products/:id/order', authenticate, orderProduct);

export default router;
