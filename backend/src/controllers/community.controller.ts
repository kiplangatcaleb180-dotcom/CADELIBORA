import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getCommunityPosts(req: Request, res: Response) {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) where.category = String(category);

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: { select: { fullName: true, avatarUrl: true, role: true, title: true } },
        comments: {
          include: { author: { select: { fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        author: { select: { fullName: true, avatarUrl: true, role: true, title: true } },
        comments: {
          include: { author: { select: { fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.json({ success: true, post });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCommunityPost(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { title, content, category } = req.body;

    const post = await prisma.communityPost.create({
      data: {
        authorId: req.user.userId,
        title,
        content,
        category: category || 'General',
      },
      include: {
        author: { select: { fullName: true, avatarUrl: true, role: true } },
        comments: true,
      },
    });

    return res.status(201).json({ success: true, post });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deletePost(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.authorId !== req.user.userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own posts' });
    }

    await prisma.communityPost.delete({ where: { id } });
    return res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function likePost(req: AuthenticatedRequest, res: Response) {
  try {
    const { postId } = req.params;

    const post = await prisma.communityPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });

    return res.json({ success: true, post });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function addComment(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: req.user.userId,
        content,
      },
      include: { author: { select: { fullName: true, avatarUrl: true } } },
    });

    return res.status(201).json({ success: true, comment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
