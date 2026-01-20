import React from 'react';

// SVG map of Mauritania (simplified, you can replace with a detailed SVG if needed)
const MauritaniaMap: React.FC = () => (
  <div style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
    <svg viewBox="0 0 400 400" width="100%" height="auto">
      <g>
        <title>Mauritania</title>
        <path
          d="M 50 50 L 350 50 L 350 350 L 50 350 Z"
          fill="#e2c044"
          stroke="#333"
          strokeWidth="4"
        />
        <text x="200" y="200" textAnchor="middle" fontSize="32" fill="#333">
          Mauritania
        </text>
      </g>
    </svg>
  </div>
);

export default MauritaniaMap;
