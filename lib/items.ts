export interface Item {
  id: string;
  name: string;
  stats: any;
  description: string;
  image_path: string;
  riot_api_id?: string;
  gamemode?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to build image URL from image_path
export const getItemImage = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "/images/noitem.png";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-icons/${imagePath}`;
};

