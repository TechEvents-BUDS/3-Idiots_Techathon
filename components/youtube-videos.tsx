import { useState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from './pdf-report';
import { YouTubeVideo, YouTubeVideoCards } from './youtube-video-cards';

export const YoutubeVideos = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [videos, setVideos] = useState<YouTubeVideo[]>([]);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const response = await fetch('/api/get-yt-vids', {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ input }),
         });

         if (!response.ok) {
            throw new Error('Failed to get response from AI')
         }

         const data = await response.json();

         setVideos(data.videos);
         setMessages(prevMessages => [
            ...prevMessages,
            { role: 'user', content: input },
         ]);
      } catch (error) {
         console.error('Chat error:', error)
      } finally {
         setIsLoading(false);
         setInput("");
      }
   };

   return (
      <Card className='w-full max-w-2xl mx-auto'>
         <CardHeader>
            <CardTitle>Youtube Videos</CardTitle>
            <CardDescription>Ask about medical terms, keywords and get youtube videos in return.</CardDescription>
         </CardHeader>
         <CardContent>
            <ScrollArea className='h-[400px] w-full pr-4'>
               {messages.map((message, index) => (
                  <div
                     key={index}
                     className={`mb-4 ${
                        message.role === 'ai' ? 'text-blue-600' : 'text-green-600'
                     }`}
                  >
                     <strong>{message.role === 'ai' ? 'AI: ' : 'You: '}</strong>
                     {message.content}
                  </div>
               ))}

               {/* Render YouTube Video Cards */}
               {videos.length > 0 && (
                  <div className="mt-4">
                     <h3 className="text-lg font-semibold mb-4">Related YouTube Videos</h3>
                     <YouTubeVideoCards videos={videos} />
                  </div>
               )}

               {isLoading && (
                  <div className="text-gray-500 animate-pulse">Finding videos...</div>
               )}
            </ScrollArea>
         </CardContent>
         <CardFooter>
            <form onSubmit={handleSubmit} className='flex w-full space-x-2'>
               <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a medical term or related youtube videos..."
                  className="flex-grow"
               />
               <Button type="submit" disabled={isLoading || input.trim() === ''}>
                  Send
               </Button>
            </form>
         </CardFooter>
      </Card>
   )
};