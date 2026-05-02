import React, { useState, useRef } from 'react';
import { Camera, MapPin, X, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import Map from './Map';
import { UserContribution } from '../types';
import { motion } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  posts: UserContribution[];
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, posts }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'illegal-dumping' as 'illegal-dumping' | 'missed-collection' | 'hazardous' | 'other',
    lat: 14.5995,
    lng: 120.9842,
    address: '',
    image: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const dx = (lng1 - lng2) * 107444; // Approx meters per degree longitude in Manila
    const dy = (lat1 - lat2) * 111111; // Approx meters per degree latitude
    return Math.sqrt(dx * dx + dy * dy);
  };

  const checkDuplicates = (lat: number, lng: number) => {
    const threshold = 100; // 100 meters
    const nearby = posts.find(p => getDistance(lat, lng, p.location.lat, p.location.lng) < threshold);
    if (nearby) {
      setDuplicateWarning(`Warning: There's an existing report within 100m by ${nearby.userName}. Please check if this is a duplicate.`);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({ ...formData, lat, lng });
    checkDuplicates(lat, lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      ...formData,
      createdAt: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    });
    
    setLoading(false);
    setSuccess(true);
    
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setFormData({ name: '', description: '', lat: 14.5995, lng: 120.9842, address: '', image: null });
      setStep(1);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95dvh] md:max-h-[90vh]">
        {/* Header */}
        <div className="bg-white p-4 md:p-6 border-b border-border flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-display font-bold text-[#064e3b]">Report Waste Finding</h2>
            <p className="text-[10px] md:text-xs text-muted-foreground">Add to the community activity map</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center">
            <CheckCircle size={56} className="text-primary mb-4 animate-bounce" />
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Report Submitted!</h3>
            <p className="text-xs md:text-sm text-slate-500">Thank you for your contribution to SDG 11. Your report has been published to the community dashboard.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column: Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Report Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'illegal-dumping', label: 'Illegal Dumping' },
                      { id: 'missed-collection', label: 'Missed Collection' },
                      { id: 'hazardous', label: 'Hazardous' },
                      { id: 'other', label: 'Other' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id as any })}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[10px] font-bold text-center transition-all border",
                          formData.category === cat.id 
                            ? "bg-primary text-white border-primary shadow-sm" 
                            : "bg-white text-slate-500 border-slate-200 hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reporter Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trash Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe what you found (e.g., Plastic bottles, hazardous waste, illegal dumping)"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Upload Evidence</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all",
                      formData.image ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary hover:bg-slate-50"
                    )}
                  >
                    {formData.image ? (
                      <div className="relative w-full aspect-video">
                        <img src={formData.image} alt="Waste" className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-bold">CLICK TO CHANGE</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-100 rounded-full text-slate-400 group-hover:text-primary transition-colors">
                          <Camera size={24} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500 font-medium text-center">Click to add image(s)</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Map Selection */}
              <div className="flex flex-col h-full min-h-[300px]">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  Pinpoint Location
                </label>
                <div className="flex-1 relative border border-slate-200 rounded-xl overflow-hidden">
                  <Map selectable onLocationSelect={handleLocationSelect} />
                </div>
                {duplicateWarning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2"
                  >
                    <AlertTriangle className="text-amber-600 flex-shrink-0" size={16} />
                    <p className="text-[10px] font-bold text-amber-700 leading-tight">
                      {duplicateWarning}
                    </p>
                  </motion.div>
                )}
                <p className="text-[10px] text-slate-400 mt-2 italic">Search or click on the map to set the exact location where waste was found.</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
               <div className="flex items-center space-x-2 text-primary">
                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                 <span className="text-xs font-medium">Verified Community Post</span>
               </div>
               
               <button 
                type="submit"
                disabled={loading || !formData.image || !formData.name}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-post flex items-center space-x-2 disabled:opacity-50"
               >
                 {loading ? (
                   <>
                     <Loader2 className="animate-spin" size={18} />
                     <span>POSTING...</span>
                   </>
                 ) : (
                   <>
                     <Upload size={18} />
                     <span>POST REPORT</span>
                   </>
                 )}
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
