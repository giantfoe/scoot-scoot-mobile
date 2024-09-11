import { LineLayer, ShapeSource } from '@rnmapbox/maps';

interface LineRouteProps {
  coordinates: number[][];
}

export default function LineRoute({ coordinates }: LineRouteProps) {
  return (
    <ShapeSource id="routeSource" shape={{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    }}>
      <LineLayer
        id="routeFill"
        style={{
          lineColor: '#42E100',
          lineWidth: 3,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />
    </ShapeSource>
  );
}
