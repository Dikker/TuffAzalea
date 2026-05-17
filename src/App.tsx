import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Map from './components/Map';
import PostCard from './components/PostCard';
import NewsFeed from './components/NewsFeed';
import ReportModal from './components/ReportModal';
import Performance from './components/Performance';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import Community from './components/Community';
import { Plus, Target, Users } from 'lucide-react';
import { UserContribution, UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [posts, setPosts] = useState<UserContribution[]>([]);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    // Check for existing session
    const savedSession = localStorage.getItem('cleanpin_session');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('cleanpin_session');
      }
    }
  }, []);

  const handleLogin = (role: 'user' | 'admin', customName?: string, customEmail?: string) => {
    const email = (customEmail && customEmail.trim()) || (role === 'admin' ? 'admin@cleanpin.ph' : 'josegabriel@cleanpin.ph');
    
    // Check if we have an existing user structure in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('cleanpin_accounts') || '[]');
    const existingUser = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    // Prioritize name from account record, then custom passed, then defaults
    const displayName = existingUser?.name || (customName && customName.trim()) || (role === 'admin' ? 'Admin Administrator' : 'Jose Gabriel');
    
    const mockUser: UserProfile = {
      uid: existingUser?.id || (role === 'admin' ? 'admin-1' : `user-${email}-${Date.now()}`),
      displayName: displayName,
      email: email,
      photoURL: (email === 'josegabriel@cleanpin.ph' || displayName === 'Jose Gabriel') 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' 
        : undefined,
      points: existingUser?.points ?? 0,
      level: existingUser?.level ?? 1,
      contributions: existingUser?.contributions ?? 0,
      achievements: existingUser?.achievements || [],
      role: role
    };
    setUser(mockUser);
    setIsLoggedIn(true);
    setActiveTab(role === 'admin' ? 'admin' : 'home');
    localStorage.setItem('cleanpin_session', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('cleanpin_session');
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleNewPost = (data: any) => {
    if (!user) return;
    const newPost: UserContribution = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      userName: user.displayName,
      description: data.description,
      imageUrl: data.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
      category: data.category || 'other',
      location: { lat: data.lat, lng: data.lng },
      createdAt: Date.now(),
      status: 'pending'
    };
    setPosts([newPost, ...posts]);
    setToast({ message: 'Trash report successfully posted!', type: 'success' });
  };

  const updatePostStatus = (id: string, status: UserContribution['status']) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const markers = posts.map(post => ({
    id: post.id,
    lat: post.location.lat,
    lng: post.location.lng,
    title: `Post by ${post.userName}`,
    description: post.description,
    imageUrl: post.imageUrl
  }));

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8 flex flex-col">
              {/* Introduction Section */}
              <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10 max-w-xl text-balance">
                  <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight leading-tight">Welcome to CleanPin, <span className="text-primary">{user?.displayName}.</span></h1>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">You're participating in a community-driven initiative to map and eliminate waste in Sampaloc, supporting SDG 11: Sustainable Cities.</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                      <Target size={14} className="text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider">Zero Waste Goal</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                      <Users size={14} className="text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider">1.2k Eco-Warriors</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Summary Overlay */}
              <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between border border-border shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl border border-primary/20 overflow-hidden shadow-sm">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{user?.displayName}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{user?.role === 'admin' ? 'System Administrator' : 'Elite Eco-Warrior'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-4 py-2 bg-secondary/50 text-primary rounded-xl text-xs font-bold border border-primary/10">
                    Level {user?.level} • {user?.points} Points
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <section className="bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative min-h-[500px]">
                <Map markers={markers} />
                {user?.role !== 'admin' && (
                  <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="absolute bottom-6 right-6 z-[1010] bg-primary text-white px-8 py-4 rounded-full font-bold shadow-post hover:bg-primary-dark transition-all flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>REPORT TRASH</span>
                  </button>
                )}
              </section>
            </div>

            {/* Side Activity Panel */}
            <div className="lg:col-span-1 space-y-6 flex flex-col min-h-[400px]">
              <div className="bg-white rounded-2xl border border-border flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-muted">
                  <h2 className="font-display font-bold text-lg">Community Activity</h2>
                  <p className="text-xs text-muted-foreground mt-1">Live updates from Metro Manila</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={post.id}
                        className="p-3 rounded-xl bg-muted border border-border/50 group"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] overflow-hidden">
                            {user?.uid === post.userId && user?.photoURL ? (
                              <img src={user.photoURL} alt={post.userName} className="w-full h-full object-cover" />
                            ) : (
                              post.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{post.userName}</p>
                            <p className="text-[10px] text-muted-foreground">Just now</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">{post.description}</p>
                        <div className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          post.status === 'verified' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {post.status}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                        <Users size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-400">No activity yet</p>
                      <p className="text-[10px] text-slate-400 mt-1">Be the first to post a report!</p>
                    </div>
                  )}
                  
                  {/* System News Integrated */}
                  <div className="p-3 rounded-xl bg-secondary border border-primary/10">
                     <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white">
                           <Plus size={12} />
                        </div>
                        <p className="text-xs font-bold text-primary">System</p>
                     </div>
                     <p className="text-xs font-medium text-primary-dark leading-relaxed">
                       New cleaning drive scheduled for Manila Bay this Saturday.
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="h-[70vh] min-h-[500px] w-full bg-white rounded-3xl overflow-hidden border border-border shadow-sm">
            <Map markers={markers} selectable={user?.role !== 'admin'} onLocationSelect={() => {}} />
          </div>
        );
      case 'performance':
        return <Performance user={user} />;
      case 'community':
        return <Community user={user} posts={posts} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <AdminDashboard posts={posts} onStatusUpdate={updatePostStatus} onDelete={deletePost} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row bg-white font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#f3f4f6]">
        <Header title="CleanPin" user={user} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="p-4 md:p-8 lg:p-12 pb-32 md:pb-8 max-w-screen-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        onSubmit={handleNewPost}
        posts={posts}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[3000] px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border",
              toast.type === 'success' ? "bg-emerald-600 border-emerald-500 text-white" : "bg-red-600 border-red-500 text-white"
            )}
          >
            <div className="bg-white/20 p-1 rounded-full">
              {toast.type === 'success' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              )}
            </div>
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar {
          -webkit-overflow-scrolling: touch;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
