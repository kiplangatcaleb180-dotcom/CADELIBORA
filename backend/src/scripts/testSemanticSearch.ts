import { searchCADELIBORAKnowledgeSemantic } from '../ai/aiKnowledgeSemantic.js';

async function main() {
  const results = await searchCADELIBORAKnowledgeSemantic(
    'What technology and research work does CADELIBORA have?',
    5
  );

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error('Semantic search test failed.');

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exit(1);
});
