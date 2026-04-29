import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Added a 'retries' parameter, defaulting to 3 attempts
const getGeminiResponse = async (message, retries = 3) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing in .env file");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
        
    } catch(err) {
        // If it's a 503 error and we still have retries left
        if (err.message.includes("503") && retries > 0) {
            console.warn(`⚠️ Google Servers busy. Retrying... (${retries} attempts left)`);
            
            // Wait for 2 seconds before trying again
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Call the function again, subtracting 1 from the retry count
            return getGeminiResponse(message, retries - 1);
        }
        
        // If it's a different error, or we ran out of retries, throw the error to the frontend
        console.error("Gemini API Call Failed:", err);
        throw err; 
    }
}

export default getGeminiResponse;