
import { GoogleGenAI } from "@google/genai";
import { Skill } from '../types';

const getApiKey = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // In a real app, you might want to handle this more gracefully.
      // For this prototype, we'll throw an error if the key is missing.
      throw new Error("API_KEY environment variable not set.");
    }
    return apiKey;
};

export const getConversationStarters = async (userSkill: Skill, partnerSkill: Skill): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const prompt = `
      You are an expert at fostering connections on a skill-sharing platform.
      Two users have just matched.
      - User A can teach "${userSkill.name}".
      - User B can teach "${partnerSkill.name}".
      
      Generate three distinct, friendly, and engaging conversation starters for User A to send to User B.
      The starters should be encouraging and focus on the mutual benefit of their skill swap.
      Frame the response as a JSON array of strings. For example: ["starter 1", "starter 2", "starter 3"]
      Do not include any other text or markdown formatting.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    const text = response.text.trim();
    const suggestions = JSON.parse(text);

    if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
      return suggestions;
    }
    
    return ["Failed to parse suggestions, please try again."];
  } catch (error) {
    console.error("Error fetching conversation starters:", error);
    // Provide fallback suggestions on error
    return [
      `Hey! I saw we matched. I'd love to learn ${partnerSkill.name} from you, and happy to teach you ${userSkill.name} in return!`,
      `Hi there! This seems like a perfect skill swap. I'm really interested in your knowledge of ${partnerSkill.name}.`,
      `This is cool, we both have something the other wants to learn! How did you get started with ${partnerSkill.name}?`
    ];
  }
};
