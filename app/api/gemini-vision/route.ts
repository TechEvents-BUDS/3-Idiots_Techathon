import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
   const formData = await req.formData();
   const image = formData.get("image") as File;

   if (!image) return new NextResponse("No image provided", { status: 400 });

   try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const imageParts = [
         {
            inlineData: {
               data: Buffer.from(await image.arrayBuffer()).toString('base64'),
               mimeType: image.type,
            },
         },
      ]

      const result = await model.generateContent([
         'Analyze this medical report image and provide a summary of the key findings. If it\'s not a medical report, describe what you see in the image.',
         ...imageParts,
      ])
      const response = result.response.text()

      return new NextResponse(JSON.stringify({ response }), {
         headers: { 'Content-Type': 'application/json' },
      })
   } catch (error) {
      console.error("Error processing image", error);
      return new NextResponse("Error processing image", { status: 500 });
   };
}