import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { Text, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from './Button';

import scooterImage from '~/assets/scooter.png';
import { useScooter } from '~/providers/ScooterProvider';

export default function SelectedScooterSheet() {
  const { selectedScooter, duration, distance, isNearby, startJourney, isRideActive } = useScooter();

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    console.log('SelectedScooterSheet - isRideActive:', isRideActive);
    console.log('SelectedScooterSheet - selectedScooter:', selectedScooter);
    if (selectedScooter && !isRideActive) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [selectedScooter, isRideActive]);

  const handleStartJourney = () => {
    console.log('Start journey button pressed');
    startJourney();
  };

  if (isRideActive) {
    console.log('SelectedScooterSheet not rendering due to active ride');
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#FFFBEA' }}>
      {selectedScooter && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          {/* TOP part */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={scooterImage} style={{ width: 60, height: 60 }} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: '#481700', fontSize: 18, fontWeight: '600' }}>SCOOT-SCOOT</Text>
              <Text style={{ color: 'gray', fontSize: 18 }}>
                id-{selectedScooter.id} · SM☀️VE
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 name="flag-checkered" size={18} color="#481700" />
                <Text style={{ color: '#481700', fontWeight: 'bold', fontSize: 18 }}>
                  {(distance / 1000).toFixed(1)} km
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 
                  name={getBatteryIcon(selectedScooter.batterypercentage)} 
                  size={18} 
                  color={getBatteryColor(selectedScooter.batterypercentage)}
                />
                <Text style={{ 
                  color: getBatteryColor(selectedScooter.batterypercentage), 
                  fontWeight: 'bold', 
                  fontSize: 18 
                }}>
                  {selectedScooter.batterypercentage}%
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom part */}
          <View>
            <Button 
              title="UNLOCK SCOOTER" 
              disabled={!isNearby} 
              onPress={handleStartJourney}
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
const getBatteryIcon = (percentage: number) => {
  if (percentage > 75) return 'battery-full';
  if (percentage > 50) return 'battery-three-quarters';
  if (percentage > 25) return 'battery-half';
  if (percentage > 10) return 'battery-quarter';
  return 'battery-empty';
};

const getBatteryColor = (percentage: number) => {
  if (percentage > 50) return '#42E100';  // Green
  if (percentage > 25) return '#FFA500';  // Orange
  return '#FF0000';  // Red
};