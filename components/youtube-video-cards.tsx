import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export interface YouTubeVideo {
  title: string;
  url: string;
  thumbnail: string;
}

interface YouTubeVideoCardsProps {
  videos: YouTubeVideo[];
}

export const YouTubeVideoCards: React.FC<YouTubeVideoCardsProps> = ({ videos }) => {
  // Truncate title if it's too long
  const truncateTitle = (title: string, maxLength: number = 70) => {
    return title.length > maxLength 
      ? `${title.substring(0, maxLength)}...` 
      : title;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map((video, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-shadow duration-300 flex flex-col"
        >
          <div className="relative">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-white/80 rounded-full p-2 hover:bg-white"
            >
              <ExternalLink size={20} className="text-gray-700" />
            </a>
          </div>
          
          <CardContent className="flex-grow p-4">
            <h3 className="font-semibold text-sm text-gray-800">
              {truncateTitle(video.title)}
            </h3>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                Watch Video
              </button>
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};