import React, { useState } from 'react';
import { Home, Map as MapIcon, Settings, LogOut, User, ShieldAlert, Info, Mail, Users, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'performance', label: 'Profile', icon: User },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <div className="w-full md:w-[80px] h-16 md:h-full bg-white border-t md:border-t-0 md:border-r border-border flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 shadow-lg md:shadow-sm z-[2005] fixed bottom-0 md:relative">
      <div className="hidden md:flex mb-10 p-2 bg-secondary rounded-xl text-primary font-bold text-lg">
        CP
      </div>
      
      <nav className="flex-1 flex flex-row md:flex-col items-center justify-around md:justify-start space-x-1 md:space-x-0 md:space-y-4 w-full md:w-auto px-2 md:px-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-secondary text-primary" 
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={2.5} />
            {activeTab === item.id && (
              <div className="absolute bottom-0 md:bottom-auto md:left-0 w-6 h-1 md:w-1 md:h-6 bg-primary rounded-t-full md:rounded-r-full" />
            )}
          </button>
        ))}

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={cn(
              "w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
              activeTab === 'admin' 
                ? "bg-red-50 text-red-600" 
                : "text-red-400 hover:text-red-600 hover:bg-red-50"
            )}
            title="Admin Moderation"
          >
            <ShieldAlert size={20} strokeWidth={2.5} />
            {activeTab === 'admin' && (
              <div className="absolute bottom-0 md:bottom-auto md:left-0 w-6 h-1 md:w-1 md:h-6 bg-red-600 rounded-t-full md:rounded-r-full" />
            )}
          </button>
        )}

        {/* Logout for Mobile */}
        <div className="md:hidden relative">
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 bottom-full mb-3 bg-white border border-border rounded-xl shadow-2xl p-2 flex items-center space-x-2 z-50 overflow-hidden ring-4 ring-black/5"
              >
                <div className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-tight">Logout?</div>
                <button 
                  onClick={onLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-full transition-all shadow-sm",
              showLogoutConfirm ? "bg-red-500 text-white" : "bg-slate-100 text-muted-foreground"
            )}
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="hidden md:flex space-y-4 flex-col items-center">
        <div className="relative">
          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-4 bottom-0 bg-white border border-border rounded-2xl shadow-xl p-4 w-64 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-sm">Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Notifications</span>
                    <button 
                      onClick={() => setNotifications(!notifications)}
                      className={cn(
                        "w-8 h-4 rounded-full transition-colors relative",
                        notifications ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: notifications ? 16 : 2 }}
                        className="w-3 h-3 bg-white rounded-full absolute top-0.5" 
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Show Profile</span>
                    <button 
                      onClick={() => setProfileVisible(!profileVisible)}
                      className={cn(
                        "w-8 h-4 rounded-full transition-colors relative",
                        profileVisible ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: profileVisible ? 16 : 2 }}
                        className="w-3 h-3 bg-white rounded-full absolute top-0.5" 
                      />
                    </button>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100">
                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => {
              setShowSettings(!showSettings);
              setShowLogoutConfirm(false);
            }}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-xl transition-all",
              showSettings ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
          >
            <Settings size={22} />
          </button>
        </div>
        
        <div className="relative">
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-4 bottom-0 bg-white border border-border rounded-xl shadow-xl p-2 flex items-center space-x-2 z-50 whitespace-nowrap"
              >
                <div className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-tight">Logout?</div>
                <button 
                  onClick={onLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => {
              setShowLogoutConfirm(!showLogoutConfirm);
              setShowSettings(false);
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm",
              showLogoutConfirm ? "bg-red-500 text-white" : "bg-slate-100 text-muted-foreground hover:text-red-500 hover:bg-red-50"
            )}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
