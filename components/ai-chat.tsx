import { useEffect, useRef, useState } from 'react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'
import { Message } from './pdf-report'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const AIChat = () => {
   const [messages, setMessages] = useState<Message[]>([])
   const [input, setInput] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
   const scrollAreaRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (scrollAreaRef.current) {
         scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      }
   }, [messages])

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === '' || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/medical-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.response }])
    } catch (err) {
      console.error('Chat error:', err)
      setError('An error occurred while fetching the response. Please try again.')
    } finally {
      setIsLoading(false)
    }
   }

   return (
      <Card className="w-full max-w-2xl mx-auto">
         <CardHeader>
            <CardTitle>Medical AI Assistant</CardTitle>
            <CardDescription>Ask questions about medical topics and get AI-powered answers.</CardDescription>
         </CardHeader>
         <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
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
               {isLoading && (
                  <div className="text-gray-500 animate-pulse">AI is thinking...</div>
               )}
               {error && (
                  <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                  </Alert>
               )}
            </ScrollArea>
         </CardContent>
         <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
               <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a medical question..."
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