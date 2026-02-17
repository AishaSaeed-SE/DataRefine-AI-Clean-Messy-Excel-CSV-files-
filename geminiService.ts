
import { GoogleGenAI, Type } from "@google/genai";
import { DataRow, TransformationStep } from "./types";

export async function interpretCommand(
  instruction: string,
  sampleRows: DataRow[],
  headers: string[]
): Promise<TransformationStep> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API_KEY is missing. Please ensure you have set the API_KEY environment variable in your deployment settings.");
  }

  // Create instance right before use as per architectural guidelines
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
      model: "gemini-1.5",
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
    
    // Check if it's a key-related error from the SDK
    if (error.message?.includes("API key")) {
      throw new Error("Invalid or missing API Key. Check your environment configuration.");
    }
    
    throw new Error(error.message || "The AI engine failed to generate safe logic. Try rephrasing your request.");
  }
}
