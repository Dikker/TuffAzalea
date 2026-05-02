import React from 'react';
import { Shield, CheckCircle, Trash2, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import { UserContribution } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

interface AdminDashboardProps {
  posts: UserContribution[];
  onStatusUpdate: (id: string, status: UserContribution['status']) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, onStatusUpdate, onDelete }) => {
  const pendingPosts = posts.filter(p => p.status === 'pending');
  const verifiedPosts = posts.filter(p => p.status === 'verified');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Verification</h3>
          </div>
          <p className="text-3xl font-display font-bold text-slate-800">{pendingPosts.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified Today</h3>
          </div>
          <p className="text-3xl font-display font-bold text-slate-800">{verifiedPosts.length}</p>
        </div>

        <div className="bg-primary p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">Trust Score</h3>
          </div>
          <p className="text-3xl font-display font-bold">98.2%</p>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-[#064e3b]">Community Moderation</h2>
            <p className="text-xs text-muted-foreground">Verify or remove reports from the community map</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reporter</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Content</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {post.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{post.userName}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(post.createdAt)} ago</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3 max-w-md">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        <img src={post.imageUrl} className="w-full h-full object-cover" alt="Trash" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>
                        <button className="text-[10px] font-bold text-primary mt-1 hover:underline flex items-center">
                          <Eye size={10} className="mr-1" /> PREVIEW MAP
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-lg text-[9px] font-bold uppercase",
                      post.status === 'verified' ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : 
                      post.status === 'resolved' ? "bg-blue-100 text-blue-700 border border-blue-200" :
                      post.status === 'in-progress' ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-slate-100 text-slate-700 border border-slate-200"
                    )}>
                      {post.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {post.status === 'pending' && (
                        <button 
                          onClick={() => onStatusUpdate(post.id, 'verified')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          title="Verify Report"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {post.status === 'verified' && (
                        <button 
                          onClick={() => onStatusUpdate(post.id, 'in-progress')}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          title="Mark In-Progress"
                        >
                          <AlertCircle size={18} />
                        </button>
                      )}

                      {post.status === 'in-progress' && (
                        <button 
                          onClick={() => onStatusUpdate(post.id, 'resolved')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Mark Resolved"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => onDelete(post.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {posts.length === 0 && (
            <div className="p-20 text-center">
              <Shield size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="font-bold text-slate-400">No reports to moderate at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
