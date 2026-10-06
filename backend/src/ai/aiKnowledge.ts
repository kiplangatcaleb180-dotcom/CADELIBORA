import prisma from '../config/db.js';
import { searchCADELIBORAKnowledgeSemantic } from './aiKnowledgeSemantic.js';

type KnowledgeItem = {
  source: string;
  id: string;
  title: string;
  content: string;
};

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'are',
  'but',
  'not',
  'you',
  'your',
  'what',
  'when',
  'where',
  'which',
  'who',
  'how',
  'does',
  'did',
  'can',
  'could',
  'would',
  'should',
  'have',
  'has',
  'had',
  'this',
  'that',
  'with',
  'from',
  'about',
  'into',
  'their',
  'there',
  'our',
  'its',
  'currently',
  'tell',
  'me',
  'please',
  'show',
  'give',
  'provide',
  'list',
  'explain',
  'describe',
  'know',
  'more',
]);

type KnowledgeIntent =
  | 'course'
  | 'research'
  | 'innovation'
  | 'technology'
  | 'general';

function detectKnowledgeIntents(query: string): KnowledgeIntent[] {
  const normalized = query.toLowerCase();
  const intents: KnowledgeIntent[] = [];

  if (
    /\b(course|courses|class|classes|lesson|lessons|learn|learning|study|studies|training)\b/.test(
      normalized
    )
  ) {
    intents.push('course');
  }

  if (
    /\b(research|researches|researching|project|projects|publication|publications)\b/.test(
      normalized
    )
  ) {
    intents.push('research');
  }

  if (
    /\b(innovation|innovations|innovative|concept|concepts|idea|ideas)\b/.test(
      normalized
    )
  ) {
    intents.push('innovation');
  }

  if (
    /\b(technology|technologies|tech|stack|stacks|framework|frameworks|database|databases|programming)\b/.test(
      normalized
    )
  ) {
    intents.push('technology');
  }

  return intents.length ? intents : ['general'];
}

function getSourcesForIntent(
  intent: KnowledgeIntent
): string[] {
  switch (intent) {
    case 'course':
      return ['Academy Course'];

    case 'research':
      return ['Research Project'];

    case 'innovation':
      return ['Innovation'];

    case 'technology':
      return [
        'Technology',
        'Technology Domain',
        'Technology Stack',
        'Technology Section',
      ];

    default:
      return [];
  }
}

function getIntentPriority(
  intents: KnowledgeIntent[],
  source: string
): number {
  let priority = 0;

  for (const intent of intents) {
    if (intents.includes('course') && source === 'Academy Course') {
      priority = Math.max(priority, 1);
    }

    if (intents.includes('research') && source === 'Research Project') {
      priority = Math.max(priority, 1);
    }

    if (intents.includes('innovation') && source === 'Innovation') {
      priority = Math.max(priority, 1);
    }

    if (
      intent === 'technology' &&
      [
        'Technology',
        'Technology Domain',
        'Technology Stack',
        'Technology Section',
      ].includes(source)
    ) {
      priority = Math.max(priority, 1);
    }
  }

  return priority;
}

function buildTerms(query: string): string[] {
  return [...new Set(
    query
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(
        (term) =>
          term.length >= 3 &&
          !STOP_WORDS.has(term)
      )
  )].slice(0, 8);
}

function getExactMatchBonus(
  terms: string[],
  title: string
): number {
  const normalizedTitle = title.toLowerCase().trim();

  if (!normalizedTitle || !terms.length) {
    return 0;
  }

  if (terms.some((term) => normalizedTitle === term)) {
    return 0.75;
  }

  if (
    terms.some((term) =>
      normalizedTitle.split(/\s+/).includes(term)
    )
  ) {
    return 0.35;
  }

  return 0;
}

