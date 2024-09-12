import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { supabase } from '~/lib/supabase';
import { BlurView } from 'expo-blur';

export default function Sidebar() {
  const [balance, setBalance] = useState(0); // This should be fetched from your backend
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      router.replace('/auth');
    }
  };

  const SidebarContent = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        {/* <Text style={styles.title}>Menu</Text> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        <View style={styles.balanceContainer}>
          <FontAwesome6 name="wallet" size={24} color="#FFFBEA" />
          <Text style={styles.balance}>${balance.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="user" size={20} color="#FFFBEA" />
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="bell" size={20} color="#FFFBEA" />
          <Text style={styles.menuItemText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="shield" size={20} color="#FFFBEA" />
          <Text style={styles.menuItemText}>Privacy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="question-circle" size={20} color="#FFFBEA" />
          <Text style={styles.menuItemText}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="envelope" size={20} color="#FFFBEA" />
          <Text style={styles.menuItemText}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
        <FontAwesome6 name="right-from-bracket" size={20} color="#FFFBEA" />
        <Text style={styles.menuItemText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
          <SidebarContent />
        </BlurView>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.androidBackground]}>
          <SidebarContent />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  androidBackground: {
    backgroundColor: 'rgba(72, 23, 0, 0.8)', // Adjust the alpha value for desired transparency
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 251, 234, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFBEA',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 251, 234, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFBEA',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFFBEA',
  },
  button: {
    backgroundColor: '#42E100',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#481700',
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
    color: '#FFFBEA',
    marginLeft: 10,
  },
});
