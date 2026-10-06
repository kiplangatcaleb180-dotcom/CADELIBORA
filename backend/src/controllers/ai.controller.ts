import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { runAIReasoner } from '../ai/aiProvider.js';
import { retrieveCADELIBORAKnowledge } from '../ai/aiKnowledge.js';

export async function getUserConversations(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const conversations = await prisma.aIConversation.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, conversations });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getConversationById(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const conversation = await prisma.aIConversation.findFirst({
      where: { id, userId: req.user.userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found or unauthorized' });
    }

    return res.json({ success: true, conversation });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteConversation(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const conversation = await prisma.aIConversation.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found or unauthorized' });
    }

    await prisma.aIConversation.delete({ where: { id } });

    return res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function processAIChat(req: AuthenticatedRequest, res: Response) {
  try {
    const {
      prompt,
      conversationId,
      systemInstruction,
      temperature,
      contextType,
      contextId,
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required.',
      });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const cleanPrompt = prompt.trim();

    if (cleanPrompt.length > 8000) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is too long. Please keep your message under 8,000 characters.',
      });
    }

    let conversation = null;

    if (conversationId) {
      conversation = await prisma.aIConversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 30,
          },
        },
      });

      if (!conversation) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized conversation access.',
        });
      }
    }

    const conversationContext = conversation
      ? [...conversation.messages]
          .reverse()
          .map((message) => `${message.role}: ${message.content}`)
          .join('\n\n')
      : '';

    const contextHeader =
      contextType && contextId
        ? `Current CADELIBORA context: ${contextType} #${contextId}`
        : '';

    let knowledgeContext = '';

    try {
      const knowledge = await retrieveCADELIBORAKnowledge(cleanPrompt);

      if (knowledge.length) {
        const knowledgeItems = knowledge.map((item) => {
          const content = item.content.trim();
          const limitedContent =
            content.length > 2500
              ? `${content.substring(0, 2500)}...`
              : content;

          return `[${item.source}] ${item.title}\n${limitedContent}`;
        });

        knowledgeContext = [
          'Relevant CADELIBORA knowledge:',
          knowledgeItems.join('\n\n'),
        ].join('\n\n');

        if (knowledgeContext.length > 18000) {
          knowledgeContext =
            `${knowledgeContext.substring(0, 18000)}...`;
        }
      }
    } catch (knowledgeError) {
      console.warn(
        'ANR-X knowledge retrieval unavailable:',
        knowledgeError instanceof Error
          ? knowledgeError.message
          : knowledgeError
      );
    }

    const knowledgeInstruction = `
Use the CADELIBORA knowledge provided below when answering questions about CADELIBORA.

Rules:
- Treat the retrieved knowledge as the authoritative source for CADELIBORA-specific facts.
- Do not invent CADELIBORA projects, technologies, courses, research, innovations, capabilities, statistics, or internal details.
- If the retrieved knowledge does not contain enough information to answer a CADELIBORA-specific question, clearly say that the available CADELIBORA knowledge does not provide enough information.
- You may use your general technical knowledge for general technology, programming, AI, research, and educational questions.
- Do not expose internal database IDs unless the user explicitly asks for an identifier.
- Do not claim that you were trained on CADELIBORA's private codebase or databases.
`;

    const fullPrompt = [
      knowledgeInstruction,
      contextHeader,
      knowledgeContext || 'No relevant CADELIBORA knowledge was retrieved.',
      conversationContext
        ? `Previous conversation:\n${conversationContext}`
        : '',
      `Current user message:\n${cleanPrompt}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    // Generate the AI response before writing anything to the database.
    // This prevents failed provider requests from creating orphaned
    // conversations or user-only messages.
    const aiResponse = await runAIReasoner(fullPrompt, {
      systemInstruction,
      temperature,
    });

    const cleanAIResponse =
      aiResponse?.trim() || 'The AI provider returned an empty response.';

    let convId: string;

    if (conversation) {
      convId = conversation.id;

      await prisma.$transaction([
        prisma.aIMessage.create({
          data: {
            conversationId: convId,
            role: 'user',
            content: cleanPrompt,
          },
        }),
        prisma.aIMessage.create({
          data: {
            conversationId: convId,
            role: 'assistant',
            content: cleanAIResponse,
          },
        }),
      ]);
    } else {
      const newConversation = await prisma.aIConversation.create({
        data: {
          userId,
          title:
            cleanPrompt.length > 35
              ? `${cleanPrompt.substring(0, 35)}...`
              : cleanPrompt,
          messages: {
            create: [
              {
                role: 'user',
                content: cleanPrompt,
              },
              {
                role: 'assistant',
                content: cleanAIResponse,
              },
            ],
          },
        },
      });

      convId = newConversation.id;
    }

    return res.json({
      success: true,
      conversationId: convId,
      response: cleanAIResponse,
    });
  } catch (error: any) {
    console.error('AI chat error:', error);

    const status =
      Number.isInteger(error?.status) && error.status >= 400 && error.status < 600
        ? error.status
        : 500;

    return res.status(status).json({
      success: false,
      message:
        status === 503
          ? 'AI service is temporarily unavailable. Please try again later.'
          : error?.message || 'AI service failed.',
    });
  }
}

