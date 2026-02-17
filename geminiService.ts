
import { GoogleGenAI, Type } from "@google/genai";
import { DataRow, TransformationStep } from "./types";

export async function interpretCommand(
  instruction: string,
  sampleRows: DataRow[],
  headers: string[]
): Promise<TransformationStep> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a expert senior data engineer. I have a dataset with these headers: ${headers.join(", ")}.
    The user wants to perform this cleaning task: "${instruction}".
    
    Sample of the first few rows:
    ${JSON.stringify(sampleRows, null, 2)}

    Your task is to generate a JavaScript function body.
    Context:
    - The function signature is (row, index, allRows).
    - 'row' is the current object.
    - 'allRows' is the entire array of objects (useful for calculating averages, sums, etc.).
    - You must return the transformed object, or 'null' to remove the row.
    - DO NOT use external libraries. Use standard Math, String, Number methods.
    
    Special Requirement Handling:
    - If the user asks for averages/stats, calculate them using 'allRows' at the start of your code block.
    - Ensure numeric conversions handle commas, currency symbols, and text like "NAN".
    - Always return a new object or a copy (e.g., { ...row, newProp: val }).
    
    Return a JSON object:
    {
      "type": "RENAME_COLUMN | MAP_VALUES | FILTER | EXTRACT | FORMAT | CUSTOM",
      "description": "Short summary of logic",
      "jsLogic": "The code inside the function. Example: const avg = ...; return { ...row, col: row.col || avg };"
    }

    Validation:
    - If you are calculating an average of a column, make sure to filter out non-numeric values from allRows before dividing.
    - Use Math.round() for integer averages if requested.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          description: { type: Type.STRING },
          jsLogic: { type: Type.STRING },
        },
        required: ["type", "description", "jsLogic"],
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not interpret command. Please try being more specific.");
  }
}