export async function retrieveCADELIBORAKnowledge(
  query: string,
  limit = 12
): Promise<KnowledgeItem[]> {
  const terms = buildTerms(query);
  const intents = detectKnowledgeIntents(query);

  if (!terms.length) {
    const semanticResults = await searchCADELIBORAKnowledgeSemantic(query, limit);

    return semanticResults
      .filter((item) => item.similarity >= 0.32)
      .map((item) => ({
        source: item.source,
        id: item.sourceId,
        title: item.title,
        content: item.content,
      }))
      .slice(0, limit);
  }

  const technology = await prisma.technology.findMany({
    where: {
      isPublished: true,
      OR: terms.flatMap((term) => [
        { name: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]),
    },
    take: 6,
    orderBy: [
      { featured: 'desc' },
      { sortOrder: 'asc' },
    ],
  });

  const domains = await prisma.technologyDomain.findMany({
    where: {
      isPublished: true,
      OR: terms.flatMap((term) => [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]),
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
  });

  const stack = await prisma.technologyStack.findMany({
    where: {
      isPublished: true,
      OR: terms.flatMap((term) => [
        { name: { contains: term, mode: 'insensitive' } },
        { type: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]),
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
  });

  const sections = await prisma.technologySection.findMany({
    where: {
      isPublished: true,
      OR: terms.flatMap((term) => [
        { sectionKey: { contains: term, mode: 'insensitive' } },
        { title: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
      ]),
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
  });

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      OR: terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]),
    },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        take: 5,
      },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const researchProjects = await prisma.researchProject.findMany({
    where: {
      OR: terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' } },
        { area: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]),
    },
    include: {
      publications: {
        orderBy: { year: 'desc' },
        take: 3,
      },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const innovations = await prisma.innovationConcept.findMany({
    where: {
      OR: terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { conceptStage: { contains: term, mode: 'insensitive' } },
        { summary: { contains: term, mode: 'insensitive' } },
        { fullDetails: { contains: term, mode: 'insensitive' } },
      ]),
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  // Broad intent fallback:
  // If the user is asking generally about courses, research,
  // or innovations, return the actual records even when the
  // wording does not match database fields directly.
  if (
    intents.includes('technology') &&
    /\b(stack|stacks)\b/i.test(query) &&
    stack.length === 0
  ) {
    const fallbackStack = await prisma.technologyStack.findMany({
      where: {
        isPublished: true,
      },
      take: 6,
      orderBy: { sortOrder: 'asc' },
    });

    stack.push(...fallbackStack);
  }

  if (
    intents.includes('technology') &&
    !/\b(stack|stacks)\b/i.test(query) &&
    technology.length === 0
  ) {
    const fallbackTechnology = await prisma.technology.findMany({
      where: {
        isPublished: true,
      },
      take: 6,
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
      ],
    });

    technology.push(...fallbackTechnology);
  }

  if (intents.includes('course') && courses.length === 0) {
    const fallbackCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          take: 5,
        },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    courses.push(...fallbackCourses);
  }

  if (intents.includes('research') && researchProjects.length === 0) {
    const fallbackResearchProjects =
      await prisma.researchProject.findMany({
        include: {
          publications: {
            orderBy: { year: 'desc' },
            take: 3,
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

    researchProjects.push(...fallbackResearchProjects);
  }

  if (intents.includes('innovation') && innovations.length === 0) {
    const fallbackInnovations =
      await prisma.innovationConcept.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

    innovations.push(...fallbackInnovations);
  }

  const results: KnowledgeItem[] = [];

  for (const item of technology) {
    results.push({
      source: 'Technology',
      id: item.id,
      title: item.name,
      content: [
        `Category: ${item.category}`,
        `Description: ${item.description}`,
        item.version ? `Version: ${item.version}` : '',
        item.websiteUrl ? `Website: ${item.websiteUrl}` : '',
        item.docsUrl ? `Documentation: ${item.docsUrl}` : '',
      ].filter(Boolean).join('\n'),
    });
  }

  for (const item of domains) {
    results.push({
      source: 'Technology Domain',
      id: item.id,
      title: item.name,
      content: item.description,
    });
  }

  for (const item of stack) {
    results.push({
      source: 'Technology Stack',
      id: item.id,
      title: item.name,
      content: [
        `Type: ${item.type}`,
        item.description ? `Description: ${item.description}` : '',
      ].filter(Boolean).join('\n'),
    });
  }

  for (const item of sections) {
    results.push({
      source: 'Technology Section',
      id: item.id,
      title: item.title,
      content: item.content,
    });
  }

  for (const course of courses) {
    const lessons = course.lessons
      .map((lesson) => `Lesson ${lesson.order}: ${lesson.title}\n${lesson.content}`)
      .join('\n\n');

    results.push({
      source: 'Academy Course',
      id: course.id,
      title: course.title,
      content: [
        `Category: ${course.category}`,
        `Level: ${course.level}`,
        `Duration: ${course.duration}`,
        `Description: ${course.description}`,
        lessons,
      ].filter(Boolean).join('\n'),
    });
  }

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

    results.push({
      source: 'Research Project',
      id: project.id,
      title: project.title,
      content: [
        `Area: ${project.area}`,
        `Status: ${project.status}`,
        `Years: ${project.startYear}${project.endYear ? `-${project.endYear}` : ''}`,
        `Description: ${project.description}`,
        publications,
      ].filter(Boolean).join('\n'),
    });
  }

  for (const item of innovations) {
    results.push({
      source: 'Innovation',
      id: item.id,
      title: item.title,
      content: [
        `Category: ${item.category}`,
        `Stage: ${item.conceptStage}`,
        `Summary: ${item.summary}`,
        `Details: ${item.fullDetails}`,
      ].join('\n'),
    });
  }

  const semanticResults = await searchCADELIBORAKnowledgeSemantic(
    query,
    Math.min(limit * 2, 20)
  );

  const candidates = new Map<
    string,
    KnowledgeItem & { score: number }
  >();

  // Add structured database results.
  for (const item of results) {
    const key = `${item.source}:${item.id}`;

    const score =
      0.25 +
      getIntentPriority(intents, item.source) * 0.50 +
      getExactMatchBonus(terms, item.title);

    candidates.set(key, {
      ...item,
      score,
    });
  }

  // Add semantic results and combine their similarity with intent.
  for (const item of semanticResults) {
    if (item.similarity < 0.20) continue;

    const key = `${item.source}:${item.sourceId}`;

    const score =
      item.similarity +
      getIntentPriority(intents, item.source) * 0.50 +
      getExactMatchBonus(terms, item.title);

    const existing = candidates.get(key);

    if (!existing || score > existing.score) {
      candidates.set(key, {
        source: item.source,
        id: item.sourceId,
        title: item.title,
        content: item.content,
        score,
      });
    }
  }

  const rankedCandidates = [...candidates.values()]
    .sort((a, b) => b.score - a.score);

  // For multi-intent questions, reserve space for each
  // explicitly requested knowledge area before filling
  // the remaining slots by overall score.
  const selected = new Map<
    string,
    KnowledgeItem & { score: number }
  >();

  const explicitIntents = intents.filter(
    (intent) => intent !== 'general'
  );

  if (explicitIntents.length > 1) {
    for (const intent of explicitIntents) {
      const allowedSources = getSourcesForIntent(intent);

      for (const source of allowedSources) {
        if (selected.size >= limit) break;

        const match = rankedCandidates.find(
          (item) =>
            item.source === source &&
            !selected.has(`${item.source}:${item.id}`)
        );

        if (match) {
          selected.set(`${match.source}:${match.id}`, match);
        }
      }
    }
  }

  if (explicitIntents.length === 1) {
    const intent = explicitIntents[0];
    const allowedSources = getSourcesForIntent(intent);

    for (const source of allowedSources) {
      if (selected.size >= limit) break;

      const match = rankedCandidates.find(
        (item) =>
          item.source === source &&
          !selected.has(`${item.source}:${item.id}`)
      );

      if (match) {
        selected.set(`${match.source}:${match.id}`, match);
      }
    }
  }

  for (const item of rankedCandidates) {
    if (selected.size >= limit) break;

    const key = `${item.source}:${item.id}`;

    if (!selected.has(key)) {
      selected.set(key, item);
    }
  }

  return [...selected.values()]
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item);
}
