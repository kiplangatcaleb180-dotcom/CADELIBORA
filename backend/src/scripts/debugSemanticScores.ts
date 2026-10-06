import { searchCADELIBORAKnowledgeSemantic } from '../ai/aiKnowledgeSemantic.js';

async function main() {
  const queries = [
    'Which courses can I study?',
    'What innovations are being developed?',
    'What research projects are available?',
  ];

  for (const query of queries) {
    console.log('\n========================================');
    console.log(`QUESTION: ${query}`);
    console.log('========================================');

    const results = await searchCADELIBORAKnowledgeSemantic(query, 10);

    for (const [index, item] of results.entries()) {
      console.log(
        `${index + 1}. score=${item.similarity.toFixed(4)} | ` +
        `source=${item.source} | title=${item.title}`
      );
    }
  }
}

main().catch((error) => {
  console.error('Semantic score debugging failed:', error);
  process.exit(1);
});
