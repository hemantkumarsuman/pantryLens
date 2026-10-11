import React from 'react';

/**
 * Pure SVG Radar / Spider Chart for flavor profiles
 * No external heavy chart library needed - fast and sharp!
 */
export default function FlavorRadarChart({ profile = {}, size = 180, isMini = false }) {
  const axes = [
    { key: 'savory', label: 'Savory' },
    { key: 'umami', label: 'Umami' },
    { key: 'fresh', label: 'Fresh' },
    { key: 'sweet', label: 'Sweet' },
    { key: 'spicy', label: 'Spicy' },
  ];

  const totalAxes = axes.length;
  const radius = size / 2 - (isMini ? 15 : 28);
  const center = size / 2;

  // Calculate coordinates for an angle and normalized value (0 - 100)
  const getCoordinates = (index, value = 50) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build grid web rings
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map(level => {
    return axes
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level * 100);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // Data polygon coordinates
  const dataPoints = axes.map((axis, i) => {
    const val = profile[axis.key] ?? 50;
    return getCoordinates(i, val);
  });
  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Web Rings */}
        {gridPolygons.map((poly, idx) => (
          <polygon
            key={idx}
            points={poly}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Data Area Fill */}
        <polygon
          points={dataPolygonString}
          fill="rgba(245, 158, 11, 0.25)"
          stroke="#F59E0B"
          strokeWidth="2"
          className="transition-all duration-500 ease-out"
        />

        {/* Data Points */}
        {dataPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={isMini ? 2 : 3.5}
            fill="#F59E0B"
            stroke="#0B0F17"
            strokeWidth="1.5"
          />
        ))}

        {/* Axis Labels */}
        {!isMini && axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, 122);
          return (
            <text
              key={axis.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94A3B8"
              fontSize="10"
              fontWeight="600"
              className="tracking-wider uppercase"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
