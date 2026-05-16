'use client';

import { useState } from "react";
import { LayoutDashboard, Users, User, Shield, ShieldAlert, ShieldCheck, Crown, CheckCircle2 } from "lucide-react";

interface AdminTabsProps {
  overviewContent: React.ReactNode;
  usersContent: React.ReactNode;
}

export default function AdminTabs({ overviewContent, usersContent }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/6">
        <button
          onClick={() => setActiveTab('overview')}
          onMouseEnter={(e) => {
            if (activeTab !== 'overview') {
              const underline = e.currentTarget.querySelector('.tab-underline') as HTMLElement;
              if (underline) underline.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'overview') {
              const underline = e.currentTarget.querySelector('.tab-underline') as HTMLElement;
              if (underline) underline.style.opacity = '0';
            }
          }}
          className={`relative px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-all tracking-wider ${
            activeTab === 'overview' ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard size={16} />
          Overview
          <div 
            className="tab-underline absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-200"
            style={{ opacity: activeTab === 'overview' ? 1 : 0 }}
          />
        </button>
        
        <button
          onClick={() => setActiveTab('users')}
          onMouseEnter={(e) => {
            if (activeTab !== 'users') {
              const underline = e.currentTarget.querySelector('.tab-underline') as HTMLElement;
              if (underline) underline.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'users') {
              const underline = e.currentTarget.querySelector('.tab-underline') as HTMLElement;
              if (underline) underline.style.opacity = '0';
            }
          }}
          className={`relative px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-all tracking-wider ${
            activeTab === 'users' ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users size={16} />
          Registered Users
          <div 
            className="tab-underline absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-200"
            style={{ opacity: activeTab === 'users' ? 1 : 0 }}
          />
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'overview' ? overviewContent : usersContent}
      </div>
    </div>
  );
}

export function UserList({ users }: { users: any[] }) {
  return (
    <div className="bg-zinc-900/60 border border-white/6 rounded-xl overflow-hidden backdrop-blur-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950/50 text-zinc-500 border-b border-white/6">
          <tr>
            <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">User</th>
            <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Role</th>
            <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Status</th>
            <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Last Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <User size={14} className="text-zinc-500" />
                  </div>
                  <div className="font-semibold text-white">{user.username || 'Anonymous'}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                  user.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  user.role === 'moderator' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {user.role === 'admin' && <ShieldAlert size={10} />}
                  {user.role === 'moderator' && <ShieldCheck size={10} />}
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                {user.premium_user ? (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                    <Crown size={10} />
                    Premium
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                    <CheckCircle2 size={10} />
                    Active
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-zinc-500 text-sm">
                {new Date(user.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No users found</p>
        </div>
      )}
    </div>
  );
}
