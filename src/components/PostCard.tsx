import React from 'react';
import { MapPin, Clock, ExternalLink, MoreVertical, ThumbsUp, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UserContribution } from '../types';

interface PostCardProps {
  post: UserContribution;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const isFlagged = post.aiVerification && !post.aiVerification.authentic;

  return (
    <div className={`bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${isFlagged ? "border-red-200 shadow-xs ring-1 ring-red-100 bg-red-50/10" : ""}`}>
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {post.userName.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{post.userName}</h4>
            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground">
              <span className="flex items-center"><Clock size={10} className="mr-0.5" /> {formatDistanceToNow(post.createdAt)} ago</span>
              <span>•</span>
              <span className="flex items-center text-primary font-medium hover:underline cursor-pointer">
                <MapPin size={10} className="mr-0.5" /> View on Map
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Post Image */}
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        <img 
          src={post.imageUrl} 
          alt="Waste reported" 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isFlagged ? "grayscale opacity-80" : ""}`} 
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold text-primary shadow-sm">
          {post.status.toUpperCase()}
        </div>
        {isFlagged && (
          <div className="absolute inset-x-0 bottom-0 py-1.5 bg-[#ef4444] backdrop-blur-xs flex items-center justify-center text-white font-mono font-bold text-[9px] tracking-wider uppercase shadow-md select-none">
            ⚠️ TROLL REPORT FLAGGED BY GEMINI AI
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.description}</p>

        {post.aiVerification && (
          <div className={`p-3 rounded-lg border-l-4 text-xs mb-4 leading-normal shadow-sm flex flex-col gap-1.5 ${
            post.aiVerification.authentic 
              ? "bg-[#f0fdf4] border-[#10b981] text-[#064e3b] border-t border-r border-b border-[#d1fae5]" 
              : "bg-[#fef2f2] border-[#ef4444] text-[#7f1d1d] border-t border-r border-b border-[#fee2e2]"
          }`}>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px]">
              <span className={`w-1.5 h-1.5 rounded-full ${post.aiVerification.authentic ? "bg-[#10b981]" : "bg-[#ef4444]"}`} />
              <span>{post.aiVerification.authentic ? "🤖 Gemini AI Verified" : "⚠️ Gemini AI Flagged"}</span>
              <span className="text-[10px] opacity-75 font-mono normal-case">({post.aiVerification.score}% match)</span>
            </div>
            <p className="opacity-95 text-[11px] leading-snug">{post.aiVerification.reason}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1.5 text-slate-500 hover:text-primary transition-colors">
              <ThumbsUp size={16} />
              <span className="text-xs font-semibold">Support</span>
            </button>
            <button className="flex items-center space-x-1.5 text-slate-500 hover:text-primary transition-colors">
              <MessageCircle size={16} />
              <span className="text-xs font-semibold">Discuss</span>
            </button>
          </div>
          
          <button className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center space-x-1 transition-colors">
             <ExternalLink size={12} />
             <span>SHARE REPORT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
