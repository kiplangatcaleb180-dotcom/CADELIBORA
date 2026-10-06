import crypto from 'node:crypto';
import prisma from '../config/db.js';
import { generateEmbedding } from './aiEmbeddings.js';

type KnowledgeDocument = {
  source: string;
  sourceId: string;
  title: string;
  content: string;
};

function hashContent(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

async function upsertKnowledgeDocument(
  document: KnowledgeDocument
) {
  const contentHash = hashContent(document.content);

  const existing = await prisma.aIKnowledgeDocument.findFirst({
    where: {
      source: document.source,
      sourceId: document.sourceId,
    },
  });

  if (existing?.contentHash === contentHash) {
    return 'unchanged';
  }

  const embedding = await generateEmbedding(
    `${document.title}\n\n${document.content}`
  );

  const vectorLiteral = `[${embedding.join(',')}]`;

  if (existing) {
    await prisma.$executeRaw`
      UPDATE "AIKnowledgeDocument"
      SET
        "title" = ${document.title},
        "content" = ${document.content},
        "embedding" = ${vectorLiteral}::vector,
        "contentHash" = ${contentHash},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${existing.id}
    `;

    return 'updated';
  }

  await prisma.$executeRaw`
    INSERT INTO "AIKnowledgeDocument"
      ("id", "source", "sourceId", "title", "content", "embedding", "contentHash")
    VALUES
      (
        (gen_random_uuid())::text,
        ${document.source},
        ${document.sourceId},
        ${document.title},
        ${document.content},
        ${vectorLiteral}::vector,
        ${contentHash}
      )
  `;

  return 'created';
}

export async function indexCADELIBORAKnowledge() {
  const documents: KnowledgeDocument[] = [];

  const technologies = await prisma.technology.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  for (const item of technologies) {
    documents.push({
      source: 'Technology',
      sourceId: item.id,
      title: item.name,
      content: [
        `Category: ${item.category}`,
        `Description: ${item.description}`,
        item.version ? `Version: ${item.version}` : '',
        item.websiteUrl ? `Website: ${item.websiteUrl}` : '',
        item.docsUrl ? `Documentation: ${item.docsUrl}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  const domains = await prisma.technologyDomain.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  for (const item of domains) {
    documents.push({
      source: 'Technology Domain',
      sourceId: item.id,
      title: item.name,
      content: item.description,
    });
  }

  const stack = await prisma.technologyStack.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  for (const item of stack) {
    documents.push({
      source: 'Technology Stack',
      sourceId: item.id,
      title: item.name,
      content: [
        `Type: ${item.type}`,
        item.description
          ? `Description: ${item.description}`
          : '',
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  const sections = await prisma.technologySection.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  for (const item of sections) {
    documents.push({
      source: 'Technology Section',
      sourceId: item.id,
      title: item.title,
      content: item.content,
    });
  }

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      lessons: {
        orderBy: {
          order: 'asc',
        },
        take: 5,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  for (const course of courses) {
    const lessons = course.lessons
      .map(
        (lesson) =>
          `Lesson ${lesson.order}: ${lesson.title}\n${lesson.content}`
      )
      .join('\n\n');

    documents.push({
      source: 'Academy Course',
      sourceId: course.id,
      title: course.title,
      content: [
        `Category: ${course.category}`,
        `Level: ${course.level}`,
        `Duration: ${course.duration}`,
        `Description: ${course.description}`,
        lessons,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  const researchProjects =
    await prisma.researchProject.findMany({
      include: {
        publications: {
          orderBy: {
            year: 'desc',
          },
          take: 3,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

  for (const project of researchProjects) {
    const publications = project.publications
      .map(
        (publication) =>
          `Publication: ${publication.title} (${publication.year})\n` +
          `Authors: ${publication.authors}\n` +
          `Journal: ${publication.journal}\n` +
          `Abstract: ${publication.abstract}`
      )
      .join('\n\n');

    documents.push({
      source: 'Research Project',
      sourceId: project.id,
      title: project.title,
      content: [
        `Area: ${project.area}`,
        `Status: ${project.status}`,
        `Years: ${project.startYear}${
          project.endYear ? `-${project.endYear}` : ''
        }`,
        `Description: ${project.description}`,
        publications,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  const innovations =
    await prisma.innovationConcept.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

  for (const item of innovations) {
    documents.push({
      source: 'Innovation',
      sourceId: item.id,
      title: item.title,
      content: [
        `Category: ${item.category}`,
        `Stage: ${item.conceptStage}`,
        `Summary: ${item.summary}`,
        `Details: ${item.fullDetails}`,
      ].join('\n'),
    });
  }

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const document of documents) {
    const result = await upsertKnowledgeDocument(document);

    if (result === 'created') created++;
    else if (result === 'updated') updated++;
    else unchanged++;
  }

  return {
    total: documents.length,
    created,
    updated,
    unchanged,
  };
}
