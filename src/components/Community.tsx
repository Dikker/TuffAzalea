import React, { useState, useEffect } from 'react';
import { UserProfile, UserContribution } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, MoreHorizontal, UserCheck, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommunityProps {
  user: UserProfile | null;
  posts: UserContribution[];
}

const Community: React.FC<CommunityProps> = ({ user, posts }) => {
  const [newPostText, setNewPostText] = useState('');
  const [localPosts, setLocalPosts] = useState<any[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('cleanpin_community_posts');
    if (savedPosts) {
      try {
        setLocalPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error('Error parsing community posts', e);
      }
    }
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const post = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user?.displayName || 'Anonymous',
      userAvatar: user?.photoURL,
      content: newPostText,
      image: null,
      likes: 0,
      comments: 0,
      time: 'Just now',
      verified: user?.level && user.level > 10,
      isNew: true,
      timestamp: Date.now()
    };

    const updatedPosts = [post, ...localPosts];
    setLocalPosts(updatedPosts);
    localStorage.setItem('cleanpin_community_posts', JSON.stringify(updatedPosts));
    setNewPostText('');
  };

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Create Post */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-border shadow-sm">
        <div className="flex space-x-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xs border border-primary/10 overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} alt={user.displayName} /> : getInitials(user?.displayName)}
          </div>
          <form onSubmit={handlePostSubmit} className="flex-1">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`What's happening in Sampaloc, ${user?.displayName.split(' ')[0]}?`}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none h-24"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <button type="button" className="p-2 hover:bg-muted rounded-xl text-slate-500 transition-colors flex items-center space-x-2 text-xs font-bold">
                  <ImageIcon size={18} className="text-emerald-500" />
                  <span>Photo</span>
                </button>
                <button type="button" className="p-2 hover:bg-muted rounded-xl text-slate-500 transition-colors flex items-center space-x-2 text-xs font-bold">
                  <MapPin size={18} className="text-blue-500" />
                  <span>Location</span>
                </button>
              </div>
              <button 
                type="submit"
                disabled={!newPostText.trim()}
                className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold shadow-post active:scale-95 transition-all disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Social Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {localPosts.map((post) => (
            <motion.div
              initial={post.isNew ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              key={post.id}
              className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xs border border-primary/20 overflow-hidden">
                    {post.userAvatar ? <img src={post.userAvatar} className="w-full h-full object-cover" /> : getInitials(post.userName)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h4 className="text-sm font-bold text-slate-800">{post.userName}</h4>
                      {post.verified && <UserCheck size={14} className="text-primary" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{post.time}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-2">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-4">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>

              {post.image && (
                <div className="aspect-[16/9] bg-slate-100 border-y border-border">
                  <img src={post.image} className="w-full h-full object-cover" alt="Post attachment" />
                </div>
              )}

              {/* Footer / Actions */}
              <div className="p-3 border-t border-slate-50 flex items-center justify-around">
                <button className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors p-2 text-xs font-bold">
                  <Heart size={18} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-slate-500 hover:text-primary transition-colors p-2 text-xs font-bold">
                  <MessageCircle size={18} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-500 transition-colors p-2 text-xs font-bold">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;
