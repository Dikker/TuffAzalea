import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldAlert, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLogin: (role: 'user' | 'admin', name?: string, email?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      
      const storedUsers = JSON.parse(localStorage.getItem('cleanpin_accounts') || '[]');
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

      if (isRegistering) {
        // Registration Mode: Save new user
        const existingUser = storedUsers.find((u: any) => u.email === email);
        if (existingUser) {
          setError('An account with this email already exists.');
          return;
        }

        const newUser = {
          id: `user-${email}-${Date.now()}`,
          name: (name && name.trim()) || 'Jose Gabriel',
          email: email.trim(),
          password,
          role,
          points: 0,
          level: 1,
          contributions: 0,
          achievements: []
        };
        
        storedUsers.push(newUser);
        localStorage.setItem('cleanpin_accounts', JSON.stringify(storedUsers));
        onLogin(newUser.role, newUser.name, newUser.email);
      } else {
        // Login Mode: Verify existing user
        // Exception for the default admin demo
        if (email === 'admin@cleanpin.ph') {
          onLogin('admin', 'Admin Administrator', email);
          return;
        }

        const userAccount = storedUsers.find((u: any) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
        
        if (userAccount) {
          if (userAccount.password === password) {
            onLogin(userAccount.role, userAccount.name, userAccount.email);
          } else {
            setError('Incorrect password.');
          }
        } else {
          // If user doesn't exist in local storage, let them in anyway as a new "temporary" account
          // but logically we should ask them to register.
          // For a better UX in this demo, if they aren't registered, we'll just treat them as a new user
          // but the prompt asked to SAVE them, so let's enforce registration or show error.
          setError('No account found with this email. Please register first.');
        }
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-[#f0f9f6] font-sans overflow-y-auto p-4 md:p-8 flex items-start justify-center">
      <div className="w-full max-w-md my-auto flex flex-col py-8">
        {/* Logo Section */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-4 border border-primary/10 overflow-hidden p-3"
          >
            <img src="/logo.png" alt="CleanPin Logo" className="w-full h-full object-contain" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#064e3b]">CleanPin</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Sustainable Community Mapping</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-2xl border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-6">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 flex items-center space-x-2"
              >
                <ShieldAlert size={14} />
                <span>{error}</span>
              </motion.div>
            )}
            {isRegistering && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Juan Dela Cruz"
                    className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all" />
                <span className="text-xs text-slate-500 group-hover:text-slate-700">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center space-x-2 group active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Hint Overlay */}
          <div 
            className="mt-8 pt-6 border-t border-slate-100 text-center"
          >
            <p className="text-[10px] text-slate-400 font-medium">
              Demo Access: Use any password. Use <span className="text-primary font-bold">admin@cleanpin.ph</span> for Admin access.
            </p>
          </div>
        </motion.div>

        <div className="text-center mt-6 md:mt-8">
          <p className="text-xs md:text-sm text-slate-500">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"} 
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1 font-bold text-primary hover:underline"
            >
              {isRegistering ? 'Sign In' : 'Join the Community'}
            </button>
          </p>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none hidden lg:block">
        <ShieldCheck size={400} className="text-primary" />
      </div>
    </div>
  );
};

export default Login;
