'use client';

import { useState } from "react";
import { LayoutDashboard, Users, User, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface AdminTabsProps {
  overviewContent: React.ReactNode;
  usersContent: React.ReactNode;
}

export default function AdminTabs({ overviewContent, usersContent }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
            activeTab === 'overview' ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard size={16} />
          Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
            activeTab === 'users' ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users size={16} />
          Registered Users
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'overview' ? overviewContent : usersContent}
      </div>
    </div>
  );
}

export function UserList({ users }: { users: any[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
          <tr>
            <th className="px-6 py-4 font-black uppercase text-[10px]">User</th>
            <th className="px-6 py-4 font-black uppercase text-[10px]">Role</th>
            <th className="px-6 py-4 font-black uppercase text-[10px]">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <User size={14} className="text-zinc-500" />
                  </div>
                  <div className="font-bold text-white">{user.username || 'Anonymous'}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 w-fit ${
                  user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                  user.role === 'moderator' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {user.role === 'admin' && <ShieldAlert size={10} />}
                  {user.role === 'moderator' && <ShieldCheck size={10} />}
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-zinc-500">
                {new Date(user.updated_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
