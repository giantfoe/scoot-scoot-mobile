import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { supabase } from '~/lib/supabase';
import { useAuth } from '~/providers/AuthProvider';
import { useScooter } from '~/providers/ScooterProvider';

interface RideStats {
  totalRides: number;
  totalDistance: number;
  totalDuration: number;
  carbonCredits: number;
}

const StatBox: React.FC<{ label: string; value: string | number; icon: string }> = ({ label, value, icon }) => (
  <BlurView intensity={20} tint="light" style={styles.statBox}>
    <FontAwesome6 name={icon} size={24} color="#fff" style={styles.statIcon} />
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </BlurView>
);

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { balance } = useScooter();
  const [email, setEmail] = useState('');
  const [rideStats, setRideStats] = useState<RideStats>({
    totalRides: 0,
    totalDistance: 0,
    totalDuration: 0,
    carbonCredits: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carbon credit calculation constants
  const CO2_SAVED_PER_KM = 0.1; // 0.1 kg of CO2 saved per km
  const CARBON_CREDITS_PER_KG_CO2 = 10; // 1 carbon credit per 0.1 kg of CO2 saved

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '');
      fetchRideStats();
    }
  }, [session]);

  const fetchRideStats = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('route_distance, route_duration, started_at, finished_at')
        .eq('user_id', session?.user.id)
        .not('finished_at', 'is', null);

      if (error) throw error;

      if (data) {
        const stats = data.reduce((acc, ride) => {
          acc.totalRides += 1;
          acc.totalDistance += ride.route_distance || 0;
          acc.totalDuration += ride.route_duration || 0;
          return acc;
        }, { totalRides: 0, totalDistance: 0, totalDuration: 0 });

        // Calculate carbon credits
        const co2Saved = stats.totalDistance * CO2_SAVED_PER_KM;
        const carbonCredits = co2Saved * CARBON_CREDITS_PER_KG_CO2;

        setRideStats({
          ...stats,
          carbonCredits,
        });
      }
    } catch (error) {
      console.error('Error fetching ride stats:', error);
      Alert.alert('Error', 'Failed to fetch ride statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <LinearGradient
      colors={['#2ecc71', '#27ae60', '#3498db']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BlurView intensity={20} tint="light" style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{email || 'E-Scooter User'}</Text>
          </BlurView>

          <BlurView intensity={20} tint="light" style={styles.contentContainer}>
            <View style={styles.tagsContainer}>
              {['Rider', 'Eco-friendly', 'Urban Mobility'].map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <FontAwesome6 name="tag" size={12} color="#fff" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Ride Stats</Text>

            {isLoading ? (
              <Text style={styles.loadingText}>Loading stats...</Text>
            ) : (
              <View style={styles.statsContainer}>
                <StatBox label="Total Rides" value={rideStats.totalRides} icon="route" />
                <StatBox label="Total Distance" value={`${rideStats.totalDistance.toFixed(2)} km`} icon="road" />
                <StatBox label="Total Time" value={formatDuration(rideStats.totalDuration)} icon="clock" />
                <StatBox label="Carbon Credits" value={rideStats.carbonCredits.toFixed(2)} icon="leaf" />
              </View>
            )}

            <BlurView intensity={20} tint="light" style={styles.earningsContainer}>
              <FontAwesome6 name="leaf" size={24} color="#fff" />
              <View>
                <Text style={styles.earningsLabel}>Carbon Credits Earned</Text>
                <Text style={styles.earningsValue}>{rideStats.carbonCredits.toFixed(2)}</Text>
              </View>
            </BlurView>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </BlurView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
    borderRadius: 15,
    margin: 5,
  },
  tagText: {
    color: '#fff',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '48%',
    overflow: 'hidden',
  },
  statIcon: {
    marginRight: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  earningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  earningsLabel: {
    color: '#fff',
    marginLeft: 10,
  },
  earningsValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
