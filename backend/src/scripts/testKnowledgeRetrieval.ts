import { retrieveCADELIBORAKnowledge } from '../ai/aiKnowledge.js';

async function main() {
  const tests = [
    {
      query: 'What technology and research work does CADELIBORA have?',
      expectedSources: ['Technology', 'Technology Domain', 'Research Project'],
    },
    {
      query: 'Which courses can I study?',
      expectedSources: ['Academy Course'],
    },
    {
      query: 'What innovations are being developed?',
      expectedSources: ['Innovation'],
    },
    {
      query: 'What research projects are available?',
      expectedSources: ['Research Project'],
    },
    {
      query: 'What technologies does CADELIBORA use?',
      expectedSources: ['Technology', 'Technology Domain', 'Technology Stack'],
    },
    {
      query: 'Tell me about Python.',
      expectedSources: ['Technology'],
    },
    {
      query: 'What is in the technology stack?',
      expectedSources: ['Technology Stack'],
    },
  ];

  for (const test of tests) {
    const { query, expectedSources } = test;
    console.log('\n========================================');
    console.log(`QUESTION: ${query}`);
    console.log('========================================');

    const results = await retrieveCADELIBORAKnowledge(query, 5);

    for (const [index, item] of results.entries()) {
      console.log(`\n${index + 1}. [${item.source}] ${item.title}`);
      console.log(item.content.slice(0, 300));
    }

    console.log(`\nResults returned: ${results.length}`);

    const foundSources = new Set(results.map((item) => item.source));
    const missingSources = expectedSources.filter(
      (source) => !foundSources.has(source)
    );

    if (missingSources.length === 0) {
      console.log('STATUS: PASS');
    } else {
      console.log(
        `STATUS: CHECK - Missing expected source(s): ${missingSources.join(', ')}`
      );
    }
  }
}

main().catch((error) => {
  console.error('Knowledge retrieval test failed:', error);
  process.exit(1);
});
