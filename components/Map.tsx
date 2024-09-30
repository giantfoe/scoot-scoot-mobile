import React, { useEffect, useState } from 'react';
import Mapbox, { Camera, LocationPuck, MapView, Polyline } from '@rnmapbox/maps';
import { View } from 'react-native';

import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';
import RideActive from './RideActive';
import WalletBalance from './WalletBalance';

import { useScooter } from '~/providers/ScooterProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function Map() {
  const { selectedScooter, userLocation, isRideActive, routeCoordinates } = useScooter();
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (userLocation && selectedScooter) {
      fetchRoute(userLocation, selectedScooter);
    }
  }, [userLocation, selectedScooter]);

  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`);
      const data = await response.json();
      if (data.routes.length > 0) {
        setRoute(data.routes[0].geometry.coordinates);
      } else {
        console.error('No routes found');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

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
        {route.length > 0 && (
          <Polyline
            coordinates={route.map(coord => [coord[0], coord[1]])} // Ensure coordinates are in the correct format
            lineColor="#42E100"
            lineWidth={4}
          />
        )}
        <ScooterMarkers />
        {routeCoordinates && <LineRoute coordinates={routeCoordinates} />}
      </MapView>
      {isRideActive ? <RideActive /> : <WalletBalance />}
    </View>
  );
}
