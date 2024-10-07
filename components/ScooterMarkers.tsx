import React from 'react';
import { Marker } from 'react-native-maps';
import { Image, TouchableOpacity } from 'react-native';
import { useScooter } from '~/providers/ScooterProvider';

const pinImage = require('../assets/pin.png'); // Ensure this path is correct

export default function ScooterMarkers({ onSelectScooter }) {
  const { nearbyScooters } = useScooter();

  return (
    <>
      {nearbyScooters.map(scooter => (
        <Marker
          key={scooter.id}
          coordinate={{ latitude: scooter.lat, longitude: scooter.long }}
          title={`Scooter ${scooter.id}`}
          anchor={{ x: 0.5, y: 1 }} // Adjust anchor to center the image
        >
          <TouchableOpacity onPress={() => onSelectScooter(scooter)}>
            <Image
              source={pinImage}
              style={{ width: 25, height: 37.5 }} // Adjust size as needed
            />
          </TouchableOpacity>
        </Marker>
      ))}
    </>
  );
}
