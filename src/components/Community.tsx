import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserContribution } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, MoreHorizontal, UserCheck, MapPin, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommunityProps {
  user: UserProfile | null;
  posts: UserContribution[];
}

interface CommunityPost {
  id: string;
  userName: string;
  userAvatar?: string;
  content: string;
  image?: string | null;
  location?: string | null;
  likes: number;
  comments: number;
  time: string;
  verified: boolean;
  isNew?: boolean;
  timestamp: number;
  likedBy?: string[]; // Array of user UIDs who liked the post
}

const Community: React.FC<CommunityProps> = ({ user, posts }) => {
  const [newPostText, setNewPostText] = useState('');
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationToggle = () => {
    if (selectedLocation) {
      setSelectedLocation(null);
    } else {
      // Mock location for now, in a real app this would use geolocation
      setSelectedLocation('Sampaloc Lake, San Pablo');
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedImage) return;

    const post: CommunityPost = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user?.displayName || 'Anonymous',
      userAvatar: user?.photoURL,
      content: newPostText,
      image: selectedImage,
      location: selectedLocation,
      likes: 0,
      comments: 0,
      time: 'Just now',
      verified: !!(user?.level && user.level > 10),
      isNew: true,
      timestamp: Date.now(),
      likedBy: []
    };

    const updatedPosts = [post, ...localPosts];
    setLocalPosts(updatedPosts);
    localStorage.setItem('cleanpin_community_posts', JSON.stringify(updatedPosts));
    setNewPostText('');
    setSelectedImage(null);
    setSelectedLocation(null);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    
    const updatedPosts = localPosts.map(post => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const isLiked = likedBy.includes(user.uid);
        
        if (isLiked) {
          return {
            ...post,
            likes: Math.max(0, post.likes - 1),
            likedBy: likedBy.filter(id => id !== user.uid)
          };
        } else {
          return {
            ...post,
            likes: post.likes + 1,
            likedBy: [...likedBy, user.uid]
          };
        }
      }
      return post;
    });
    
    setLocalPosts(updatedPosts);
    localStorage.setItem('cleanpin_community_posts', JSON.stringify(updatedPosts));
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
              placeholder={`What's happening in Sampaloc, ${user?.displayName?.split(' ')[0] || 'friend'}?`}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none h-24"
            />
            
            <AnimatePresence>
              {(selectedImage || selectedLocation) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  {selectedImage && (
                    <div className="relative group rounded-xl overflow-hidden border border-border">
                      <img src={selectedImage} alt="Selected" className="w-full h-40 object-cover" />
                      <button 
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {selectedLocation && (
                    <div className="flex items-center space-x-2 text-primary-dark bg-secondary px-3 py-1.5 rounded-lg text-[10px] font-bold w-fit">
                      <MapPin size={12} />
                      <span>{selectedLocation}</span>
                      <button type="button" onClick={() => setSelectedLocation(null)}>
                        <X size={10} className="ml-1 opacity-50 hover:opacity-100" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "p-2 hover:bg-muted rounded-xl transition-colors flex items-center space-x-2 text-xs font-bold",
                    selectedImage ? "text-emerald-600 bg-emerald-50" : "text-slate-500"
                  )}
                >
                  <ImageIcon size={18} className={cn(selectedImage ? "text-emerald-600" : "text-emerald-500")} />
                  <span className="hidden sm:inline">Photo</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleLocationToggle}
                  className={cn(
                    "p-2 hover:bg-muted rounded-xl transition-colors flex items-center space-x-2 text-xs font-bold",
                    selectedLocation ? "text-blue-600 bg-blue-50" : "text-slate-500"
                  )}
                >
                  <MapPin size={18} className={cn(selectedLocation ? "text-blue-600" : "text-blue-500")} />
                  <span className="hidden sm:inline">Location</span>
                </button>
              </div>
              <button 
                type="submit"
                disabled={!newPostText.trim() && !selectedImage}
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
                    <div className="flex items-center space-x-2 text-slate-400">
                      <p className="text-[10px] font-medium uppercase tracking-wider">{post.time}</p>
                      {post.location && (
                        <>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <div className="flex items-center space-x-1">
                            <MapPin size={10} />
                            <span className="text-[10px] font-medium">{post.location}</span>
                          </div>
                        </>
                      )}
                    </div>
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
                <button 
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center space-x-2 transition-colors p-2 text-xs font-bold",
                    user && post.likedBy?.includes(user.uid) ? "text-red-500" : "text-slate-500 hover:text-red-500"
                  )}
                >
                  <Heart size={18} fill={user && post.likedBy?.includes(user.uid) ? "currentColor" : "none"} />
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
