
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Activity, LatLng } from '../types';

interface SvgOverlayProps {
  points: LatLng[];
  color: string;
}

// This component will handle rendering the SVG overlay
const SvgOverlay: React.FC<SvgOverlayProps> = ({ points, color }) => {
  const map = useMap();
  const [bounds, setBounds] = React.useState(map.getBounds());
  const [zoom, setZoom] = React.useState(map.getZoom());

  const mapSize = map.getSize();

  const handleMove = () => {
    setBounds(map.getBounds());
    setZoom(map.getZoom());
  };

  React.useEffect(() => {
    map.on('move', handleMove);
    map.on('zoom', handleMove);
    return () => {
      map.off('move', handleMove);
      map.off('zoom', handleMove);
    };
  }, [map]);

  const radius = Math.max(1, Math.pow(2, zoom - 8));
  const opacity = Math.min(Math.max(0.1, 0.7 - zoom * 0.05), 0.6);

  return (
    <svg width={mapSize.x} height={mapSize.y} style={{ position: 'absolute', top: 0, left: 0, zIndex: 400, pointerEvents: 'none' }}>
      <g>
        {points.map((point, i) => {
          if (bounds.contains([point.lat, point.lng])) {
            const { x, y } = map.latLngToContainerPoint([point.lat, point.lng]);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                style={{
                    mixBlendMode: 'screen', // This creates the heatmap effect on overlap
                    opacity: opacity
                }}
              />
            );
          }
          return null;
        })}
      </g>
    </svg>
  );
};

interface HeatmapProps {
  data: Activity[];
  color: string;
  tileUrl: string;
  attribution: string;
  bgColor: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({ data, color, tileUrl, attribution, bgColor }) => {
  const points = useMemo(() => {
    return data
      .map((row) => ({
        lat: parseFloat(row.Latitude?.replace(',', '.')),
        lng: parseFloat(row.Longitude?.replace(',', '.')),
      }))
      .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));
  }, [data]);

  const center: [number, number] = points.length > 0 ? [points[0].lat, points[0].lng] : [-25.4284, -49.2733]; // Default to Curitiba

  return (
    <div className="p-4 h-[60vh] md:h-[70vh] rounded-xl shadow-lg relative bg-gray-800 border border-gray-700">
      <MapContainer key={tileUrl} center={center} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: bgColor, borderRadius: '0.75rem' }}>
        <TileLayer
          attribution={attribution}
          url={tileUrl}
        />
        {points.length > 0 && <SvgOverlay points={points} color={color} />}
      </MapContainer>
    </div>
  );
};
