import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '@/components/pdf-report';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
   const { messages } = await req.json();

   try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const filteredMessages = messages.reduce((acc: Message[], msg: Message) => {
         if (acc.length === 0 && msg.role === 'ai') {
            return acc;
         }
         return [...acc, msg];
      }, []);

      // If there are no user messages, return an error
      if (filteredMessages.length === 0) {
         return new NextResponse(JSON.stringify({ error: "No user messages found" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
         });
      }

      const formattedHistory = filteredMessages.slice(0, -1).map((msg: Message) => ({
         role: msg.role === "user" ? "user" : "model",
         parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
         history: formattedHistory,
      });

      const result = await chat.sendMessage(messages[messages.length - 1].content);
      const response = await result.response.text();

      return new NextResponse(JSON.stringify({ response }), {
         headers: { "Content-Type": "application/json" },
      });
   } catch (error) {
      console.error("Error getting chat response", error);
      return new NextResponse("Error getting chat response", { status: 500 });
   }
}