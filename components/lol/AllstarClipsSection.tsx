"use client";

import { useEffect, useState } from "react";
import { Play, Loader2, Film, ExternalLink } from "lucide-react";

interface AllstarClip {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: number;
  createdAt: string;
  viewCount?: number;
}

interface AllstarClipsSectionProps {
  gameName: string;
  tagLine: string;
}

export function AllstarClipsSection({ gameName, tagLine }: AllstarClipsSectionProps) {
  const [clips, setClips] = useState<AllstarClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/allstar/clips?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load clips');
        }

        const data = await response.json();
        setClips(data.clips || []);
      } catch (err) {
        console.error('Error fetching clips:', err);
        setError(err instanceof Error ? err.message : 'Failed to load highlights');
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, [gameName, tagLine]);

  if (loading) {
    return (
      <div className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
          <p className="text-sm text-zinc-400">Loading highlights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
        <div className="flex items-center gap-3 text-zinc-400">
          <Film className="w-5 h-5" />
          <div>
            <p className="text-sm font-semibold text-white">No Highlights Available</p>
            <p className="text-xs text-zinc-500">Clips will appear here when available</p>
          </div>
        </div>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
        <div className="flex items-center gap-3 text-zinc-400">
          <Film className="w-5 h-5" />
          <div>
            <p className="text-sm font-semibold text-white">No Highlights Yet</p>
            <p className="text-xs text-zinc-500">Play more games to generate highlights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600/20 border border-orange-500/30 rounded-lg flex items-center justify-center">
            <Film className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Player Highlights</h3>
            <p className="text-xs text-zinc-500">Powered by Allstar.gg</p>
          </div>
        </div>
        <div className="text-xs text-zinc-500">{clips.length} clips</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <a
            key={clip.id}
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-video rounded-xl overflow-hidden border border-zinc-800/50 hover:border-orange-500/50 transition-all cursor-pointer bg-zinc-900/40"
          >
            <img
              src={clip.thumbnail}
              alt={clip.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-orange-600/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white line-clamp-2 flex-1">
                  {clip.title}
                </p>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-orange-400 transition-colors flex-shrink-0" />
              </div>
              {clip.viewCount !== undefined && (
                <p className="text-xs text-zinc-400 mt-1">{clip.viewCount.toLocaleString()} views</p>
              )}
            </div>

            {clip.duration && (
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs text-white font-semibold">
                {Math.floor(clip.duration / 60)}:{String(clip.duration % 60).padStart(2, '0')}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
