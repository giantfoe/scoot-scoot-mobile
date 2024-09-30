import { Button, Input } from '@rneui/themed';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase'; // Ensure this path is correct

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signIn({ email, password });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Successfully signed in!');
      // Navigate to the next screen or perform any other action
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputField}
        />
        <Input
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          containerStyle={styles.inputField}
        />
      </View>
      <Button title="Sign In" disabled={loading} onPress={signIn} buttonStyle={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '75%', // Set the width to 3/4 of the page
  },
  inputField: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#42E100', // Green color for the button
    borderRadius: 10,
    width: '75%', // Match button width to input fields
  },
});
