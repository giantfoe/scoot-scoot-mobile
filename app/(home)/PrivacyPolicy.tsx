import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#2ecc71', '#27ae60', '#3498db']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BlurView intensity={20} tint="light" style={styles.header}>
            <Text style={styles.title}>Privacy Policy</Text>
          </BlurView>

          <BlurView intensity={20} tint="light" style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.text}>
              Your privacy is important to us. This privacy policy explains how we collect, use, and share your information.
            </Text>

            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.text}>
              We may collect the following types of information:
              {'\n'}• Personal Information: Name, email address, etc.
              {'\n'}• Usage Data: Information about how you use our app.
            </Text>

            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.text}>
              We use your information to:
              {'\n'}• Provide and maintain our service.
              {'\n'}• Improve our app and user experience.
              {'\n'}• Communicate with you.
            </Text>

            <Text style={styles.sectionTitle}>Sharing Your Information</Text>
            <Text style={styles.text}>
              We do not share your personal information with third parties without your consent, except as required by law.
            </Text>

            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.text}>
              You have the right to:
              {'\n'}• Access your personal information.
              {'\n'}• Request correction of your personal information.
              {'\n'}• Request deletion of your personal information.
            </Text>

            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.text}>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new policy here.
            </Text>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.text}>
              If you have any questions about this privacy policy, please contact us at support@example.com.
            </Text>
          </BlurView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left', // Align section title to the left
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left', // Align text to the left
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default PrivacyPolicy;
