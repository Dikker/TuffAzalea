import React from 'react';
import { MapPin, Clock, ExternalLink, MoreVertical, ThumbsUp, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UserContribution } from '../types';

interface PostCardProps {
  post: UserContribution;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
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
        <img src={post.imageUrl} alt="Waste reported" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold text-primary shadow-sm">
          {post.status.toUpperCase()}
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.description}</p>
        
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
