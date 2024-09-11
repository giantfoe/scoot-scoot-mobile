import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '~/lib/supabase';
import { getDirections } from '~/services/directions';


// Define the shape of your context
interface ScooterContextType {
  nearbyScooters: any[];
  selectedScooter: any | null;
  setSelectedScooter: (scooter: any) => void;
  userLocation: { latitude: number; longitude: number } | null;
  isRideActive: boolean;
  isNearby: boolean;
  setIsNearby: (isNearby: boolean) => void;
  startJourney: (scooter: any) => void;
  endJourney: () => void;
  rideDistance: number;
  direction: any;
  setDirection: (direction: any) => void;
  distance: number;
  // Add other properties as needed
}

const ScooterContext = createContext<ScooterContextType | undefined>(undefined);

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [nearbyScooters, setNearbyScooters] = useState<any[]>([]);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isRideActive, setIsRideActive] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [rideDistance, setRideDistance] = useState(0);
  const [direction, setDirection] = useState<any>(null);

  const startJourney = (scooter: any) => {
    setSelectedScooter(scooter);
    setIsRideActive(true);
    setRideDistance(0);
    setIsNearby(false);
    // Add any other logic needed when starting a journey
  };

  const endJourney = () => {
    setIsRideActive(false);
    setSelectedScooter(null);
    setIsNearby(false);
    // Add any other logic needed when ending a journey
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
    
    // // Start the location simulator
    // locationSimulator.start((location) => {
    //   setUserLocation({
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //   });
    //   // You might want to update other state or perform actions here
    // });

    // return () => {
    //   locationSimulator.stop();
    // };
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
      if (selectedScooter && userLocation) {
        try {
          const newDirection = await getDirections(
            [userLocation.longitude, userLocation.latitude],
            [selectedScooter.long, selectedScooter.lat]
          );
          setDirection(newDirection);
        } catch (error) {
          console.error('Error fetching directions:', error);
          Alert.alert('Error', 'Failed to fetch directions');
        }
      }
    };

    fetchDirections();
  }, [selectedScooter, userLocation]);

  const contextValue: ScooterContextType = {
    nearbyScooters,
    selectedScooter,
    setSelectedScooter,
    userLocation,
    isRideActive,
    isNearby,
    setIsNearby,
    startJourney,
    endJourney,
    rideDistance,
    direction,
    setDirection,
    distance: 0,
    // Add other properties as needed
  };

  return (
    <ScooterContext.Provider value={contextValue}>
      {children}
    </ScooterContext.Provider>
  );
}

export const useScooter = () => {
  const context = useContext(ScooterContext);
  if (context === undefined) {
    throw new Error('useScooter must be used within a ScooterProvider');
  }
  return context;
};
