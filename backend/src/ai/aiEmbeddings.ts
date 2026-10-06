import { pipeline } from '@huggingface/transformers';

type EmbeddingPipeline = (
  text: string,
  options?: {
    pooling?: 'mean' | 'cls' | 'last';
    normalize?: boolean;
  }
) => Promise<any>;

let extractorPromise: Promise<EmbeddingPipeline> | null = null;

async function getExtractor(): Promise<EmbeddingPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    ) as unknown as Promise<EmbeddingPipeline>;
  }

  return extractorPromise;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data as Float32Array);
}
