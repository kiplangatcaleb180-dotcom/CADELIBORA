import prisma from '../config/db.js';
import { generateEmbedding } from './aiEmbeddings.js';

export type SemanticKnowledgeResult = {
  id: string;
  source: string;
  sourceId: string;
  title: string;
  content: string;
  similarity: number;
};

export async function searchCADELIBORAKnowledgeSemantic(
  query: string,
  limit = 8
): Promise<SemanticKnowledgeResult[]> {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  const embedding = await generateEmbedding(cleanQuery);
  const vectorLiteral = `[${embedding.join(',')}]`;

  const safeLimit = Math.min(Math.max(limit, 1), 20);

  const results = await prisma.$queryRaw<SemanticKnowledgeResult[]>`
    SELECT
      id,
      source,
      "sourceId",
      title,
      content,
      1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
    FROM "AIKnowledgeDocument"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${safeLimit}
  `;

  return results;
}
