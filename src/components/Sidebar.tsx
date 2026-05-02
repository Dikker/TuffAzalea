import React from 'react';
import { Home, Map as MapIcon, Settings, LogOut, User, ShieldAlert, Info, Mail, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
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
      
      <nav className="flex-1 flex flex-row md:flex-col items-center justify-around md:justify-start space-x-2 md:space-x-0 md:space-y-4 w-full md:w-auto px-4 md:px-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-secondary text-primary" 
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
            title={item.label}
          >
            <item.icon size={22} strokeWidth={2.5} />
            {activeTab === item.id && (
              <div className="absolute bottom-0 md:bottom-auto md:left-0 w-6 h-1 md:w-1 md:h-6 bg-primary rounded-t-full md:rounded-r-full" />
            )}
          </button>
        ))}

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
              activeTab === 'admin' 
                ? "bg-red-50 text-red-600" 
                : "text-red-400 hover:text-red-600 hover:bg-red-50"
            )}
            title="Admin Moderation"
          >
            <ShieldAlert size={22} strokeWidth={2.5} />
            {activeTab === 'admin' && (
              <div className="absolute bottom-0 md:bottom-auto md:left-0 w-6 h-1 md:w-1 md:h-6 bg-red-600 rounded-t-full md:rounded-r-full" />
            )}
          </button>
        )}
      </nav>

      <div className="hidden md:flex space-y-4 flex-col items-center">
        <button className="w-12 h-12 flex items-center justify-center rounded-xl text-muted-foreground hover:text-primary hover:bg-muted transition-all">
          <Settings size={22} />
        </button>
        <button 
          onClick={onLogout}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
