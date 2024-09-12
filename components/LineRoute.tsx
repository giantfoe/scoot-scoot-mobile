import { LineLayer, ShapeSource } from '@rnmapbox/maps';

interface LineRouteProps {
  coordinates: [number, number][];
}

export default function LineRoute({ coordinates }: LineRouteProps) {
  console.log('LineRoute - coordinates:', coordinates);

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
          lineColor: 'red',
          lineWidth: 5,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />
    </ShapeSource>
  );
}
