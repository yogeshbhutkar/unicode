import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { userQuery, language, generations } = await req.json();

  const prompt = `UserPrompt: Generate a program in ${language} for the given problem. Strictly generate just the code, the description and content about the code is not required. Don't include the name of the programming language or ''' anywhere. Strictly don't include any Notes, definitons or comments. Generate ${generations} different codes with different approaches and out of the ${generations}, write the best approach for it at the bottom separated by <--- Most Accurate Code --->.`;

  const geminiStream = await genAI
    .getGenerativeModel({ model: "gemini-pro" })
    .generateContentStream([userQuery, prompt]);

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
