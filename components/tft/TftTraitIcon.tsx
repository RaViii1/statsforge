"use client";

import { useState, useEffect } from "react";

interface TftTraitIconProps {
  traitId: string;
  setNumber?: number;
  tierStyle?: number;
  className?: string;
}

export default function TftTraitIcon({ traitId, setNumber, tierStyle, className }: TftTraitIconProps) {
  const traitName = traitId.toLowerCase().replace(/^(tft\d+_|set\d+_|tft_)/i, '');

  const primaryUrl = setNumber
    ? `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_${setNumber}_${traitName}.png`
    : `https://raw.communitydragon.org/latest/game/assets/ux/tft/traits/${traitName}.png`;

  const secondaryUrl = setNumber
    ? `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_${setNumber}_${traitName}.tft_set${setNumber}.png`
    : null;

  const fallbackUrl = `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_3_sniper.png`;

  const [src, setSrc] = useState(primaryUrl);
  const [retryCount, setRetryCount] = useState(0);


  const handleError = () => {
    if (retryCount === 0 && secondaryUrl) {
      setSrc(secondaryUrl);
      setRetryCount(1);
    } else if (retryCount < 2) {
      setSrc(fallbackUrl);
      setRetryCount(2);
    }
  };

  useEffect(() => {
    setSrc(primaryUrl);
    setRetryCount(0);
  }, [traitId, setNumber, primaryUrl]);

  return (
    <img 
      src={src} 
      alt={traitId}
      className={className}
      onError={handleError}
    />
  );
}
