import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (message) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing in .env file");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch(err) {
        console.error("Gemini API Call Failed:", err);
        throw err; 
    }
}

export default getGeminiResponse;