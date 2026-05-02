import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 overflow-y-auto max-h-full pr-4 custom-scrollbar">
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold text-[#064e3b] mb-4">Get in touch</h1>
        <p className="text-muted-foreground">Have questions about our project or want to collaborate? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-border flex items-start space-x-4">
            <div className="p-3 bg-secondary rounded-xl text-primary">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Email Us</h4>
              <p className="text-xs text-muted-foreground mt-1 text-wrap">hello@cleanpin.ph</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Call Us</h4>
              <p className="text-xs text-muted-foreground mt-1">+63 912 345 6789</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border flex items-start space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Our Hub</h4>
              <p className="text-xs text-muted-foreground mt-1">Sampaloc, Manila, Philippines</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Message Sent!</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
              <button 
                onClick={() => setSent(false)}
                className="text-primary font-bold text-xs hover:underline mt-4 tracking-widest uppercase"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="juan@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm">
                  <option>Collaboration Inquiry</option>
                  <option>Report a Technical Issue</option>
                  <option>General Feedback</option>
                  <option>Waste Management Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Tell us more about how we can help..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-post hover:bg-primary-dark transition-all flex items-center justify-center space-x-2 group active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
