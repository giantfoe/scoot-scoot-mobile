import * as Location from 'expo-location';

type SimulatedLocation = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

class LocationSimulator {
  private locations: SimulatedLocation[];
  private currentIndex: number;
  private intervalId: NodeJS.Timeout | null;
  private updateCallback: ((location: Location.LocationObject) => void) | null;
  private isSimulating: boolean;

  constructor() {
    this.locations = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.updateCallback = null;
    this.isSimulating = false;
  }

  async start(updateCallback: (location: Location.LocationObject) => void) {
    this.updateCallback = updateCallback;
    
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      return;
    }

    const initialLocation = await Location.getCurrentPositionAsync({});
    this.updateCallback(initialLocation);

    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (location) => {
        if (!this.isSimulating) {
          this.updateCallback?.(location);
        }
      }
    );
  }

  startSimulation(initialLocation: Location.LocationObject) {
    this.isSimulating = true;
    this.locations = this.generateRandomPath(initialLocation.coords, 20); // Generate 20 points
    this.currentIndex = 0;
    this.intervalId = setInterval(() => {
      this.emitNextLocation();
    }, 5000); // Update every 5 seconds
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private emitNextLocation() {
    if (this.currentIndex < this.locations.length) {
      const location = this.locations[this.currentIndex];
      this.updateCallback?.({
        coords: {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
      this.currentIndex++;
    } else {
      this.stopSimulation();
    }
  }

  private generateRandomPath(start: { latitude: number; longitude: number }, numPoints: number): SimulatedLocation[] {
    const path: SimulatedLocation[] = [{ latitude: start.latitude, longitude: start.longitude, timestamp: 0 }];
    const maxDistance = 5000; // 5km in meters

    for (let i = 1; i < numPoints; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * maxDistance;
      const dx = distance * Math.cos(angle) / 111320; // 111320 meters per degree of latitude
      const dy = distance * Math.sin(angle) / (111320 * Math.cos(start.latitude * Math.PI / 180));

      path.push({
        latitude: start.latitude + dy,
        longitude: start.longitude + dx,
        timestamp: i * 5000, // 5 seconds between each point
      });
    }

    return path;
  }
}

export const locationSimulator = new LocationSimulator();
