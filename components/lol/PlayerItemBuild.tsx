import React from 'react';

interface PlayerItemBuildProps {
  // itemIds are now string | undefined | null
  itemIds: (string | undefined | null)[]; 
  // trinketId is also string | undefined | null
  trinketId: string | undefined | null; 
  getItemImage: (id: string) => string;
  getItemDescription: (id: string) => string; // Helper function expects string ID
}

const MAX_ITEM_SLOTS = 6;

export const PlayerItemBuild: React.FC<PlayerItemBuildProps> = ({
  itemIds,
  trinketId,
  getItemImage,
  getItemDescription,
}) => {
  // Ensure we have exactly 6 item slots, padding with null if necessary
  const displayItemIds = Array.from({ length: MAX_ITEM_SLOTS }, (_, i) => itemIds[i] || null);
  const displayTrinketId = trinketId || null;

  // Function to check if a string ID slot is empty
  const isSlotEmpty = (id: string | null | undefined): boolean => {
    // Check for null/undefined, empty string, or "0" (as some APIs represent empty slots as the string "0")
    return !id || id === "" || id === "0";
  };

  return (
    <div className="sm:col-span-2 lg:col-span-2">
      {/* Main Items */}
      <p className="text-xs font-medium text-orange-400 mb-1">Items ({MAX_ITEM_SLOTS} Slots)</p>
      <div className="grid grid-cols-6 gap-1">
        {displayItemIds.map((itemId, idx) => {
          const isEmpty = isSlotEmpty(itemId);
          
          // Cast itemId to string for helper functions, since we checked for null/empty
          const itemID_str = itemId || ""; 

          return (
            <div
              key={`item-${idx}`}
              className={`w-full aspect-square rounded-md overflow-hidden transition-all ${
                isEmpty
                  ? 'bg-zinc-700/50 border border-dashed border-zinc-600/50' // Placeholder style
                  : 'bg-zinc-700 border border-zinc-600 hover:border-orange-500 hover:scale-105'
              }`}
              // Pass the non-empty string ID to getItemDescription
              title={!isEmpty ? getItemDescription(itemID_str) : 'Empty Item Slot'}
            >
              {!isEmpty && (
                <img
                  // Pass the string ID to getItemImage
                  src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemID_str)}`}
                  alt={`Item ${itemID_str}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Trinket Slot (Item 6) */}
      <p className="text-xs font-medium text-orange-400 mt-2 mb-1">Trinket</p>
      <div className="w-8 h-8 rounded-md overflow-hidden bg-zinc-700 border border-zinc-600">
        {!isSlotEmpty(displayTrinketId) && (
          <img
            // Pass the string ID to getItemImage and getItemDescription
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(displayTrinketId!)}`}
            alt={`Trinket ${displayTrinketId}`}
            className="w-full h-full object-cover"
            title={getItemDescription(displayTrinketId!)}
          />
        )}
      </div>
    </div>
  );
};