import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { NewsItem } from '../types';
import { format } from 'date-fns';

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate 5 daily news updates related to waste management, SDG 11, and environmental sustainability in the Philippines for " + format(new Date(), 'MMMM d, yyyy') + ". Make them sound like real headlines with short summaries.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                url: { type: Type.STRING },
                date: { type: Type.STRING },
                source: { type: Type.STRING },
              },
              required: ["id", "title", "summary", "url", "date", "source"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback data
      setNews([
        {
          id: '1',
          title: 'Manila Bay Cleanup: New Phase Begins',
          summary: 'The Department of Environment and Natural Resources announces a new intensified cleanup phase for the Manila Bay area, focused on plastic waste reduction.',
          url: '#',
          date: format(new Date(), 'MMM d, yyyy'),
          source: 'DENR News'
        },
        {
          id: '2',
          title: 'Quezon City Implements Zero-Waste Initative',
          summary: 'Quezon City local government launches a community-based composting program to reduce the volume of organic waste reaching landfills.',
          url: '#',
          date: format(new Date(), 'MMM d, yyyy'),
          source: 'LGU Updates'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-secondary rounded-lg text-primary">
            <Newspaper size={20} />
          </div>
          <h2 className="font-display font-bold text-lg">Daily News Feed</h2>
        </div>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))
        ) : (
          news.map((item) => (
            <div key={item.id} className="group p-3 rounded-xl bg-muted/60 hover:bg-secondary/40 transition-all border border-border/40 hover:border-primary/20">
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[9px] font-bold text-primary-dark tracking-widest uppercase">{item.source}</span>
                <span className="text-[9px] text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="font-bold text-xs leading-snug mb-1 text-[#064e3b]">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{item.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
