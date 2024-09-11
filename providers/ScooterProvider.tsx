import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '~/lib/supabase';
import { getDirections } from '~/services/directions';
import { locationSimulator } from '~/services/locationSimulator';

const ScooterContext = createContext({});

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [nearbyScooters, setNearbyScooters] = useState([]);
  const [selectedScooter, setSelectedScooter] = useState();
  const [direction, setDirection] = useState();
  const [isNearby, setIsNearby] = useState(false);
  const [isRideActive, setIsRideActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const startJourney = async () => {
    console.log('Starting journey...');
    try {
      if (selectedScooter) {
        const updatedScooter = {
          ...selectedScooter,
          lat: userLocation.latitude,
          long: userLocation.longitude,
        };
        setSelectedScooter(updatedScooter);

        setNearbyScooters(prevScooters =>
          prevScooters.map(scooter =>
            scooter.id === selectedScooter.id ? updatedScooter : scooter
          )
        );
      }

      setIsRideActive(true);
      console.log('isRideActive set to true');
    } catch (error) {
      console.error('Error starting journey:', error);
      Alert.alert('Failed to start journey', 'An unexpected error occurred: ' + JSON.stringify(error));
    }
  };

  const endJourney = () => {
    console.log('Ending journey...');
    setIsRideActive(false);
    console.log('isRideActive set to false');
  };

  useEffect(() => {
    const fetchScooters = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Location permission not granted');
          Alert.alert('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync();
        console.log('Current location:', location);

        const { data, error } = await supabase.rpc('nearby_scooters', {
          params: {
            user_lat: location.coords.latitude,
            user_lng: location.coords.longitude,
            max_dist_meters: 2000,
          }
        });

        if (error) {
          console.error('Supabase error:', error);
          Alert.alert('Failed to fetch scooters', JSON.stringify(error));
        } else if (data && Array.isArray(data) && data.length > 0) {
          console.log('Fetched scooters:', data);
          setNearbyScooters(data);
        } else {
          console.warn('No scooters found or invalid data:', data);
          setNearbyScooters([]);
          Alert.alert('No scooters found', 'There are no scooters available within 2000 meters.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        Alert.alert('Failed to fetch scooters', 'An unexpected error occurred: ' + JSON.stringify(error));
      }
    };

    fetchScooters();
    
    // Start the location simulator
    locationSimulator.start((location) => {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      // You might want to update other state or perform actions here
    });

    return () => {
      locationSimulator.stop();
    };
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
        const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
        const to = point([selectedScooter.long, selectedScooter.lat]);
        const distance = getDistance(from, to, { units: 'meters' });
        if (distance < 100) {
          setIsNearby(true);
        }
      });
    };

    if (selectedScooter) {
      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [selectedScooter]);

  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync();

      const newDirection = await getDirections(
        [myLocation.coords.longitude, myLocation.coords.latitude],
        [selectedScooter.long, selectedScooter.lat]
      );
      setDirection(newDirection);
    };

    if (selectedScooter) {
      fetchDirections();
      setIsNearby(false);
    }
  }, [selectedScooter]);

  return (
    <ScooterContext.Provider
      value={{
        nearbyScooters,
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
        duration: direction?.routes?.[0]?.duration,
        distance: direction?.routes?.[0]?.distance,
        isNearby,
        isRideActive,
        startJourney,
        endJourney,
        userLocation,
      }}>
      {children}
    </ScooterContext.Provider>
  );
}

export const useScooter = () => useContext(ScooterContext);
