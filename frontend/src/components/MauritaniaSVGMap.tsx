import React from 'react';

// SVG détaillée de la Mauritanie (exemple simplifié, à remplacer par une SVG officielle si besoin)
const MauritaniaSVGMap: React.FC<{ onZoneClick?: (zone: string) => void }> = ({ onZoneClick }) => (
  <svg viewBox="0 0 600 600" width="100%" height="auto" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }}>
    <g>
      {/* Exemple de zones, à remplacer par les vraies zones administratives */}
      <path
        d="M 100 100 L 500 100 L 500 300 L 100 300 Z"
        fill="#e2c044"
        stroke="#333"
        strokeWidth="2"
        onClick={() => onZoneClick && onZoneClick('Zone Nord')}
        style={{ cursor: 'pointer' }}
      />
      <path
        d="M 100 300 L 500 300 L 500 500 L 100 500 Z"
        fill="#b5c99a"
        stroke="#333"
        strokeWidth="2"
        onClick={() => onZoneClick && onZoneClick('Zone Sud')}
        style={{ cursor: 'pointer' }}
      />
      <text x="300" y="200" textAnchor="middle" fontSize="24" fill="#333">Zone Nord</text>
      <text x="300" y="400" textAnchor="middle" fontSize="24" fill="#333">Zone Sud</text>
      <text x="300" y="50" textAnchor="middle" fontSize="32" fill="#333">Mauritanie</text>
    </g>
  </svg>
);

export default MauritaniaSVGMap;
