import { GoogleGenAI } from "@google/genai";

export const analyzeMolecule = async (name: string, smiles: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "API Key not configured. Unable to fetch AI analysis.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Analyze the following molecule for a pharmaceutical context:
      Name: ${name}
      SMILES: ${smiles}
      
      Provide a concise 2-sentence summary covering its primary therapeutic use (if known) or chemical class, and one potential biological target.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze molecule.";
  }
};
