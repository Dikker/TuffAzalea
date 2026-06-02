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
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [mapFocusCenter, setMapFocusCenter] = useState<[number, number] | null>(null);
  const [selectedMapCoords, setSelectedMapCoords] = useState<{lat: number, lng: number} | null>(null);
  const [reportModalCoords, setReportModalCoords] = useState<{lat: number, lng: number} | null>(null);

  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [coopType, setCoopType] = useState<'confirm-cleaned' | 'suggest-action'>('confirm-cleaned');
  const [coopAction, setCoopAction] = useState('Install bigger bins');
  const [coopComment, setCoopComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load posts with high-fidelity Sampaloc mock data as backup
  useEffect(() => {
    const savedPosts = localStorage.getItem('cleanpin_locations');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Error parsing cleanpin locations", e);
      }
    } else {
      const initialPosts: UserContribution[] = [
        {
          id: 'p-1',
          userId: 'user-2',
          userName: 'Maria Santos',
          description: "Large pile of plastic trash bags and discarded wooden furniture sitting right beside the main G. Tuazon traffic flow. It's obstructing pedestrians and attracting stray animals.",
          imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800",
          category: 'illegal-dumping',
          location: { lat: 14.6135, lng: 121.0012, address: "G. Tuazon St, Sampaloc, Manila" },
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
          status: 'pending',
          confirms: [
            {
              id: 'c-1',
              userName: 'Kevin Ramos',
              type: 'suggest-action',
              actionRecommended: 'Contact Barangay Officer',
              comment: "Spoke to the street sweepers. They said they need a larger dump truck here on Wednesday, since there is a regular buildup.",
              createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
            }
          ],
          aiVerification: {
            authentic: true,
            reason: "Detailed street obstructing trash heap reported. Consistent with municipal blockages.",
            score: 96
          }
        },
        {
          id: 'p-2',
          userId: 'user-1',
          userName: 'Jose Gabriel',
          description: "Commercial garbage bin has overflowed with take-out cartons and empty plastic beverage cups. It is starting to smell as it was soaked in rain.",
          imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
          category: 'missed-collection',
          location: { lat: 14.6087, lng: 120.9895, address: "España Blvd, Sampaloc, Manila (Near UST walkway)" },
          createdAt: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
          status: 'in-progress',
          confirms: [
            {
              id: 'c-2',
              userName: 'Maria Santos',
              type: 'suggest-action',
              actionRecommended: 'Install bigger bins',
              comment: "This UST walkway gets heavy foot traffic. A regular bin isn't enough, we need a high-capacity segregated waste bin.",
              createdAt: Date.now() - 1000 * 60 * 60 * 8
            },
            {
              id: 'c-3',
              userName: 'Admin Administrator',
              type: 'suggest-action',
              actionRecommended: 'Organize volunteer cleanup',
              comment: "Assigned eco-volunteer squad for España cleanup this Friday. Join us at 8 AM!",
              createdAt: Date.now() - 1000 * 60 * 60 * 4
            }
          ],
          aiVerification: {
            authentic: true,
            reason: "Valid waste point reported containing local landmarks and pedestrian details. Authenticity score high.",
            score: 98
          }
        },
        {
          id: 'p-3',
          userId: 'user-3',
          userName: 'Kevin Ramos',
          description: "Discarded fluorescent light tubes and electronic parts lying broken on the pavement. Risk of mercury inhalation and cuts for passing pedestrians.",
          imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
          category: 'hazardous',
          location: { lat: 14.6178, lng: 120.9922, address: "Lacson Ave corner Dimasalang, Sampaloc, Manila" },
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
          status: 'resolved',
          confirms: [
            {
              id: 'c-4',
              userName: 'Maria Santos',
              type: 'confirm-cleaned',
              comment: "Awesome! The barangay workers came with gloves and safety kits to pick up the broken hazardous tubes this morning. Area is clean and safe now!",
              createdAt: Date.now() - 1000 * 60 * 60 * 12
            }
          ],
          aiVerification: {
            authentic: true,
            reason: "Hazardous electronic components identified. Confirms immediate public attention criteria.",
            score: 95
          }
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('cleanpin_locations', JSON.stringify(initialPosts));
    }
  }, []);

  // Sync posts to LocalStorage
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('cleanpin_locations', JSON.stringify(posts));
    }
  }, [posts]);

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

  const handleNewPost = async (data: any) => {
    if (!user) return;
    const postId = Math.random().toString(36).substr(2, 9);
    
    const newPost: UserContribution = {
      id: postId,
      userId: user.uid,
      userName: user.displayName,
      description: data.description,
      imageUrl: data.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
      category: data.category || 'other',
      location: { lat: data.lat, lng: data.lng },
      createdAt: Date.now(),
      status: 'pending',
      aiVerification: {
        authentic: true,
        reason: 'Analyzing report contents in real-time with Gemini AI...',
        score: 50
      }
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setToast({ message: 'Trash report successfully posted!', type: 'success' });
    
    // Increment total contributions in user profile to count for achievements as progress is logged!
    const updatedUser = {
      ...user,
      contributions: (user.contributions || 0) + 1,
      points: user.points + 20, // +20 points for clean-reporting!
      level: Math.floor((user.points + 20) / 100) + 1
    };
    setUser(updatedUser);
    localStorage.setItem('cleanpin_session', JSON.stringify(updatedUser));

    // Update in accounts too
    const storedAccounts = JSON.parse(localStorage.getItem('cleanpin_accounts') || '[]');
    const newAccounts = storedAccounts.map((a: any) => 
      a.email.toLowerCase() === user.email.toLowerCase()
        ? { ...a, contributions: updatedUser.contributions, points: updatedUser.points, level: updatedUser.level }
        : a
    );
    localStorage.setItem('cleanpin_accounts', JSON.stringify(newAccounts));

    // Async verify post report on our secure backend API endpoint via Gemini AI
    try {
      const response = await fetch('/api/verify-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: data.description,
          category: data.category,
          image: data.image
        })
      });
      if (response.ok) {
        const result = await response.json();
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              aiVerification: result
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error("Gemini Verification Call Error:", err);
    }
  };

  const updatePostStatus = (id: string, status: UserContribution['status']) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleShareNewsArticle = (title: string, id: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      points: user.points + 10,
      level: Math.floor((user.points + 10) / 100) + 1
    };
    setUser(updatedUser);
    localStorage.setItem('cleanpin_session', JSON.stringify(updatedUser));

    const storedAccounts = JSON.parse(localStorage.getItem('cleanpin_accounts') || '[]');
    const newAccounts = storedAccounts.map((a: any) => 
      a.email.toLowerCase() === user.email.toLowerCase()
        ? { ...a, points: updatedUser.points, level: updatedUser.level }
        : a
    );
    localStorage.setItem('cleanpin_accounts', JSON.stringify(newAccounts));

    setToast({
      message: `Advocated SDG 11: Shared "${title.substring(0, 30)}..." and earned +10 Eco points!`,
      type: 'success'
    });
  };

  const handleConfirmOrRecommend = (
    pinId: string,
    type: 'confirm-cleaned' | 'suggest-action',
    actionRecommended?: string,
    comment?: string
  ) => {
    if (!user) return;

    const newConfirm = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user.displayName,
      type,
      actionRecommended,
      comment,
      createdAt: Date.now()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === pinId) {
        const existingConfirms = post.confirms || [];
        
        // Auto update status based on community feedback
        let updatedStatus = post.status;
        if (type === 'confirm-cleaned') {
          updatedStatus = 'resolved'; // Mark as resolved/cleaned
        } else if (type === 'suggest-action') {
          updatedStatus = 'in-progress'; // Mark as in-progress / action-taken
        }

        return {
          ...post,
          status: updatedStatus,
          confirms: [newConfirm, ...existingConfirms]
        };
      }
      return post;
    });

    setPosts(updatedPosts);

    // Reward the user with 15 XP points!
    const updatedUser = {
      ...user,
      points: user.points + 15,
      level: Math.floor((user.points + 15) / 100) + 1
    };
    setUser(updatedUser);
    localStorage.setItem('cleanpin_session', JSON.stringify(updatedUser));

    // Update in stored accounts too
    const storedAccounts = JSON.parse(localStorage.getItem('cleanpin_accounts') || '[]');
    const newAccounts = storedAccounts.map((a: any) => 
      a.email.toLowerCase() === user.email.toLowerCase()
        ? { ...a, points: updatedUser.points, level: updatedUser.level }
        : a
    );
    localStorage.setItem('cleanpin_accounts', JSON.stringify(newAccounts));

    setToast({
      message: type === 'confirm-cleaned'
        ? "Verification logged! Clutter confirmed cleaned. +15 Eco Points!"
        : "Action advice submitted. Post status updated to In Progress! +15 Eco Points!",
      type: 'success'
    });
  };

  const handleNewPostFromCoords = (lat: number, lng: number) => {
    setReportModalCoords({ lat, lng });
    setIsReportModalOpen(true);
  };

  const markers = posts.map(post => ({
    id: post.id,
    lat: post.location.lat,
    lng: post.location.lng,
    title: `Post by ${post.userName}`,
    description: post.description,
    imageUrl: post.imageUrl,
    category: post.category,
    status: post.status
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
              <div className="bg-slate-900 rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10 max-w-xl text-balance">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight leading-tight">Welcome to CleanPin, <span className="text-primary">{user?.displayName}.</span></h1>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">You're participating in a community-driven initiative to map and eliminate waste in Sampaloc, supporting SDG 11: Sustainable Cities.</p>
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
              <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-border shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-lg md:text-xl border border-primary/20 overflow-hidden shadow-sm flex-shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 truncate">{user?.role === 'admin' ? 'System Administrator' : 'Elite Eco-Warrior'}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{user?.displayName}</p>
                  </div>
                </div>
                <div className="self-end sm:self-auto flex-shrink-0">
                  <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-secondary/50 text-primary rounded-xl text-[10px] md:text-xs font-bold border border-primary/10">
                    Level {user?.level} • {user?.points} Points
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <section className="bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative h-[300px] sm:h-[400px] md:h-[500px]">
                <Map 
                  markers={markers} 
                  onMarkerSelect={(id) => {
                    setSelectedPinId(id);
                  }}
                  onViewUpdates={(id) => {
                    setActiveTab('map');
                    setSelectedPinId(id);
                    const clickedPost = posts.find(p => p.id === id);
                    if (clickedPost) {
                      setMapFocusCenter([clickedPost.location.lat, clickedPost.location.lng]);
                    }
                  }}
                  selectedMarkerId={selectedPinId || undefined}
                />
                {user?.role !== 'admin' && (
                  <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1010] bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold shadow-post hover:bg-primary-dark transition-all flex items-center space-x-2 text-xs sm:text-sm"
                  >
                    <Plus size={16} />
                    <span>REPORT TRASH</span>
                  </button>
                )}
              </section>
            </div>

            {/* Side Activity Panel */}
            <div className="lg:col-span-1 flex flex-col gap-6 min-h-[400px] min-w-0">
              <div className="bg-white rounded-2xl border border-border flex flex-col h-[400px] overflow-hidden shadow-sm">
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
                        onClick={() => {
                          setActiveTab('map');
                          setSelectedPinId(post.id);
                          setMapFocusCenter([post.location.lat, post.location.lng]);
                        }}
                        className="p-3 rounded-xl bg-muted border border-border/50 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all duration-200"
                        title="Click to view this report on the map"
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
                            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{post.userName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {post.location.address?.split(',')[0]}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">{post.description}</p>
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                            post.status === 'resolved' || post.status === 'verified' ? "bg-emerald-100 text-emerald-700" :
                            post.status === 'in-progress' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                          )}>
                            {post.status}
                          </div>
                          <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-0.5">
                            <span>View Report</span>
                            <span>➜</span>
                          </span>
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

              {/* Dynamic Gemini SDG 11 News Feed */}
              <div className="h-[385px] flex-shrink-0 animate-in fade-in duration-500">
                <NewsFeed onShareArticle={handleShareNewsArticle} />
              </div>
            </div>
          </div>
        );
      case 'map': {
        const selectedPin = posts.find(p => p.id === selectedPinId);
        
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[80vh] min-h-[600px]">
            {/* Left Panel: Pinned Areas Collection or Selected Pin Action Board (Takes 5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-3xl border border-border shadow-sm overflow-hidden min-h-0">
              
              <AnimatePresence mode="wait">
                {!selectedPin ? (
                  // PINNED AREAS COLLECTION VIEW
                  <motion.div 
                    key="collection-list"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col h-full min-h-0"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-muted bg-slate-50">
                      <h2 className="font-display font-bold text-lg text-slate-800 flex items-center">
                        <span className="mr-2">📁</span> Pinned Areas Collection
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Explore reported spots and contribute validation feedback.</p>
                    </div>

                    {/* Filter controls */}
                    <div className="p-6 border-b border-muted space-y-4 bg-white">
                      {/* Search */}
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Search pinned areas, categories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
                      </div>

                      {/* Rapid Status Filter Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { id: 'all', label: 'All Pins', color: 'bg-slate-100 text-slate-600' },
                          { id: 'pending', label: 'Pending 🔴', color: 'bg-red-50 text-red-600 border border-red-100' },
                          { id: 'in-progress', label: 'In Progress 🟠', color: 'bg-orange-50 text-orange-600 border border-orange-100' },
                          { id: 'resolved', label: 'Cleaned 🟢', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' }
                        ].map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => {
                              setSelectedStatusFilter(filter.id);
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all relative",
                              selectedStatusFilter === filter.id 
                                ? filter.id === 'resolved' ? "bg-emerald-600 text-white shadow-sm" :
                                  filter.id === 'in-progress' ? "bg-orange-600 text-white shadow-sm" :
                                  filter.id === 'pending' ? "bg-red-600 text-white shadow-sm" : "bg-slate-800 text-white shadow-sm"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                      {posts
                        .filter(post => {
                          const matchesQuery = post.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                               (post.location.address?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                               post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                               post.category.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesFilter = selectedStatusFilter === 'all' || post.status === selectedStatusFilter;
                          return matchesQuery && matchesFilter;
                        })
                        .length > 0 ? (
                          posts
                            .filter(post => {
                              const matchesQuery = post.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                   (post.location.address?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                                   post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                   post.category.toLowerCase().includes(searchQuery.toLowerCase());
                              const matchesFilter = selectedStatusFilter === 'all' || post.status === selectedStatusFilter;
                              return matchesQuery && matchesFilter;
                            })
                            .map((post) => (
                              <div
                                key={post.id}
                                onClick={() => {
                                  setSelectedPinId(post.id);
                                  setMapFocusCenter([post.location.lat, post.location.lng]);
                                }}
                                className="p-5 rounded-2xl bg-[#f9fafb] border border-slate-100 hover:border-primary/20 hover:bg-primary/5 cursor-pointer group transition-all duration-200 flex flex-col shadow-sm hover:shadow-md"
                              >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <div className="flex items-center space-x-2">
                                    <span className={cn(
                                      "inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase",
                                      post.status === 'resolved' || post.status === 'verified' ? "bg-emerald-100 text-emerald-800" :
                                      post.status === 'in-progress' ? "bg-orange-100 text-orange-850" : "bg-red-100 text-red-800"
                                    )}>
                                      {post.status || 'pending'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                      {post.category}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-medium">
                                    {new Date(post.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                  </span>
                                </div>
                                
                                <div className="flex gap-4 items-start">
                                  {post.imageUrl && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                                      <img src={post.imageUrl} alt="Trash spot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-in fade-in" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
                                      Posted by {post.userName}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                      {post.description}
                                    </p>
                                  </div>
                                </div>

                                {post.location.address && (
                                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[10px] text-slate-450 font-bold uppercase tracking-tight">
                                    <span className="mr-1">📍</span> {post.location.address}
                                  </div>
                                )}
                              </div>
                            ))
                        ) : (
                          <div className="py-12 text-center flex flex-col items-center">
                            <span className="text-3xl mb-1.5">🔭</span>
                            <p className="text-xs font-bold text-slate-400">No matching pins found</p>
                            <p className="text-[10px] text-slate-400 mt-1">Try resetting filters or typing another query.</p>
                          </div>
                        )}
                    </div>
                  </motion.div>
                ) : (
                  // COMMUNITY COLLABORATION BOARD VIEW
                  <motion.div
                    key="coop-board"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col h-full min-h-0"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-muted bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
                      <div className="flex-1 min-w-0">
                        <button 
                          onClick={() => setSelectedPinId(null)}
                          className="text-xs text-primary font-bold hover:underline mb-1 flex items-center space-x-1"
                        >
                          <span>← Back to Collection</span>
                        </button>
                        <h3 className="font-display font-bold text-base truncate">Collaborate on Cleanup</h3>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm",
                        selectedPin.status === 'resolved' || selectedPin.status === 'verified' 
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" 
                          : selectedPin.status === 'in-progress' 
                          ? "bg-orange-500/15 text-orange-400 border-orange-500/20" 
                          : "bg-red-500/15 text-red-400 border-red-500/20"
                      )}>
                        {selectedPin.status || 'pending'}
                      </span>
                    </div>

                    {/* Scrollable details & updates stream */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                      {/* Active Trash details card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary">
                            {selectedPin.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{selectedPin.userName}</p>
                            <p className="text-[10px] text-slate-450">Reporter</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-primary/30 pl-3">
                          "{selectedPin.description}"
                        </p>

                        {selectedPin.imageUrl && (
                          <div className="rounded-xl overflow-hidden aspect-[16/9] border border-slate-200">
                            <img src={selectedPin.imageUrl} alt="Trash details" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="text-[10px] text-slate-500 font-bold bg-white p-3 rounded-lg border border-slate-100 flex items-center">
                          <span className="mr-1.5">📍</span> Address: {selectedPin.location.address || `Coordinates (${selectedPin.location.lat.toFixed(4)}, ${selectedPin.location.lng.toFixed(4)})`}
                        </div>
                      </div>

                      {/* Collaborative Action Board */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center">
                          <span>📢</span> <span className="ml-1.5 font-display font-black text-slate-800">Community Updates / Advice ({selectedPin.confirms?.length || 0})</span>
                        </h3>

                        {/* Submit verification form */}
                        <div className="bg-white border-2 border-primary/10 p-6 rounded-2xl space-y-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Vote Cleanliness or Support Action</h4>
                            <p className="text-[10px] text-slate-400">Collaborate with other sweepers so everyone knows what is needed.</p>
                          </div>

                          {/* Mode Toggle Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setCoopType('confirm-cleaned');
                                setCoopAction('');
                              }}
                              className={cn(
                                "py-2 px-3 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1.5 transition-all border",
                                coopType === 'confirm-cleaned'
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                              )}
                            >
                              <span>✅</span>
                              <span>Confirm Cleaned</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCoopType('suggest-action');
                                setCoopAction('Install bigger bins');
                              }}
                              className={cn(
                                "py-2 px-3 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1.5 transition-all border",
                                coopType === 'suggest-action'
                                  ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                              )}
                            >
                              <span>⚠️</span>
                              <span>Recommend Action</span>
                            </button>
                          </div>

                          {coopType === 'suggest-action' && (
                            <div className="space-y-1.5 animate-in fade-in duration-250">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended Support Action</label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  'Install bigger bins',
                                  'Organize volunteer cleanup',
                                  'Contact Barangay Officer',
                                  'Post warning signs'
                                ].map((action) => (
                                  <button
                                    key={action}
                                    type="button"
                                    onClick={() => setCoopAction(action)}
                                    className={cn(
                                      "px-2 py-1.5 text-[9px] font-extrabold rounded-lg border text-left transition-all",
                                      coopAction === action 
                                        ? "bg-orange-100 border-orange-300 text-orange-900 shadow-sm"
                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                    )}
                                  >
                                    {action === 'Install bigger bins' ? '🗑️ ' :
                                     action === 'Organize volunteer cleanup' ? '🧹 ' :
                                     action === 'Contact Barangay Officer' ? '📞 ' : '🚫 '} 
                                    {action}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Share Update Notes</label>
                            <textarea
                              rows={2}
                              value={coopComment}
                              onChange={(e) => setCoopComment(e.target.value)}
                              placeholder={coopType === 'confirm-cleaned' 
                                ? "Provide extra confirmation details (e.g. Area was sweeped, garbage truck finally collected it this morning...)" 
                                : "Give advice or details for volunteers (e.g. Needs 3-4 volunteers with heavy trash bags...)"}
                              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              handleConfirmOrRecommend(
                                selectedPin.id,
                                coopType,
                                coopType === 'suggest-action' ? coopAction : undefined,
                                coopComment.trim() || undefined
                              );
                              setCoopComment('');
                            }}
                            className={cn(
                              "w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all text-center flex items-center justify-center space-x-1.5",
                              coopType === 'confirm-cleaned' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-600 hover:bg-orange-700"
                            )}
                          >
                            <span>🚀</span>
                            <span>SUBMIT PIN CONFIRM (+15 Eco Points)</span>
                          </button>
                        </div>

                        {/* Stream of previous updates */}
                        <div className="space-y-2.5">
                          {selectedPin.confirms && selectedPin.confirms.length > 0 ? (
                            selectedPin.confirms.map((item) => (
                              <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-[#fbfbfb] text-slate-800 space-y-1.5 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="text-xs font-bold text-slate-800">{item.userName}</span>
                                    <span className={cn(
                                      "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider",
                                      item.type === 'confirm-cleaned' ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-900"
                                    )}>
                                      {item.type === 'confirm-cleaned' ? 'Verified Cleaned' : 'Action Advice'}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-medium font-mono">
                                    Just now
                                  </span>
                                </div>

                                {item.actionRecommended && (
                                  <p className="text-[10px] font-bold text-orange-800 bg-orange-50 px-2 py-1 rounded w-fit inline-flex items-center">
                                    <span className="mr-1">🎯</span> Action Advised: {item.actionRecommended}
                                  </p>
                                )}

                                {item.comment && (
                                  <p className="text-xs text-slate-600 leading-relaxed italic pl-1.5 border-l border-slate-200">
                                    "{item.comment}"
                                  </p>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-[11px] text-slate-400 font-medium">
                              No updates or recommendations logged for this pin. Be the first to advise what to do!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Panel: The Interactive Map (Takes 7 cols) */}
            <div className="lg:col-span-7 h-full bg-white rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col relative min-h-[350px] lg:min-h-0">
              <div className="flex-1 relative">
                <Map 
                  center={mapFocusCenter || undefined}
                  markers={markers} 
                  selectable={user?.role !== 'admin'} 
                  onLocationSelect={(lat, lng) => {
                    setSelectedMapCoords({ lat, lng });
                  }} 
                  onMarkerSelect={(id) => {
                    setSelectedPinId(id);
                    const clickedPost = posts.find(p => p.id === id);
                    if (clickedPost) {
                      setMapFocusCenter([clickedPost.location.lat, clickedPost.location.lng]);
                    }
                  }}
                  selectedMarkerId={selectedPinId || undefined}
                />

                {/* Quick Map Overlay for active selected target coordinates */}
                {selectedMapCoords && user?.role !== 'admin' && (
                  <div className="absolute top-16 left-4 right-4 z-[1002] bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between border border-white/10 gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <p className="text-xs font-black text-primary tracking-widest uppercase mb-0.5">Target Map Coordinate Selected</p>
                      <p className="text-[10px] text-slate-300 font-mono">
                        Latitude: {selectedMapCoords.lat.toFixed(5)} • Longitude: {selectedMapCoords.lng.toFixed(5)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          handleNewPostFromCoords(selectedMapCoords.lat, selectedMapCoords.lng);
                          setSelectedMapCoords(null);
                        }}
                        className="bg-primary text-white font-bold text-xs py-2 px-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-post"
                      >
                        📌 REPORT WASTE HERE (+25 Points)
                      </button>
                      <button 
                        onClick={() => setSelectedMapCoords(null)}
                        className="text-slate-400 hover:text-white text-xs font-bold p-1 bg-white/10 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 'performance':
        return <Performance user={user} posts={posts} />;
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
    <div className="fixed inset-0 flex flex-col-reverse md:flex-row bg-white font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#f3f4f6]">
        <Header title="CleanPin" user={user} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="p-4 md:p-8 lg:p-12 pb-8 max-w-screen-2xl mx-auto">
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
        onClose={() => {
          setIsReportModalOpen(false);
          setReportModalCoords(null);
        }} 
        onSubmit={handleNewPost}
        posts={posts}
        initialLat={reportModalCoords?.lat}
        initialLng={reportModalCoords?.lng}
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
