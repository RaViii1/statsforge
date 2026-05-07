'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, filename: string) => void;
  currentImage?: string;
  storageBucket?: 'item-icons' | 'TftUnitIcons' | 'Lol_runes';
  folder?: string;
}

export default function ImagePickerModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentImage,
  storageBucket = 'item-icons',
  folder
}: ImagePickerModalProps) {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const uploadEndpoint = '/api/admin/upload-image';
  const bucketBaseUrl = storageBucket === 'item-icons'
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-icons`
    : storageBucket === 'TftUnitIcons'
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons`
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Lol_runes`;

  useEffect(() => {
    if (isOpen && storageBucket === 'item-icons') {
      fetchImages();
    } else if (isOpen && storageBucket === 'TftUnitIcons' && folder) {
      fetchTftImages();
    } else if (isOpen && storageBucket === 'Lol_runes' && folder) {
      fetchLolRunesImages();
    }
  }, [isOpen, storageBucket, folder]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/item-icons');
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      }
      if (data.images) {
        setImages(data.images);
      } else if (data.images === undefined && !data.error) {
        setImages([]);
      }
    } catch (err) {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const fetchTftImages = async () => {
    if (!folder) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/list-images?folder=${folder}`);
      const data = await res.json();
      if (data.files) {
        setImages(data.files.map((f: any) => ({
          name: f.name,
          url: `${bucketBaseUrl}/${f.name}`
        })));
      }
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const fetchLolRunesImages = async () => {
    if (!folder) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/list-runes-images?folder=${folder}`);
      const data = await res.json();
      if (data.files) {
        setImages(data.files);
      }
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (folder) fd.append('folder', folder);
      fd.append('bucket', storageBucket);
      
      const res = await fetch(uploadEndpoint, { method: 'POST', body: fd });
      const result = await res.json();
      
      if (!res.ok) {
        toast.error(result.error || 'Upload failed');
        setUploading(false);
        return;
      }
      
      const fileUrl = result.url || result.filename
        ? `${bucketBaseUrl}/${result.filename || file.name.toLowerCase()}`
        : `${bucketBaseUrl}/${file.name.toLowerCase()}`;

      onSelect(fileUrl, result.filename || file.name.toLowerCase());
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (url: string, name: string) => {
    setSelectedImage(url);
    onSelect(url, name.toLowerCase());
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[90vw] max-w-3xl h-[80vh] bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white">Select Icon</h3>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-800 flex gap-3">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-orange-500"
          />
          <label className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl cursor-pointer transition-colors">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <ImageIcon className="w-10 h-10 mb-2" />
              <p>No images found</p>
              <p className="text-xs mt-2 text-zinc-600">Storage bucket appears empty or inaccessible</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <ImageIcon className="w-10 h-10 mb-2" />
              <p>No images match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredImages.map((img) => (
                <button
                  key={img.name}
                  onClick={() => handleSelect(img.url, img.name)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-zinc-800 border-2 transition-all hover:scale-105 ${
                    selectedImage === img.url || currentImage?.includes(img.name)
                      ? 'border-orange-500'
                      : 'border-transparent hover:border-zinc-600'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/noitem.png';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
            <button
              onClick={() => {
                onSelect(selectedImage, selectedImage.split('/').pop() || '');
                onClose();
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Select
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}