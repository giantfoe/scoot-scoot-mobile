import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { View } from 'react-native';

import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';
import RideActive from './RideActive';

import { useScooter } from '~/providers/ScooterProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function Map() {
  const { selectedScooter, userLocation, isRideActive } = useScooter();

  const routeCoordinates = userLocation && selectedScooter
    ? [
        [userLocation.longitude, userLocation.latitude],
        [selectedScooter.longitude, selectedScooter.latitude]
      ]
    : null;

  console.log('userLocation:', userLocation);
  console.log('selectedScooter:', selectedScooter);
  console.log('routeCoordinates:', routeCoordinates);

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
        <Camera 
          followZoomLevel={isRideActive ? 25 : 14}
          followUserLocation
          followUserMode="normal"
          centerCoordinate={userLocation ? [userLocation.longitude, userLocation.latitude] : undefined}
        />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
        <ScooterMarkers />
        {routeCoordinates && <LineRoute coordinates={routeCoordinates} />}
      </MapView>
      {isRideActive && <RideActive />}
    </View>
  );
}
