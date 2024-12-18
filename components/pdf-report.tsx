import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-separator";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

import { formatMessage } from "@/lib/formatMessage";

export type Message = {
   role: "user" | "ai";
   content: string;
};

export const PDFReport = () => {
   const [file, setFile] = useState<File | null>(null);
   const [fileUrl, setFileUrl] = useState<string | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (selectedFile) {
         setFile(selectedFile)
         const url = URL.createObjectURL(selectedFile)
         setFileUrl(url)
         // Send the image to Gemini API when it's uploaded
         handleImageUpload(selectedFile)
      };
   };

   const handleImageUpload = async (file: File) => {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('image', file)

      try {
         const response = await fetch('/api/gemini-vision', {
            method: 'POST',
            body: formData,
         })

         if (!response.ok) {
            throw new Error('Failed to analyze image')
         }

         const data = await response.json()
         setMessages([
            { role: 'ai', content: 'Image uploaded successfully. Here\'s what I see:' },
            { role: 'ai', content: data.response },
         ])
      } catch (error) {
         console.error('Error uploading image:', error)
         setMessages([{ role: 'ai', content: 'Error analyzing the image. Please try again.' }])
      } finally {
         setIsLoading(false)
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const userMessage = { role: 'user' as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
         const response = await fetch('/api/gemini-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [...messages, userMessage] }),
         });

         if (!response.ok) {
           throw new Error('Failed to get response')
         }

         const data = await response.json()
         setMessages(prev => [...prev, { role: 'ai', content: data.response }])
      } catch (error) {
         console.error('Error getting response:', error);
         setMessages(prev => [...prev, { role: 'ai', content: 'Error getting response. Please try again.' }]);
      } finally {
         setIsLoading(false);
      };
   };

   return (
      <Card className="w-full max-w-4xl mx-auto">
         <CardHeader>
            <CardTitle>Medical Report Analysis</CardTitle>
         <CardDescription>Upload your medical report and chat with our AI about it</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="grid gap-6">
            <div className="flex flex-col space-y-2">
               <Label htmlFor="report-upload">Upload Medical Report (Image only)</Label>
               <Input
                  id="report-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
               />
            </div>
            {fileUrl && (
               <div className="flex flex-col space-y-2">
                  <Label>Uploaded Report</Label>
                  <img src={fileUrl} alt="Uploaded report" className="max-w-full h-auto rounded-md" />
               </div>
            )}
            {fileUrl && (
               <>
                  <Separator />
                  <div className="flex flex-col space-y-2">
                     <Label>Chat with AI about your report</Label>
                     <ScrollArea className="h-[300px] w-full border rounded-md p-4">
                        {messages.map((message, index) => (
                        <div key={index} className={`mb-4 ${message.role === 'ai' ? 'text-blue-600' : 'text-green-600'}`}>
                           <strong>{message.role === 'ai' ? 'AI: ' : 'You: '}</strong>
                           {formatMessage(message.content)}
                        </div>
                        ))}
                        {isLoading && <div className="text-gray-500">AI is thinking...</div>}
                     </ScrollArea>
                     <form onSubmit={handleSubmit} className="flex space-x-2">
                        <Input
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           placeholder="Ask about your report..."
                           className="flex-grow"
                           disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>Send</Button>
                     </form>
                  </div>
               </>
            )}
         </div>
      </CardContent>
    </Card>
   )
};