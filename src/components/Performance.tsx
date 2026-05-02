import React from 'react';
import { Award, Target, TrendingUp, Shield, Map as MapIcon, Trash2 } from 'lucide-react';

const Performance: React.FC = () => {
  const stats = [
    { label: 'Total Posts', value: '12', icon: Trash2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Verified cleans', value: '4', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Points', value: '450', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Rank', value: '#42', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const achievements = [
    { id: '1', title: 'Community Hero', description: 'Post at least 5 reports in a single neighborhood.', unlocked: true, icon: Award },
    { id: '2', title: 'Eagle Eye', description: 'Report waste that is verified by 10+ users.', unlocked: true, icon: Shield },
    { id: '3', title: 'Waste Warrior', description: 'Successfully lead a community cleanup event.', unlocked: false, icon: Award },
    { id: '4', title: 'SDG Advocate', description: 'Share 10 news articles from the feed.', unlocked: false, icon: Target },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-y-auto pr-2 custom-scrollbar">
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
            <span className="text-[10px] font-bold text-primary px-2 py-1 bg-secondary rounded-lg border border-primary/20">2/4 UNLOCKED</span>
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
              <p className="text-sm font-bold text-[#064e3b]">You've covered 3 neighborhoods in Manila</p>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">Your reporting helps local authorities prioritize cleaning initiatives.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
