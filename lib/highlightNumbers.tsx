import SvgIcon from "@/components/SvgIcon";

export const highlightNumbers = (text: string) => {
  return text.split(/(\d+(\.\d+)?)/g).map((part, index) => {
    if (/^\d+(\.\d+)?$/.test(part)) {
      return <span key={index} className="text-orange-500 font-bold">{part}</span>;
    }
    return part;
  });
};

export const parseTextWithIcons = (text: string) => {
  // Map of terms to icon types and colors (using STAT_ICON_MAP colors)
  const iconMap: Record<string, { type: string; color: string }> = {
    '(AP)': { type: 'ap', color: 'text-blue-500' },
    '{AP}': { type: 'ap', color: 'text-blue-500' },
    '(AD)': { type: 'dmg', color: 'text-orange-500' },
    '{AD}': { type: 'dmg', color: 'text-orange-500' },
    '(HP)': { type: 'health', color: 'text-green-400' },
    '{HP}': { type: 'health', color: 'text-green-400' },
    '(Armor)': { type: 'armor', color: 'text-orange-400' },
    '{Armor}': { type: 'armor', color: 'text-orange-400' },
    '(MR)': { type: 'mr', color: 'text-purple-500' },
    '{MR}': { type: 'mr', color: 'text-purple-500' },
    '(Crit)': { type: 'crit', color: 'text-red-500' },
    '{Crit}': { type: 'crit', color: 'text-red-500' },
    '(AS)': { type: 'attackspeed', color: 'text-yellow-300' },
    '{AS}': { type: 'attackspeed', color: 'text-yellow-300' },
    '(Mana)': { type: 'mana', color: 'text-cyan-400' },
    '{Mana}': { type: 'mana', color: 'text-cyan-400' },
    '(Gold)': { type: 'gold', color: 'text-yellow-500' },
    '{Gold}': { type: 'gold', color: 'text-yellow-500' },
    '(Lifesteal)': { type: 'lifesteal', color: 'text-red-600' },
    '{Lifesteal}': { type: 'lifesteal', color: 'text-red-600' },
    '(DmgAmp)': { type: 'dmgamp', color: 'text-white' },
    '{DmgAmp}': { type: 'dmgamp', color: 'text-white' },
    '(CritDmg)': { type: 'crit', color: 'text-white' },
    '{CritDmg}': { type: 'crit', color: 'text-white' },
    '(Healing)': { type: 'health', color: 'text-green-400' },
    '{Healing}': { type: 'health', color: 'text-green-400' },
    '(Shield)': { type: 'armor', color: 'text-white' },
    '{Shield}': { type: 'armor', color: 'text-white' }
  };

  // Create a regex pattern to match any of the terms in the iconMap
  const pattern = new RegExp(`(${Object.keys(iconMap).map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

  // Split the text and replace terms with icons
  return text.split(pattern).map((part, index) => {
    if (iconMap[part]) {
      return (
        <span key={index} className="inline-flex items-center gap-1">
          <SvgIcon type={iconMap[part].type as any} size={14} className={iconMap[part].color} />
        </span>
      );
    }
    return part;
  });
};

// Function to apply both highlighting and icon parsing
export const formatText = (text: string) => {
  // First parse for icons
  const withIcons = parseTextWithIcons(text);
  
  // Then highlight numbers in the resulting text
  return withIcons.map((part, index) => {
    if (typeof part === 'string') {
      return highlightNumbers(part);
    }
    return part;
  });
};
