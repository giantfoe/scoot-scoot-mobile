import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { supabase } from '~/lib/supabase';
import { useAuth } from '~/providers/AuthProvider';
import { useScooter } from '~/providers/ScooterProvider';

interface StatBoxProps {
  label: string;
  value: string | number;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { balance } = useScooter();
  const [email, setEmail] = useState('');
  const [totalRides, setTotalRides] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '');
      fetchRideStats();
    }
  }, [session]);

  const fetchRideStats = async () => {
    try {
      const { data, error } = await supabase
        .from('ride_history')
        .select('id, distance')
        .eq('user_id', session?.user.id);

      if (error) throw error;
      if (data) {
        setTotalRides(data.length);
        setTotalDistance(data.reduce((sum, ride) => sum + (ride.distance || 0), 0));
      }
    } catch (error) {
      console.error('Error fetching ride stats:', error);
      Alert.alert('Error', 'Failed to fetch ride statistics');
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

  return (
    <LinearGradient
      colors={['#8a2be2', '#ff69b4']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{email || 'E-Scooter User'}</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.tagsContainer}>
              {['Rider', 'Eco-friendly', 'Urban Mobility'].map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <FontAwesome6 name="tag" size={12} color="#fff" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Ride Stats</Text>

            <View style={styles.statsContainer}>
              <StatBox label="Total Rides" value={totalRides} />
              <StatBox label="Total Distance" value={`${totalDistance.toFixed(2)} km`} />
              <StatBox label="Balance" value={`$${balance.toFixed(2)}`} />
            </View>

            <View style={styles.earningsContainer}>
              <FontAwesome6 name="wallet" size={24} color="#fff" />
              <View>
                <Text style={styles.earningsLabel}>Your Wallet Balance</Text>
                <Text style={styles.earningsValue}>${balance.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: '30%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
  },
  earningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  earningsLabel: {
    color: '#fff',
    marginLeft: 10,
  },
  earningsValue: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
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
});

export default ProfileScreen;
