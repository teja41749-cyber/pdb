import { Molecule, ScreeningResult } from '../types';
import { MOCK_HITS } from '../constants';

const BACKEND_URL = 'http://localhost:8000/calculate-similarity';

export const calculateSimilarity = async (smiles: string): Promise<ScreeningResult> => {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ smiles }),
    });

    if (!response.ok) {
      throw new Error('Backend error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Backend not reachable. Using mock data for demonstration.", error);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple mock logic: if query is Aspirin, return generic mock. 
    // Otherwise randomize scores slightly to show interaction.
    const mockHits = MOCK_HITS.map(hit => ({
      ...hit,
      score: hit.smiles === smiles ? 1.0 : Math.random() * 0.5
    })).sort((a, b) => b.score - a.score);

    return { hits: mockHits };
  }
};
