import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';

import pin from '~/assets/pin.png';
// import scooters from '~/data/scooters.json';
import { useScooter } from '~/providers/ScooterProvider';

export default function ScooterMarkers() {
  const { setSelectedScooter, nearbyScooters } = useScooter();

  console.log('ScooterMarkers - nearbyScooters:', nearbyScooters);

  if (!Array.isArray(nearbyScooters) || nearbyScooters.length === 0) {
    console.log('No scooters to display');
    return null;
  }

  const points = nearbyScooters
    .filter(scooter => scooter && typeof scooter.long === 'number' && typeof scooter.lat === 'number')
    .map((scooter) => point([scooter.long, scooter.lat], { scooter }));

  if (points.length === 0) {
    console.log('No valid scooter points to display');
    return null;
  }

  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };

  return (
    <ShapeSource id="scooters" cluster shape={featureCollection(points)} onPress={onPointPress}>
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
}
