import React, { useState } from 'react';
import { Bell, Search, X, CheckSquare } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface HeaderProps {
  title: string;
  user: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ title, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your report was verified by an admin', time: '5m ago', read: false },
    { id: 2, text: 'New cleaning drive in Sampaloc', time: '2h ago', read: false },
    { id: 3, text: 'Welcome to CleanPin community!', time: '1d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-border bg-white px-4 md:px-8 flex items-center justify-between relative z-[2000] flex-shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-pulse" />
        <h1 className="text-base md:text-lg font-display font-bold text-[#064e3b] tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search reports or locations..." 
            className="bg-muted pl-9 pr-4 py-1.5 rounded-xl text-xs w-64 focus:outline-none border border-transparent focus:border-primary/30 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-xl transition-all relative",
                showNotifications ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
              )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden ring-1 ring-black/5"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center space-x-1"
                    >
                      <CheckSquare size={10} />
                      <span>MARK ALL READ</span>
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 border-b border-border/50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative",
                          !notif.read && "bg-primary/[0.02]"
                        )}
                      >
                        {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                        <p className="text-xs text-slate-700 leading-relaxed">{notif.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center bg-slate-50/50 border-t border-border">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">VIEW ALL ALERTS</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="h-8 w-px bg-border mx-2" />
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#064e3b] leading-tight">{user?.displayName}</p>
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                {user?.role === 'admin' ? 'System Administrator' : 'Eco-Warrior'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-sm overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.displayName)
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
