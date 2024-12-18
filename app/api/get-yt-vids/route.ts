import { NextRequest, NextResponse } from "next/server";

import axios from "axios";

const ytApiKey = process.env.YT_API_KEY!;

export async function POST(req: NextRequest) {
   const { input } = await req.json();

   const updatedInput = input + " medical";

   try {
      const maxResults = 5;

      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
         params: {
            part: 'snippet',
            q: updatedInput,
            type: 'video',
            maxResults: maxResults,
            key: ytApiKey,
         },
      });

      const videos = response.data.items.map((video: any) => ({
         title: video.snippet.title,
         url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
         thumbnail: video.snippet.thumbnails.default.url,
      }))

      return NextResponse.json({ videos });
   } catch (error: any) {
      console.error('Error searching YouTube:', error);
      return new NextResponse("Error searching YouTube", error)
   };
};