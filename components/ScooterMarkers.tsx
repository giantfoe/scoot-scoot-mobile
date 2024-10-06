import React from 'react';
import { Marker } from 'react-native-maps';
import { useScooter } from '~/providers/ScooterProvider';

const pinImage = require('../assets/pin.png'); // Ensure this path is correct

export default function ScooterMarkers() {
  const { nearbyScooters } = useScooter();

  return (
    <>
      {nearbyScooters.map(scooter => (
        <Marker
          key={scooter.id}
          coordinate={{ latitude: scooter.lat, longitude: scooter.long }}
          title={`Scooter ${scooter.id}`}
          image={pinImage} // Use the custom image for the marker
        />
      ))}
    </>
  );
}
