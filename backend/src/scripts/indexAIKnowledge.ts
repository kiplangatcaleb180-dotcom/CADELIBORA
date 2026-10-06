import { indexCADELIBORAKnowledge } from '../ai/aiKnowledgeIndexer.js';

async function main() {
  console.log('ANR-X: starting CADELIBORA knowledge indexing...');

  const result = await indexCADELIBORAKnowledge();

  console.log('\nANR-X: knowledge indexing complete.');
  console.log(`Total documents: ${result.total}`);
  console.log(`Created: ${result.created}`);
  console.log(`Updated: ${result.updated}`);
  console.log(`Unchanged: ${result.unchanged}`);
}

main().catch((error) => {
  console.error('ANR-X: knowledge indexing failed.');

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exit(1);
});
