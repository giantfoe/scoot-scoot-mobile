import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-drawer-layout';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useScooter } from '~/providers/ScooterProvider';
import { useRouter } from 'expo-router';

import Map from '~/components/Map';
import SelectedScooterSheetModal from '~/components/SelectedScooterSheetModal'; // Import the modal
import Sidebar from '~/components/Sidebar';
import RideActive from '~/components/RideActive';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const { isRideActive, selectedScooter } = useScooter();
  const router = useRouter();

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        renderDrawerContent={() => <Sidebar />}
        drawerPosition="left"
        drawerType="front"
        drawerStyle={{ backgroundColor: 'transparent' }}
      >
        <View style={styles.container}>
          <Map />
          {isRideActive && <RideActive />}
          {selectedScooter && !isRideActive && ( // Only show the button if ride is not active
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text>Show Selected Scooter Sheet</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.menuButton, isRideActive && styles.disabledButton]} 
            onPress={() => router.push('/CombinedScreen')}
            disabled={isRideActive}
          >
            <FontAwesome6 
              name={isDrawerOpen ? "times" : "bars"} 
              size={24} 
              color="#FFFBEA" 
            />
          </TouchableOpacity>
          {/* Conditionally render the modal based on modalVisible state */}
          {modalVisible && !isRideActive && ( // Ensure modal is not shown when ride is active
            <SelectedScooterSheetModal visible={modalVisible} onClose={handleModalClose} />
          )}
        </View>
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000, // Ensure the button is above other components
  },
  disabledButton: {
    opacity: 0.5,
  },
});