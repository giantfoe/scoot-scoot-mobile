import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Alert, NativeModules } from 'react-native';
import { BlurView } from 'expo-blur';

import { supabase } from '~/lib/supabase';
import { getDirections } from '~/services/directions';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';

// Add this near the top of your file, after your imports
const directionsClient = MapboxDirectionsFactory({ accessToken: process.env.EXPO_PUBLIC_MAPBOX_KEY || '' });

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
  balance: number;
  openWallet: () => void;
  // Add other properties as needed
}

const ScooterContext = createContext<ScooterContextType | undefined>(undefined);

const { ScooterRideActivity } = NativeModules;

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [nearbyScooters, setNearbyScooters] = useState<any[]>([]);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isRideActive, setIsRideActive] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [rideDistance, setRideDistance] = useState(0);
  const [direction, setDirection] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | null>(null);
  const [balance, setBalance] = useState(0);
  const [activityId, setActivityId] = useState<string | null>(null);

  const startJourney = async (scooter: any) => {
    setSelectedScooter(scooter);
    setIsRideActive(true);
    setRideDistance(0);
    setIsNearby(false);
    // Add any other logic needed when starting a journey
    if (Platform.OS === 'ios') {
      try {
        const id = await ScooterRideActivity.startRideActivity(scooter.id);
        setActivityId(id);
      } catch (error) {
        console.error('Failed to start ride activity:', error);
      }
    }
  };

  const endJourney = async () => {
    setIsRideActive(false);
    setSelectedScooter(null);
    setIsNearby(false);
    // Add any other logic needed when ending a journey
    if (Platform.OS === 'ios' && activityId) {
      try {
        await ScooterRideActivity.endRideActivity(activityId);
        setActivityId(null);
      } catch (error) {
        console.error('Failed to end ride activity:', error);
      }
    }
  };

  const openWallet = () => {
    // This is where you would typically open your wallet screen or modal
    Alert.alert('Wallet', 'Wallet functionality coming soon!');
    // You could navigate to a Wallet screen here, for example:
    // navigation.navigate('Wallet');
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

  const fetchDirections = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await directionsClient.getDirections({
        profile: 'walking',
        geometries: 'geojson',
        waypoints: [
          { coordinates: start },
          { coordinates: end }
        ],
      }).send();

      if (response && response.body && response.body.routes && response.body.routes[0]) {
        return response.body.routes[0].geometry.coordinates;
      } else {
        console.error('No route found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      return null;
    }
  };

  useEffect(() => {
    if (userLocation && selectedScooter) {
      const start: [number, number] = [userLocation.longitude, userLocation.latitude];
      const end: [number, number] = [selectedScooter.long, selectedScooter.lat];
      
      fetchDirections(start, end).then(coordinates => {
        if (coordinates) {
          setRouteCoordinates(coordinates);
        }
      });
    } else {
      setRouteCoordinates(null);
    }
  }, [userLocation, selectedScooter]);

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
    routeCoordinates,
    balance,
    openWallet,
    // Add other properties as needed
  };

  useEffect(() => {
    // This is where you would typically fetch the user's balance from your backend
    // For now, we'll just set a dummy value
    setBalance(50.00);
  }, []);

  // Set up a timer to update the ride duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRideActive && Platform.OS === 'ios' && activityId) {
      timer = setInterval(async () => {
        try {
          await ScooterRideActivity.updateRideActivity(activityId, rideDistance);
        } catch (error) {
          console.error('Failed to update ride activity:', error);
        }
      }, 1000); // Update every second
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRideActive, activityId, rideDistance]);

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
