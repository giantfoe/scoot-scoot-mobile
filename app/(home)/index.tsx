import { Stack } from 'expo-router';
import { Button, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-drawer-layout';
import { useState } from 'react';

import Map from '~/components/Map';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import Sidebar from '~/components/Sidebar';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        renderDrawerContent={() => <Sidebar />}
        drawerPosition="left"
        drawerType="front"
        drawerStyle={styles.drawer}
      >
        <Stack.Screen 
          options={{ 
            title: 'Home', 
            headerShown: true,
            headerLeft: () => (
              <Button 
                onPress={() => setIsDrawerOpen(true)} 
                title="Menu" 
              />
            ),
          }} 
        />
        <View style={styles.container}>
          <Map />
          <SelectedScooterSheet />
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
});
