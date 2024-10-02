import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useScooter } from '~/providers/ScooterProvider';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { supabase } from '~/lib/supabase';

const CombinedScreen = () => {
  const router = useRouter();
  const { balance, openWallet } = useScooter();
  const [email, setEmail] = useState('');
  const [rideStats, setRideStats] = useState({
    totalRides: 0,
    totalDistance: 0,
    totalDuration: 0,
    carbonCredits: 0,
  });

  useEffect(() => {
    // Fetch user email and ride stats here
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setEmail(data.user.email);
      }
      // Fetch ride stats logic here
    };
    fetchUserData();
  }, []);

  return (
    <LinearGradient
      colors={['#2ecc71', '#27ae60', '#3498db']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Wallet</Text>
          <TouchableOpacity style={styles.walletButton} onPress={openWallet}>
            <FontAwesome6 name="wallet" size={20} color="#FFFBEA" />
            <Text style={styles.balanceText}>
              ${balance !== undefined ? balance.toFixed(2) : '-.--'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder for profile image
              style={styles.profileImage}
            />
            <Text style={styles.name}>{email || 'E-Scooter User'}</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Ride Stats</Text>
            <Text>Total Rides: {rideStats.totalRides}</Text>
            <Text>Total Distance: {rideStats.totalDistance} km</Text>
            <Text>Total Duration: {rideStats.totalDuration} min</Text>
            <Text>Carbon Credits: {rideStats.carbonCredits}</Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/CombinedScreen')}>
              <Text style={styles.actionButtonText}>Let Skoot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/TransactionHistory')}>
              <Text style={styles.actionButtonText}>Transaction History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/Profile')}>
              <Text style={styles.actionButtonText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerText: {
    fontSize: 24,
    color: '#FFFBEA',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 10,
  },
  balanceText: {
    color: '#FFFBEA',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  scrollContent: {
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFBEA',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFBEA',
    marginBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#42E100',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#FFFBEA',
    fontWeight: 'bold',
  },
});

export default CombinedScreen;
