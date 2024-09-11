import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { View } from 'react-native';

import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';
import RideActive from './RideActive';

import { useScooter } from '~/providers/ScooterProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function Map() {
  const { direction, userLocation, isRideActive } = useScooter();

  console.log('Map - isRideActive:', isRideActive);
  console.log('Map - direction:', direction);

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

        {direction && direction.routes && direction.routes[0] && (
          <LineRoute coordinates={direction.routes[0].geometry.coordinates} />
        )}
      </MapView>
      {isRideActive && <RideActive />}
    </View>
  );
}
