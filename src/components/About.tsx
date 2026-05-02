import React from 'react';
import { Globe, Heart, Shield, Users, Target } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500 overflow-y-auto max-h-full pr-4 custom-scrollbar">
      {/* Hero Section */}
      <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-border shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-display font-bold text-[#064e3b] mb-6 tracking-tight">Cleaning our streets, one pin at a time.</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CleanPin is a community-driven initiative dedicated to making Sampaloc and Metro Manila cleaner and more sustainable. We empower citizens to report waste concerns and collaborate with local authorities for a zero-waste future.
          </p>
        </div>
      </section>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary mb-6">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">SDG Alignment</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Directly supporting UN SDG 11: Sustainable Cities and Communities. We aim to reduce the adverse per capita environmental impact of cities through improved waste management.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Verified Impact</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every report is manually verified by our community moderators to ensure data accuracy and faster response times from local cleanup crews.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Community Hub</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Join thousands of Eco-Warriors who are actively mapping hotspots and transforming their neighborhoods through collective action.
          </p>
        </div>
      </div>

      {/* Deep Dive */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 opacity-30" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/10">
              <Target size={14} className="text-primary" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">The importance of proper waste management.</h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>In Metro Manila, improper waste disposal leads to clogged drainage systems, severe flooding, and public health risks. CleanPin was born from the need for a transparent, real-time data layer for municipal waste services.</p>
              <p>Our platform doesn't just map trash—it identifies systemic issues in collection schedules and illegal dumping patterns, providing urban planners with the insights they need to build resilient infrastructure.</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="aspect-square bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
               <Heart size={120} className="text-primary animate-pulse" />
            </div>
            <p className="text-center mt-6 text-sm italic text-slate-400">"Sustainable development is the pathway to the future we want for all."</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
