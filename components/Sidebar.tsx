import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { supabase } from '~/lib/supabase';

export default function Sidebar() {
  const [balance, setBalance] = useState(0); // This should be fetched from your backend
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet</Text>
          <View style={styles.balanceContainer}>
            <FontAwesome6 name="wallet" size={24} color="#481700" />
            <Text style={styles.balance}>${balance.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Funds</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome6 name="user" size={20} color="#481700" />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome6 name="bell" size={20} color="#481700" />
            <Text style={styles.menuItemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome6 name="shield" size={20} color="#481700" />
            <Text style={styles.menuItemText}>Privacy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome6 name="circle-question" size={20} color="#481700" />
            <Text style={styles.menuItemText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome6 name="message" size={20} color="#481700" />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <FontAwesome6 name="right-from-bracket" size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEA',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#481700',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#481700',
    marginBottom: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#481700',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#42E100',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#481700',
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
