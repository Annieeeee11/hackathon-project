import { generateEmbedding } from './openaiClient'

// Type definitions
interface EmbeddingResult {
  embedding: number[];
  text: string;
  metadata?: Record<string, any>;
}

interface SimilarityResult {
  text: string;
  similarity: number;
  metadata?: Record<string, any>;
}

/**
 * Generate embeddings for text content
 */
export async function createEmbedding(text: string, metadata?: Record<string, any>): Promise<EmbeddingResult> {
  try {
    const embedding = await generateEmbedding(text);
    return {
      embedding,
      text,
      metadata
    };
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function calculateSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Find similar content based on embeddings
 */
export function findSimilarContent(
  queryEmbedding: number[],
  contentEmbeddings: EmbeddingResult[],
  threshold: number = 0.7
): SimilarityResult[] {
  const results: SimilarityResult[] = [];

  for (const content of contentEmbeddings) {
    const similarity = calculateSimilarity(queryEmbedding, content.embedding);
    
    if (similarity >= threshold) {
      results.push({
        text: content.text,
        similarity,
        metadata: content.metadata
      });
    }
  }

  // Sort by similarity (highest first)
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Batch process multiple texts to create embeddings
 */
export async function createBatchEmbeddings(
  texts: string[],
  metadata?: Record<string, any>[]
): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      const result = await createEmbedding(texts[i], metadata?.[i]);
      results.push(result);
    } catch (error) {
      console.error(`Error creating embedding for text ${i}:`, error);
      // Continue with other texts even if one fails
    }
  }

  return results;
}
