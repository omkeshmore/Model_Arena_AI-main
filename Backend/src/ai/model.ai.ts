import "dotenv/config"
import {initChatModel} from "langchain"

export const geminiModel = await initChatModel("google-genai:gemini-flash-latest");
export const mistralModel = await initChatModel("mistralai:mistral-medium-latest");
export const cohereModel = await initChatModel("cohere:command-a-03-2025");