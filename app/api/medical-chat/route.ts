import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
   const { messages } = await req.json();

   const initialContext = 
    "You are a helpful medical AI assistant. Only answer questions related to medical topics. " +
    "If asked about non-medical topics, politely redirect the conversation to medical subjects. " +
    "Do not provide specific medical advice or diagnoses, but offer general information and encourage users to consult with healthcare professionals for personalized advice.";

   try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      // Start a chat session
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [
              { text: initialContext + "\n" + messages[0].content },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

    // Send subsequent messages
    for (let i = 1; i < messages.length; i++) {
      const message = messages[i];
      if (message.role === 'user') {
        await chat.sendMessage(message.content);
      }
    }

    // Get the final response
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const aiResponse = await result.response.text();

    return NextResponse.json({ response: aiResponse }, { status: 200 });
   } catch (error) {
      console.error('Error in medical chat API:', error)
      return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
   }
};