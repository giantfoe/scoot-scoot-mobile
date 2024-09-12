import { Stack } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-drawer-layout';
import { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useScooter } from '~/providers/ScooterProvider';

import Map from '~/components/Map';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import Sidebar from '~/components/Sidebar';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isRideActive } = useScooter();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
        <Stack.Screen 
          options={{ 
            headerShown: false,
          }} 
        />
        <View style={styles.container}>
          <Map />
          <SelectedScooterSheet />
          <TouchableOpacity 
            style={[
              styles.menuButton, 
              isRideActive && { opacity: 0.5 }
            ]} 
            onPress={toggleDrawer}
            disabled={isRideActive}
          >
            <FontAwesome6 name={isDrawerOpen ? "times" : "bars"} size={24} color="#FFFBEA" />
          </TouchableOpacity>
        </View>
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer: {
    backgroundColor: '#FFFBEA',
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'black',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
});
