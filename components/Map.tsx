import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ScooterMarkers from './ScooterMarkers';
import SelectedScooterSheet from './SelectedScooterSheetModal'; // Ensure this import is correct
import { useScooter } from '~/providers/ScooterProvider';

export default function Map() {
  const { selectedScooter, setSelectedScooter } = useScooter(); // Access selectedScooter
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

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

  const handleSelectScooter = (scooter) => {
    setSelectedScooter(scooter); // Set the selected scooter
  };

  return (
    <View style={{ flex: 1 }}> 
      <MapView
        style={{ flex: 1 }} // MapView should also take full height
        region={mapRegion}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <Text>Your Location</Text>
          </Marker>
        )}
        {selectedScooter && selectedScooter.coordinates && (
          <Marker
            coordinate={{
              latitude: selectedScooter.coordinates.latitude,
              longitude: selectedScooter.coordinates.longitude,
            }}
            title={`Scooter - ${selectedScooter.id}`}
          />
        )}
        <ScooterMarkers onSelectScooter={handleSelectScooter} />
      </MapView>
      <SelectedScooterSheet scooter={selectedScooter} /> 
    </View>
  );
}

