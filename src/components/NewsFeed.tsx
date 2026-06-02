import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Share2 } from 'lucide-react';
import { NewsItem } from '../types';
import { format } from 'date-fns';

interface NewsFeedProps {
  onShareArticle?: (title: string, id: string) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ onShareArticle }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharedIds, setSharedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cleanpin_news_shares') || '[]');
    } catch {
      return [];
    }
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
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

  const handleShare = (id: string, title: string) => {
    if (sharedIds.includes(id)) return;
    const newShares = [...sharedIds, id];
    setSharedIds(newShares);
    localStorage.setItem('cleanpin_news_shares', JSON.stringify(newShares));
    if (onShareArticle) {
      onShareArticle(title, id);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-4 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-secondary rounded-lg text-primary">
            <Newspaper size={16} />
          </div>
          <h2 className="font-display font-bold text-sm text-[#064e3b]">Daily News Feed (SDG 11)</h2>
        </div>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar min-h-0">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-2.5 bg-muted rounded w-full" />
            </div>
          ))
        ) : (
          news.map((item) => (
            <div key={item.id} className="group p-2.5 rounded-xl bg-muted/60 hover:bg-secondary/40 transition-all border border-border/40 hover:border-primary/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-bold text-primary-dark tracking-widest uppercase">{item.source}</span>
                  <span className="text-[8px] text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="font-bold text-xs leading-snug mb-1 text-[#064e3b]">{item.title}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-2">{item.summary}</p>
              </div>
              
              <div className="flex justify-end items-center">
                <button
                  type="button"
                  onClick={() => handleShare(item.id, item.title)}
                  disabled={sharedIds.includes(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-bold transition-all ${
                    sharedIds.includes(item.id)
                      ? "bg-emerald-100 text-[#166534] scale-95 cursor-default font-medium"
                      : "bg-primary text-white hover:bg-primary-dark cursor-pointer shadow-xs active:scale-95"
                  }`}
                >
                  <Share2 size={10} />
                  <span>{sharedIds.includes(item.id) ? "Advocated" : "Share News"}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
