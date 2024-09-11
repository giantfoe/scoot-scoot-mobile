import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useScooter } from '~/providers/ScooterProvider';

export default function ScooterScan() {
  const { id } = useLocalSearchParams();
  const [scooterId, setScooterId] = useState(id ? id.toString() : '');
  const router = useRouter();
  const { startJourney, nearbyScooters } = useScooter();

  useEffect(() => {
    if (id) {
      setScooterId(id.toString());
    }
  }, [id]);

  const handleStartRide = () => {
    const scooter = nearbyScooters.find(s => s.id.toString() === scooterId);
    if (scooter) {
      startJourney(scooter);
      router.push('/');
    } else {
      Alert.alert('Invalid Scooter', 'Please enter a valid scooter ID');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Scooter ID</Text>
      <TextInput
        style={styles.input}
        value={scooterId}
        onChangeText={setScooterId}
        placeholder="Enter Scooter ID"
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={[styles.button, styles.startButton]} 
        onPress={handleStartRide}
        disabled={!scooterId}
      >
        <Text style={styles.buttonText}>Start Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFBEA', // Matching the color scheme from SelectedScooterSheet
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#481700', // Matching the color scheme from SelectedScooterSheet
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#481700',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#481700',
  },
  button: {
    backgroundColor: '#42E100', // Green color for start button
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
