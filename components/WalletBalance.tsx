import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useScooter } from '~/providers/ScooterProvider';

export default function WalletBalance() {
  const { balance, openWallet } = useScooter();

  return (
    <TouchableOpacity style={styles.container} onPress={openWallet}>
      <FontAwesome6 name="wallet" size={20} color="#FFFBEA" />
      <Text style={styles.balanceText}>
        ${balance !== undefined ? balance.toFixed(2) : '-.--'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // opacity: 0.8,
 
  },
  balanceText: {
    color: '#FFFBEA',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
