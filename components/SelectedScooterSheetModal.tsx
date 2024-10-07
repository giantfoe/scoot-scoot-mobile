import React, { useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useScooter } from '~/providers/ScooterProvider';
import { useRouter } from 'expo-router';

export default function SelectedScooterSheetModal({ scooter }) {
  const { isRideActive, startJourney, RideActive } = useScooter();
  const router = useRouter();

  // Ensure scooter is valid before rendering
  if (!scooter) {
    return null; // Do not render if scooter is null
  }

  const handleClosePress = useCallback(() => {
    RideActive(false);
  }, [RideActive]);

  const handleStartRide = (scooter) => {
    startJourney(scooter);
    RideActive(true);
    handleClosePress();
  };

  const handleEnterCode = () => {
    handleStartRide(scooter);
    router.push('/ScooterScan');
  };

  const handleScanQR = () => {
    handleStartRide(scooter);
    router.push('/ScooterScan');
  };

  // Do not render if the ride is active
  if (isRideActive) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF8E1', '#FFECB3']} style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
          <Ionicons name="close" size={24} color="#8D6E63" />
        </TouchableOpacity>

        <Text style={styles.title}>You can start your ride{'\n'}through these methods 💰</Text>
        <Text style={styles.subtitle}>You will be billed SLE 1 / min</Text>

        <TouchableOpacity style={styles.button} onPress={handleEnterCode}>
          <Ionicons name="keypad-outline" size={24} color="#8D6E63" />
          <Text style={styles.buttonText}>Enter Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleScanQR}>
          <Ionicons name="qr-code-outline" size={24} color="#8D6E63" />
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>

        <View style={styles.scooterInfo}>
          <Text style={styles.scooterTitle}>Scooter - #{scooter.id}</Text>
          <View style={styles.scooterDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="battery-full" size={18} color="#4CAF50" />
              <Text style={styles.detailText}>100%</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="flash" size={18} color="#FFC107" />
              <Text style={styles.detailText}>18km Range</Text>
            </View>
          </View>
        </View>

        <Image
          source={{ uri: 'https://example.com/scooter-image.png' }} // Replace with actual scooter image URL
          style={styles.scooterImage}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderColor: '#8D6E63',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 20,
    color: '#8D6E63',
  },
  scooterInfo: {
    marginTop: 20,
  },
  scooterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  scooterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#8D6E63',
  },
  scooterImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginTop: 20,
  },
});