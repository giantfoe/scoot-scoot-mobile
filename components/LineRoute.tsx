import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

export default function LineRoute({ coordinates }: { coordinates: Position[] }) {
  return (
    <ShapeSource
      id="routeSource"
      lineMetrics
      shape={{
        properties: {},
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}>
      <LineLayer
        id="routeLine"
        style={{
          lineColor: '#ff9900',
          lineWidth: 5,
          lineCap: 'round',
          lineJoin: 'round',
          lineOpacity: 0.5,
        }}
      />
    </ShapeSource>
  );
}
