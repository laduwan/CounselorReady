import React from 'react';
import {BRAND, TINT} from '../brand';
import {DISPLAY_FONT} from '../fonts';

export const Chip: React.FC<{
  label: string;
  tone?: 'emerald' | 'navy';
  fontSize?: number;
}> = ({label, tone = 'emerald', fontSize = 30}) => {
  const color = tone === 'emerald' ? BRAND.emerald : BRAND.navy;
  const bg = tone === 'emerald' ? TINT.emeraldSoft : TINT.navySoft;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: `${fontSize * 0.42}px ${fontSize * 0.86}px`,
        borderRadius: 999,
        background: bg,
        border: `2px solid ${color}`,
        color,
        fontFamily: DISPLAY_FONT,
        fontWeight: 700,
        fontSize,
        letterSpacing: 0.6,
        lineHeight: 1,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  );
};
