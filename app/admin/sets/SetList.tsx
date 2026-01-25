'use client';

import { Trash2, Edit2, Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TFTSet } from "@/lib/tft/champions";

interface SetsListProps {
  initialSets: TFTSet[];
}

export default function SetsList({ initialSets }: SetsListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/sets?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Set deleted");
      setConfirmDelete(null);
      router.refresh();
    } catch (error) {
      toast.error("Error deleting set");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (set: TFTSet) => {
    try {
      const res = await fetch(`/api/admin/sets`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...set, is_active: !set.is_active }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Set ${!set.is_active ? 'activated' : 'deactivated'}`);
      router.refresh();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleEdit = (set: TFTSet) => { 
    window.dispatchEvent(new CustomEvent('edit-set', { detail: set }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = initialSets.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-white shrink-0">Sets ({filtered.length})</h2>
        <div className="relative flex-1 max-w-xs">
          <input 
            type="text"
            placeholder="Search sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-orange-500/50 outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered?.map((set) => (
          <div
            key={set.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-xl font-black text-orange-500 border border-zinc-800">
                  {set.set_number}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{set.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    {set.created_at && <span>Created {new Date(set.created_at).toLocaleDateString()}</span>}
                    {set.created_at && <span>•</span>}
                    <span className={set.is_active ? "text-emerald-500 font-bold" : "text-zinc-500"}>
                      {set.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {confirmDelete === String(set.id) ? (
                <div className="flex items-center gap-2 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                  <span className="text-xs font-bold text-red-500 px-2">Delete?</span>
                  <button 
                    onClick={() => handleDelete(String(set.id))}
                    disabled={isDeleting === String(set.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleStatus(set)}
                    className={`p-2 rounded-lg transition-all ${
                      set.is_active 
                        ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                    title={set.is_active ? "Deactivate" : "Activate"}
                  >
                    {set.is_active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </button>
                  
                  <button 
                    onClick={() => handleEdit(set)}
                    className="p-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(String(set.id))}
                    className="p-2 bg-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">No sets found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
