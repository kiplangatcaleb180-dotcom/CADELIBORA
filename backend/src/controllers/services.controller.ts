import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getServicesAndCaseStudies(req: Request, res: Response) {
  try {
    const services = await prisma.service.findMany();
    const caseStudies = await prisma.caseStudy.findMany();
    return res.json({ success: true, services, caseStudies });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function orderOrRequestService(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        serviceId: id,
        amount: service.price,
        currency: service.currency,
        status: 'PENDING',
      },
      include: { service: true },
    });

    await prisma.notification.create({
      data: {
        userId: req.user.userId,
        title: 'Service Request Confirmed',
        message: `Your request for ${service.name} has been received and is being processed.`,
        type: 'system',
        link: '/dashboard/orders',
      },
    });

    return res.status(201).json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function orderProduct(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        productId: id,
        amount: product.price,
        currency: product.currency,
        status: 'PENDING',
      },
      include: { product: true },
    });

    await prisma.notification.create({
      data: {
        userId: req.user.userId,
        title: 'Product Purchase Successful',
        message: `You have successfully purchased ${product.title}. Access digital downloads in your orders.`,
        type: 'system',
        link: '/dashboard/orders',
      },
    });

    return res.status(201).json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUserOrders(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { product: true, service: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
