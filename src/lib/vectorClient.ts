/**
 * Qdrant Vector Database & HuggingFace Embedding Client
 */

const QDRANT_URL = process.env.QDRANT_URL || '';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

const COLLECTION_NAME = 'docfin_documents';
const VECTOR_SIZE = 384; // all-MiniLM-L6-v2 vector dimension

/**
 * Generate 384-dim dense embedding using HuggingFace Inference API with deterministic fallback
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text.slice(0, 1000)
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && typeof data[0] === 'number') {
        return data as number[];
      }
      if (Array.isArray(data) && Array.isArray(data[0])) {
        return data[0] as number[];
      }
    }
  } catch (err) {
    console.warn('HuggingFace embedding notice:', err);
  }

  // Deterministic local vector generator (384 floats) for fallback
  const vector: number[] = new Array(VECTOR_SIZE).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const idx = (charCode * 31 + i) % VECTOR_SIZE;
    vector[idx] = (vector[idx] + Math.sin(charCode + i)) / 2;
  }
  // Normalize vector
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

/**
 * Ensure Qdrant collection exists
 */
export async function ensureQdrantCollection() {
  if (!QDRANT_URL) return;
  try {
    const checkRes = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
      method: 'GET',
      headers: {
        'api-key': QDRANT_API_KEY
      }
    });

    if (checkRes.status === 404 || !checkRes.ok) {
      // Create collection
      await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
        method: 'PUT',
        headers: {
          'api-key': QDRANT_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vectors: {
            size: VECTOR_SIZE,
            distance: 'Cosine'
          }
        })
      });
    }
  } catch (err) {
    console.warn('Qdrant collection setup notice:', err);
  }
}

/**
 * Index document chunks into Qdrant Vector Database
 */
export async function indexDocumentInQdrant(
  docId: string,
  docName: string,
  chunks: { page: number; text: string }[]
) {
  if (!QDRANT_URL) return false;
  try {
    await ensureQdrantCollection();

    const points = await Promise.all(
      chunks.map(async (chunk, idx) => {
        const vector = await generateEmbedding(chunk.text);
        // Generate a 32-bit integer or UUID point ID
        const pointId = Math.abs((docId.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) + idx * 1000) % 2147483647) || (idx + 1);

        return {
          id: pointId,
          vector,
          payload: {
            docId,
            docName,
            page: chunk.page,
            text: chunk.text
          }
        };
      })
    );

    const upsertRes = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`, {
      method: 'PUT',
      headers: {
        'api-key': QDRANT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        points
      })
    });

    return upsertRes.ok;
  } catch (err) {
    console.warn('Qdrant vector indexing notice:', err);
    return false;
  }
}

/**
 * Search Qdrant vector database for top matching document chunks
 */
export async function searchQdrantVectors(
  query: string,
  docId?: string,
  limit = 3
): Promise<{ page: number; text: string; score: number }[]> {
  if (!QDRANT_URL) return [];
  try {
    const queryVector = await generateEmbedding(query);

    const body: Record<string, unknown> = {
      vector: queryVector,
      limit,
      with_payload: true
    };

    if (docId) {
      body.filter = {
        must: [
          {
            key: 'docId',
            match: { value: docId }
          }
        ]
      };
    }

    const searchRes = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`, {
      method: 'POST',
      headers: {
        'api-key': QDRANT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.result && Array.isArray(data.result)) {
        return data.result.map((r: { payload?: { page?: number; text?: string }; score?: number }) => ({
          page: r.payload?.page || 1,
          text: r.payload?.text || '',
          score: r.score || 0
        }));
      }
    }
  } catch (err) {
    console.warn('Qdrant vector search notice:', err);
  }

  return [];
}
