import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';

import pin from '~/assets/pin.png';
// import scooters from '~/data/scooters.json';
import { useScooter } from '~/providers/ScooterProvider';

const SCOOTER_COLOR = '#481700'; // Updated color as requested

export default function ScooterMarkers() {
  const { setSelectedScooter, nearbyScooters, isRideActive, selectedScooter } = useScooter();

  console.log('ScooterMarkers - nearbyScooters:', nearbyScooters);

  if (!Array.isArray(nearbyScooters) || nearbyScooters.length === 0) {
    console.log('No scooters to display');
    return null;
  }

  let scootersToDisplay = isRideActive ? [selectedScooter] : nearbyScooters;

  const points = scootersToDisplay
    .filter(scooter => scooter && typeof scooter.long === 'number' && typeof scooter.lat === 'number')
    .map((scooter) => point([scooter.long, scooter.lat], { 
      scooter: {
        ...scooter,
        batterypercentage: scooter.batterypercentage
      } 
    }));

  if (points.length === 0) {
    console.log('No valid scooter points to display');
    return null;
  }

  const onPointPress = async (event: OnPressEvent) => {
    console.log('ScooterMarkers - onPointPress event:', event.features[0].properties);
    if (!isRideActive && event.features[0].properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };

  return (
    <ShapeSource id="scooters" cluster={!isRideActive} shape={featureCollection(points)} onPress={onPointPress}>
      {!isRideActive && (
        <>
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
              circleColor: SCOOTER_COLOR,
              circleRadius: [
                'step',
                ['get', 'point_count'],
                20,    // Default radius
                5,     // If point_count >= 5, radius is 25
                25,
                10,    // If point_count >= 10, radius is 30
                30,
                20,    // If point_count >= 20, radius is 35
                35
              ],
              circleOpacity: 0.84,
              circleStrokeWidth: 2,
              circleStrokeColor: 'white',
            }}
          />
        </>
      )}

      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 1.5, // Changed from 0.5 to 1.5 (3x the original size)
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
}
