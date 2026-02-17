
import { GoogleGenAI, Type } from "@google/genai";
import { DataRow, TransformationStep } from "./types";

export async function interpretCommand(
  instruction: string,
  sampleRows: DataRow[],
  headers: string[]
): Promise<TransformationStep> {
  // Use the environment variable injected by Vite
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API Key is missing. Ensure API_KEY is set in Vercel Environment Variables and that you have REDEPLOYED the app.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are a world-class Senior Data Engineer specializing in functional programming and data cleansing.
    
    DATASET CONTEXT:
    - Headers: ${headers.join(", ")}
    - Sample Data: ${JSON.stringify(sampleRows)}

    USER REQUEST: "${instruction}"

    TASK:
    Generate a JavaScript function body that accepts (row, index, allRows) and returns a transformed row object or null.
    
    CONSTRAINTS:
    1. Use only ES6+ standard methods.
    2. Handle edge cases (nulls, undefined, NaN, formatted currency/numbers).
    3. Return a brand new object to avoid mutation side effects.
    4. For filtering, return null if the row should be excluded.
    5. Ensure the returned object keys match the original headers unless the instruction is to rename or add/remove columns.

    OUTPUT FORMAT:
    You must return a valid JSON object matching the requested schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a precise code-generation engine for data transformations. Output only valid JSON with executable, safe JavaScript logic.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              description: "The category of transformation (e.g., RENAME_COLUMN, FILTER, CUSTOM)" 
            },
            description: { 
              type: Type.STRING, 
              description: "A human-readable explanation of what the generated code does" 
            },
            jsLogic: { 
              type: Type.STRING, 
              description: "The JavaScript code inside the function body. Do not include function wrappers." 
            },
          },
          required: ["type", "description", "jsLogic"],
        },
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    
    if (!result.jsLogic || result.jsLogic.length < 2) {
      throw new Error("Generated logic was empty.");
    }
    
    return result;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw new Error(error.message || "Transformation generation failed.");
  }
}
