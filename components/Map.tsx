import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { View } from 'react-native';

import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';
import RideActive from './RideActive';

import { useScooter } from '~/providers/ScooterProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function Map() {
  const { directionCoordinates, userLocation, isRideActive } = useScooter();

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
        <Camera 
          followZoomLevel={14} 
          followUserLocation 
          centerCoordinate={userLocation ? [userLocation.longitude, userLocation.latitude] : undefined}
        />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        <ScooterMarkers />

        {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
      </MapView>
      {isRideActive && <RideActive />}
    </View>
  );
}
