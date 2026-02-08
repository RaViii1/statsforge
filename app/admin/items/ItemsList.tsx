'use client';

import { Trash2, Edit2, Search, Info, Box } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TFTItem } from "@/lib/tft/itemstft";
import SvgIcon from "@/components/SvgIcon";

interface ItemListProps {
  initialItems: any[];
}

export default function ItemList({ initialItems }: ItemListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/items?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Item deleted");
      router.refresh();
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (item: any) => {
    window.dispatchEvent(new CustomEvent('edit-item', { detail: item }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = initialItems.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-white shrink-0">Items ({filtered.length})</h2>
        <div className="relative flex-1 max-w-xs">
          <input 
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-green-500/50 outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-xl border-2 overflow-hidden bg-zinc-950 flex items-center justify-center ${
                  item.is_radiant ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' :
                  item.is_artifact ? 'border-red-500 shadow-lg shadow-red-600/10' :
                  'border-zinc-800'
                }`}>
                  {item.image_path ? (
                    <img src={item.image_path} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                     <img src={"images/noitem.png"} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                  {item.is_component && <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-black">Comp</span>}
                </div>
                <p className="text-xs text-zinc-500">Set {item.tft_sets?.set_number} • {item.tft_sets?.name}</p>
                
                <div className="mt-3 space-y-2">
                 
                  {/* Stats Display */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.stats || {}).map(([key, value]) => {
                      if (!value || value === 0) return null;
                      const iconMap: Array<{id: string, icon: string, color: string}> = [
                        { id: 'hp', icon: 'health', color: 'text-green-400' },
                        { id: 'ap', icon: 'ap', color: 'text-blue-500' },
                        { id: 'ad', icon: 'dmg', color: 'text-orange-500' },
                        { id: 'as', icon: 'attackspeed', color: 'text-yellow-300' },
                        { id: 'armor', icon: 'armor', color: 'text-orange-400' },
                        { id: 'mr', icon: 'mr', color: 'text-purple-500' },
                        { id: 'mana', icon: 'mana', color: 'text-cyan-400' },
                        { id: 'crit', icon: 'crit', color: 'text-red-500' },
                        { id: 'lifesteal', icon: 'lifesteal', color: 'text-red-600' },
                        { id: 'dmgAmp', icon: 'dmgamp', color: 'text-white' }
                      ];
                      const stat = iconMap.find(s => s.id === key);
                      return (
                        <div key={key} className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-950/50 px-2 py-1 rounded-lg border border-zinc-800/50">
                          <SvgIcon type={stat?.icon as any || 'ap'} size={12} className={stat?.color}/>
                          <span className="font-bold">+{String(value)}{key === 'as' ? '%' : ''}</span>
                          <span className="uppercase text-[8px] opacity-50">{key}</span>
                        </div>
                      );
                    })}
                  </div>
                  {item.build_path && item.build_path.length > 0 && (
                    <div className="flex flex-col gap-1.5 text-[10px] text-zinc-400">
                    <span className="uppercase text-[8px] mr-1">Components:</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                      {item.build_path.map((componentId: string, index: number) => {
                        const component = initialItems.find(i => i.id === componentId);
                        return (
                          <div key={`${componentId}-${index}`} className="flex items-center gap-1">
                            {component?.image_path ? (
                              <img 
                                src={component.image_path} 
                                alt={component.name} 
                                className="w-4 h-4 rounded border border-zinc-700"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                              />
                            ) : (
                              <div className="w-4 h-4 rounded bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[8px] text-zinc-400">
                                ?
                              </div>
                            )}
                            <span className="px-1 py-0.5 text-[8px] bg-zinc-800 rounded text-zinc-400">
                              {component?.name || componentId}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-zinc-800/50 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting === item.id}
                  className="p-2 bg-zinc-800/50 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
