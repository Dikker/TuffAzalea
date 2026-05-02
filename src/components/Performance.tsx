import React from 'react';
import { Award, Target, TrendingUp, Shield, Map as MapIcon, Trash2, Mail, User } from 'lucide-react';
import { UserProfile } from '../types';

interface PerformanceProps {
  user: UserProfile | null;
}

const Performance: React.FC<PerformanceProps> = ({ user }) => {
  const stats = [
    { label: 'Total Posts', value: user?.contributions?.toString() || '0', icon: Trash2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Verified cleans', value: '0', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Points', value: user?.points?.toString() || '0', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Rank', value: 'N/A', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const achievements = [
    { id: '1', title: 'Community Hero', description: 'Post at least 5 reports in a single neighborhood.', unlocked: false, icon: Award },
    { id: '2', title: 'Eagle Eye', description: 'Report waste that is verified by 10+ users.', unlocked: false, icon: Shield },
    { id: '3', title: 'Waste Warrior', description: 'Successfully lead a community cleanup event.', unlocked: false, icon: Award },
    { id: '4', title: 'SDG Advocate', description: 'Share 10 news articles from the feed.', unlocked: false, icon: Target },
  ];

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-border shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20" />
        
        <div className="relative">
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-2xl md:text-3xl border-4 border-white shadow-xl overflow-hidden ring-1 ring-border">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 md:border-4 border-white shadow-sm">
            <Shield size={14} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left pt-0 md:pt-2">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-1">{user?.displayName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
            <div className="flex items-center space-x-1.5 text-[10px] md:text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              <Mail size={10} className="text-slate-400" />
              <span className="truncate max-w-[150px]">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] md:text-xs font-medium text-primary bg-secondary px-2.5 py-1 rounded-full border border-primary/10">
              <User size={10} className="text-primary" />
              <span className="uppercase tracking-wider">Level {user?.level} Eco-Warrior</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs md:text-sm mt-3 md:mt-4 max-w-lg leading-relaxed">
            Participating in community cleanup since 2024. Dedicated to making our neighborhoods cleaner and safer for everyone.
          </p>
        </div>

        <div className="bg-slate-900 text-white rounded-xl md:rounded-2xl p-4 md:p-6 w-full md:min-w-[180px] md:w-auto shadow-lg relative group overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 relative z-10">Current Standing</p>
          <div className="flex items-end space-x-2 relative z-10">
            <span className="text-3xl font-display font-bold">#---</span>
            <span className="text-[10px] text-slate-400 mb-1 font-medium">Top --%</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
            <button className="text-[10px] font-bold text-white hover:text-primary transition-colors flex items-center uppercase tracking-wider">
              Leaderboard <TrendingUp size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-border flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-current/10`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-display font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-[#064e3b]">Achievements</h2>
            <span className="text-[10px] font-bold text-primary px-2 py-1 bg-secondary rounded-lg border border-primary/20">0/4 UNLOCKED</span>
          </div>
          
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-xl border transition-all ${achievement.unlocked ? 'bg-secondary/20 border-primary/10' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-lg ${achievement.unlocked ? 'bg-primary text-white shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                    <achievement.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xs text-slate-800">{achievement.title}</h3>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{achievement.description}</p>
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="mt-3 text-[9px] font-bold text-primary-dark tracking-wider py-1 px-2 border border-primary/20 rounded-full inline-block bg-white">
                    VERIFIED CONTRIBUTOR
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Map Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-[#064e3b]">Contribution Map</h2>
            <button className="text-[10px] font-bold text-primary hover:underline flex items-center tracking-widest uppercase">
              VIEW IMPACT <MapIcon size={12} className="ml-1" />
            </button>
          </div>
          <div className="flex-1 bg-secondary/30 rounded-2xl flex items-center justify-center border border-primary/10 border-dashed relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="text-center p-8 relative z-10">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 border border-primary/10">
                <MapIcon size={32} className="text-primary" />
              </div>
              <p className="text-sm font-bold text-[#064e3b]">Start contributing to see your impact map</p>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">Your reporting helps local authorities prioritize cleaning initiatives.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
