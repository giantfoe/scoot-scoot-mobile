
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const GameScreen = () => {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: 'http://localhost:8080/index.html' }} // Load from local server
        style={styles.webview}
        javaScriptEnabled={true} // Enable JavaScript
        domStorageEnabled={true} // Enable DOM storage
        startInLoadingState={true} // Show loading indicator
        scalesPageToFit={true} // Allow scaling
      />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backButtonText}>HOME</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(66, 225, 0, 0.8)', // Semi-transparent green with opacity 0.80
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // Ensure it is above the WebView
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFBEA', // Text color
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;
