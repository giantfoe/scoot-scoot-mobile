import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { useScooter } from '~/providers/ScooterProvider';
import scooterImage from '~/assets/scooter.png';

export default function RideActive() {
  const { selectedScooter, distance, endJourney } = useScooter();
  const [elapsedTime, setElapsedTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topPart}>
          <Image source={scooterImage} style={styles.scooterImage} />
          <View style={styles.scooterInfo}>
            <Text style={styles.scooterTitle}>Scoot-Scoot</Text>
            <Text style={styles.scooterId}>
              id-{selectedScooter?.id} · Ride in Progress
            </Text>
          </View>
          <View style={styles.rideInfo}>
            <View style={styles.infoItem}>
              <FontAwesome6 name="flag-checkered" size={18} color="#42E100" />
              <Text style={styles.infoText}>
                {((distance || 0) / 1000).toFixed(1)} km
              </Text>
            </View>
            <View style={styles.infoItem}>
              <FontAwesome6 name="clock" size={18} color="#42E100" />
              <Text style={styles.infoText}>
                {formatTime(elapsedTime)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.endButton} onPress={endJourney}>
          <Text style={styles.endButtonText}>End journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#FFFBEA',
    borderRadius: 15,
    padding: 20,
  },
  content: {
    gap: 20,
  },
  topPart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scooterImage: {
    width: 60,
    height: 60,
  },
  scooterInfo: {
    flex: 1,
    gap: 5,
  },
  scooterTitle: {
    color: '#481700',
    fontSize: 20,
    fontWeight: '600',
  },
  scooterId: {
    color: 'gray',
    fontSize: 18,
  },
  rideInfo: {
    gap: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  infoText: {
    color: '#481700',
    fontWeight: 'bold',
    fontSize: 18,
  },
  endButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  endButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
