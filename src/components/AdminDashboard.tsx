import React, { useState } from 'react';
import { 
  Shield, CheckCircle, Trash2, AlertCircle, Eye, 
  ExternalLink, Users, History, LayoutDashboard, 
  Settings, Search, MoreVertical, Edit2, ShieldAlert,
  Download, Filter, ChevronRight, UserPlus
} from 'lucide-react';
import { UserContribution, UserProfile, SystemLog } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  posts: UserContribution[];
  onStatusUpdate: (id: string, status: UserContribution['status']) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, onStatusUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Mock data for Users
  const [users, setUsers] = useState<UserProfile[]>([
    {
      uid: 'admin-1',
      displayName: 'Admin Administrator',
      email: 'admin@cleanpin.ph',
      role: 'admin',
      points: 1200,
      level: 25,
      contributions: 45,
      achievements: [],
      isBanned: false
    },
    {
      uid: 'user-1',
      displayName: 'Jose Gabriel',
      email: 'josegabriel@cleanpin.ph',
      role: 'user',
      points: 450,
      level: 12,
      contributions: 12,
      achievements: [],
      isBanned: false
    },
    {
      uid: 'user-2',
      displayName: 'Maria Santos',
      email: 'maria.santos@gmail.com',
      role: 'user',
      points: 890,
      level: 18,
      contributions: 28,
      achievements: [],
      isBanned: false
    },
    {
      uid: 'user-3',
      displayName: 'Kevin Ramos',
      email: 'kevin.r@yahoo.com',
      role: 'user',
      points: 120,
      level: 5,
      contributions: 4,
      achievements: [],
      isBanned: false
    }
  ]);

  // Mock data for System Logs
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    { id: 'l1', action: 'Login Success', user: 'admin@cleanpin.ph', timestamp: Date.now() - 1000 * 60 * 5, type: 'auth' },
    { id: 'l2', action: 'Verified Report #X452', user: 'admin@cleanpin.ph', target: 'Report #X452', timestamp: Date.now() - 1000 * 60 * 60, type: 'moderation' },
    { id: 'l3', action: 'New User Registered', user: 'System', target: 'kevin.r@yahoo.com', timestamp: Date.now() - 1000 * 60 * 60 * 3, type: 'user' },
    { id: 'l4', action: 'Updated User Role', user: 'admin@cleanpin.ph', target: 'maria.santos@gmail.com', timestamp: Date.now() - 1000 * 60 * 60 * 5, type: 'user' },
    { id: 'l5', action: 'System Backup Complete', user: 'System', timestamp: Date.now() - 1000 * 60 * 60 * 12, type: 'system' }
  ]);

  // Modal States
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: UserProfile | null }>({ isOpen: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: UserProfile | null }>({ isOpen: false, user: null });
  const [banModal, setBanModal] = useState<{ isOpen: boolean; user: UserProfile | null }>({ isOpen: false, user: null });

  const addLog = (action: string, target?: string, type: SystemLog['type'] = 'user') => {
    const newLog: SystemLog = {
      id: `l-${Date.now()}`,
      action,
      user: 'admin@cleanpin.ph',
      target,
      timestamp: Date.now(),
      type
    };
    setSystemLogs([newLog, ...systemLogs]);
  };

  const handleUpdateUserInfo = (uid: string, name: string, email: string) => {
    setUsers(users.map(u => u.uid === uid ? { ...u, displayName: name, email: email } : u));
    addLog('Updated User Profile', email);
    setEditModal({ isOpen: false, user: null });
  };

  const handleConfirmDelete = (uid: string) => {
    const user = users.find(u => u.uid === uid);
    if (user) {
      setUsers(users.filter(u => u.uid !== uid));
      addLog('Deleted User Account', user.email, 'moderation');
    }
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleConfirmBan = (uid: string, duration: string) => {
    const user = users.find(u => u.uid === uid);
    if (user) {
      const isUnbanning = user.isBanned;
      setUsers(users.map(u => u.uid === uid ? { ...u, isBanned: !isUnbanning } : u));
      addLog(isUnbanning ? 'Unbanned User' : `Banned User (${duration})`, user.email, 'moderation');
    }
    setBanModal({ isOpen: false, user: null });
  };

  const handleAddUser = () => {
    const name = prompt('Enter user full name:');
    if (!name) return;
    const email = prompt('Enter user email:');
    if (!email) return;

    const newUser: UserProfile = {
      uid: `u-${Date.now()}`,
      displayName: name,
      email: email,
      role: 'user',
      points: 0,
      level: 1,
      contributions: 0,
      achievements: []
    };

    setUsers([...users, newUser]);
    addLog('Manually Added User', email);
    alert(`User ${name} has been created.`);
  };

  const handleExportData = (type: string) => {
    alert(`Exporting ${type} as CSV... (Mock Download)`);
    addLog(`Exported ${type} Data`, undefined, 'system');
  };

  const handleToggleRole = (uid: string) => {
    setUsers(users.map(u => {
      if (u.uid === uid) {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        addLog(`Changed role to ${newRole}`, u.email);
        return { ...u, role: newRole as 'admin' | 'user' };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const verifiedPosts = posts.filter(p => p.status === 'verified');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Admin Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">Admin Control Center</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage users, moderate reports, and track system activities.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2",
              activeTab === 'overview' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <LayoutDashboard size={14} /> <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('moderation')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2",
              activeTab === 'moderation' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Shield size={14} /> <span>Moderation</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2",
              activeTab === 'users' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Users size={14} /> <span>Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2",
              activeTab === 'logs' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <History size={14} /> <span>Logs</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <AlertCircle size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Queue</h3>
                  <p className="text-3xl font-display font-bold text-slate-800">{pendingPosts.length}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Users size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+5%</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Users</h3>
                  <p className="text-3xl font-display font-bold text-slate-800">{users.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Verified Total</h3>
                  <p className="text-3xl font-display font-bold text-slate-800">{verifiedPosts.length}</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Shield size={20} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Health Score</h3>
                  <p className="text-3xl font-display font-bold text-white">99.8%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity Mini-List */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">System Health</h3>
                    <button className="text-[10px] font-bold text-primary flex items-center">
                      DETAILS <ChevronRight size={10} className="ml-1" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">API Latency</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">42ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">Database Load</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">14%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-xs font-medium text-slate-600">Storage Usage</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">68%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">Recent Actions</h3>
                    <button onClick={() => setActiveTab('logs')} className="text-[10px] font-bold text-primary flex items-center">
                      VIEW ALL <ChevronRight size={10} className="ml-1" />
                    </button>
                  </div>
                  <div className="divide-y divide-border/50">
                    {systemLogs.slice(0, 3).map(log => (
                      <div key={log.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs",
                            log.type === 'auth' ? "bg-amber-50 text-amber-600" :
                            log.type === 'user' ? "bg-blue-50 text-blue-600" :
                            "bg-slate-50 text-slate-600"
                          )}>
                            {log.type === 'auth' ? <ShieldAlert size={14} /> : <History size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{log.action}</p>
                            <p className="text-[10px] text-slate-400">{log.user}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{formatDistanceToNow(log.timestamp)} ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-display font-bold text-[#064e3b]">Community Moderation</h2>
                  <p className="text-xs text-muted-foreground">Verify and organize user-submitted reports.</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 border border-border">
                     <Filter size={18} />
                   </button>
                   <button 
                    onClick={() => handleExportData('Moderation')}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 border border-border"
                   >
                     <Download size={18} />
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full text-left min-w-[800px]">
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
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden shadow-sm border border-white">
                              {post.userAvatar ? (
                                <img src={post.userAvatar} className="w-full h-full object-cover" alt="User" />
                              ) : post.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{post.userName}</p>
                              <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(post.createdAt)} ago</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3 max-w-sm">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border shadow-sm group-hover:scale-105 transition-transform">
                              <img src={post.imageUrl} className="w-full h-full object-cover" alt="Trash" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 uppercase">{post.category}</span>
                                <button className="text-[9px] font-bold text-primary hover:underline flex items-center">
                                  <Eye size={10} className="mr-1" /> MAP
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-lg text-[9px] font-bold uppercase",
                            post.status === 'verified' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                            post.status === 'resolved' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            post.status === 'in-progress' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-slate-50 text-slate-700 border border-slate-100"
                          )}>
                            {post.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {post.status === 'pending' && (
                              <button 
                                onClick={() => onStatusUpdate(post.id, 'verified')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                title="Verify Report"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            
                            {post.status === 'verified' && (
                              <button 
                                onClick={() => onStatusUpdate(post.id, 'in-progress')}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                                title="Mark In-Progress"
                              >
                                <AlertCircle size={16} />
                              </button>
                            )}

                            {post.status === 'in-progress' && (
                              <button 
                                onClick={() => onStatusUpdate(post.id, 'resolved')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                title="Mark Resolved"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => onDelete(post.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Delete Report"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              onClick={() => alert(`Showing detailed report history for report by ${post.userName}`)}
                              className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                              title="More Options"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {posts.length === 0 && (
                  <div className="py-20 text-center">
                    <Shield size={48} className="text-slate-100 mx-auto mb-4" />
                    <p className="font-bold text-slate-400 text-sm">No reports to moderate at this time.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-display font-bold text-[#064e3b]">User Management</h2>
                  <p className="text-xs text-muted-foreground">Monitor and update user profiles and roles.</p>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                   <button 
                    onClick={handleAddUser}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors whitespace-nowrap"
                   >
                      <UserPlus size={14} /> <span>ADD USER</span>
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredUsers.map((user) => (
                      <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                               {user.photoURL ? (
                                 <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                               ) : user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                            </div>
                            <div>
                               <div className="flex items-center space-x-2">
                                  <p className={cn("text-sm font-bold", user.isBanned ? "text-red-500 line-through" : "text-slate-800")}>
                                    {user.displayName}
                                    {user.isBanned && <span className="ml-2 text-[10px] font-black text-red-600 border border-red-200 bg-red-50 px-1 rounded uppercase">BANNED</span>}
                                  </p>
                                  <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1 rounded uppercase">Lvl {user.level}</span>
                               </div>
                               <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleToggleRole(user.uid)}
                            className={cn(
                              "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all",
                              user.role === 'admin' ? "bg-primary text-white border border-primary" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                            )}>
                            <Shield size={10} /> <span>{user.role}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                             <span className="text-xs font-bold text-slate-800">{user.points.toLocaleString()}</span>
                             <span className="text-[9px] text-slate-400 font-medium uppercase">{user.contributions} Posts</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                             <button 
                              onClick={() => setEditModal({ isOpen: true, user })}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                              title="Edit User"
                             >
                                <Edit2 size={16} />
                             </button>
                             <button 
                              onClick={() => setDeleteModal({ isOpen: true, user })}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete User"
                             >
                                <Trash2 size={16} />
                             </button>
                             <button 
                              onClick={() => setBanModal({ isOpen: true, user })}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                user.isBanned ? "text-amber-500 bg-amber-50" : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                              )}
                              title={user.isBanned ? "Unban User" : "Ban User"}
                             >
                                <ShieldAlert size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden min-h-[400px]">
               <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-[#064e3b]">System Activity Logs</h2>
                  <p className="text-xs text-muted-foreground">Real-time tracking of platform transactions.</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button 
                    onClick={() => {
                      if(confirm('Clear all system activity logs?')) setSystemLogs([]);
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center uppercase tracking-widest"
                   >
                     CLEAR LOGS
                   </button>
                   <div className="h-4 w-[1px] bg-border mx-2" />
                   <button 
                    onClick={() => handleExportData('System Logs')}
                    className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-border"
                   >
                     <Download size={16} />
                   </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                 {systemLogs.map((log, i) => (
                   <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={log.id} 
                    className="flex flex-col md:flex-row md:items-center p-4 rounded-xl border border-border/50 hover:border-border transition-colors bg-slate-50/50 gap-4"
                   >
                     <div className="flex items-center space-x-3 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm",
                          log.type === 'auth' ? "bg-amber-50 text-amber-600 border-amber-100" :
                          log.type === 'user' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          log.type === 'moderation' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          "bg-slate-50 text-slate-500 border-slate-200"
                        )}>
                           {log.type === 'auth' ? <ShieldAlert size={18} /> : 
                            log.type === 'user' ? <Users size={18} /> : 
                            log.type === 'moderation' ? <CheckCircle size={18} /> : 
                            <Settings size={18} />}
                        </div>
                        <div>
                           <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-slate-800">{log.action}</h4>
                              <span className={cn(
                                "text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase",
                                log.type === 'auth' ? "bg-amber-100 text-amber-600 border-amber-200" :
                                log.type === 'user' ? "bg-blue-100 text-blue-600 border-blue-200" :
                                log.type === 'moderation' ? "bg-emerald-100 text-emerald-600 border-emerald-200" :
                                "bg-slate-100 text-slate-500 border-slate-200"
                              )}>{log.type}</span>
                           </div>
                           <p className="text-xs text-muted-foreground mt-0.5">
                             By <span className="font-bold text-slate-600">{log.user}</span> 
                             {log.target && <> targeting <span className="text-primary font-medium">{log.target}</span></>}
                           </p>
                        </div>
                     </div>
                     <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-slate-800">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.user && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">Edit User Profile</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateUserInfo(editModal.user!.uid, formData.get('name') as string, formData.get('email') as string);
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input name="name" defaultValue={editModal.user.displayName} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
                  <input name="email" type="email" defaultValue={editModal.user.email} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold" />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setEditModal({ isOpen: false, user: null })} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">CANCEL</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all uppercase">SAVE CHANGES</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && deleteModal.user && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete User?</h3>
              <p className="text-sm text-slate-500 mb-8">This will permanently remove <span className="font-bold text-slate-700">{deleteModal.user.displayName}</span> and all associated data. This action is irreversible.</p>
              <div className="flex space-x-3">
                <button onClick={() => setDeleteModal({ isOpen: false, user: null })} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">CANCEL</button>
                <button onClick={() => handleConfirmDelete(deleteModal.user!.uid)} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all uppercase">DELETE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ban / Unban Modal */}
      <AnimatePresence>
        {banModal.isOpen && banModal.user && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {banModal.user.isBanned ? 'Revoke Ban' : 'Restrict User Access'}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {banModal.user.isBanned 
                  ? `Are you sure you want to restore full access for ${banModal.user.displayName}?`
                  : `Select ban duration for ${banModal.user.displayName}. While banned, they cannot post or contribute.`
                }
              </p>
              
              {!banModal.user.isBanned ? (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {['24 Hours', '7 Days', '30 Days', 'Permanent'].map((duration) => (
                    <button 
                      key={duration}
                      onClick={() => handleConfirmBan(banModal.user!.uid, duration)}
                      className="px-4 py-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-xl text-xs font-bold text-slate-600 hover:text-amber-700 transition-all text-center uppercase"
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button onClick={() => setBanModal({ isOpen: false, user: null })} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors uppercase">KEEP BANNED</button>
                  <button onClick={() => handleConfirmBan(banModal.user!.uid, 'N/A')} className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all uppercase">UNBAN USER</button>
                </div>
              )}
              
              {!banModal.user.isBanned && (
                <button onClick={() => setBanModal({ isOpen: false, user: null })} className="w-full py-3 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors uppercase">CANCEL</button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
