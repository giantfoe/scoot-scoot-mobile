import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';
import RideActive from './RideActive';
import WalletBalance from './WalletBalance';
import { useScooter } from '~/providers/ScooterProvider';

export default function Map() {
  const { selectedScooter, isRideActive, routeCoordinates } = useScooter();
  const [route, setRoute] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    if (userLocation && selectedScooter) {
      fetchRoute(userLocation, selectedScooter);
    }
  }, [userLocation, selectedScooter]);

  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      if (data.routes.length > 0) {
        const coordinates = data.routes[0].legs[0].steps.map(step => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }));
        setRoute(coordinates);
      } else {
        console.error('No routes found');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const centerMapOnUserLocation = () => {
    if (userLocation) {
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={mapRegion} // Use the state for the map region
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location" />
        )}
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#42E100"
            strokeWidth={4}
          />
        )}
        <ScooterMarkers />
        {routeCoordinates && <LineRoute coordinates={routeCoordinates} />}
      </MapView>
      {isRideActive ? <RideActive /> : <WalletBalance />}
      <TouchableOpacity style={styles.locateButton} onPress={centerMapOnUserLocation}>
        <Text style={styles.buttonText}>Locate Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  locateButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#42E100',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
