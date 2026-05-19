import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, FadeOutUp } from 'react-native-reanimated';

const MedicalDisclaimerScreen = ({ onContinue }: { onContinue?: () => void }) => {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(700)} style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <Text style={styles.headerSystemId}></Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.card}>
        <Text style={styles.title}>IMPORTANT MEDICAL DISCLAIMER</Text>
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 16 }}>
          <Animated.Text entering={FadeIn.delay(400).duration(700)} style={styles.criticalNotice}>[CRITICAL NOTICE]</Animated.Text>
          <Animated.Text entering={FadeIn.delay(600).duration(700)} style={styles.body}>
            THIS APPLICATION, MEDSCANNER, IS INTENDED FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. IT IS NOT A MEDICAL DEVICE AND IS NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE OR MEDICAL CONDITION.{"\n\n"}
            THE ARTIFICIAL INTELLIGENCE IDENTIFICATION ENGINE IS SUBJECT TO ERROR RATES BASED ON LIGHTING, CAMERA QUALITY, AND DATABASE DISCREPANCIES. NEVER RELY ON THIS APPLICATION AS THE SOLE METHOD FOR IDENTIFYING OR VERIFYING MEDICATIONS.{"\n\n"}
            ALWAYS COMPARE THE IDENTIFIED MEDICATION WITH THE PHYSICAL PRESCRIPTION LABEL.
          </Animated.Text>
        </ScrollView>
        <Animated.View entering={FadeIn.delay(800).duration(700)} style={styles.statusBar}>
          <Text style={styles.statusText}>STATUS: </Text>
          <Text style={styles.statusPending}>AWAITING USER CONFIRMATION</Text>
          <Text style={styles.version}></Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(1000).duration(700)}>
          <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.85}>
            <Text style={styles.buttonText}>I UNDERSTAND — CONTINUE</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(180deg, #0B1220 0%, #1A233A 100%)', // Subtle gradient
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    color: '#7DF9FF', // Brighter cyan
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
    fontFamily: 'monospace',
    textShadowColor: '#00F0FF',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  headerSystemId: {
    color: '#B0CFFF',
    fontSize: 13,
    fontFamily: 'monospace',
    textShadowColor: '#00F0FF',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(24,31,41,0.98)',
    borderRadius: 18,
    padding: 28,
    width: 360,
    minHeight: 520, // Expanded vertically
    shadowColor: '#00F0FF',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#3ECFFF',
    justifyContent: 'flex-start',
    // Add a subtle glow effect
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: '#FF4F7A', // More vibrant red-pink
    fontWeight: 'bold',
    fontSize: 34, // Increased font size for emphasis
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
    fontFamily: 'monospace',
    textShadowColor: '#FFB6B6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  criticalNotice: {
    color: '#FFD166',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    fontFamily: 'monospace',
    textShadowColor: '#FFB86B',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  body: {
    color: '#F3F6FF', // Brighter white
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 10,
    lineHeight: 26,
    textShadowColor: '#B0CFFF',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scroll: {
    maxHeight: 220,
    marginBottom: 14,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderTopWidth: 1,
    borderColor: '#3ECFFF',
    paddingTop: 10,
  },
  statusText: {
    color: '#B0CFFF',
    fontSize: 15,
    fontFamily: 'monospace',
  },
  statusPending: {
    color: '#FF4F7A',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'monospace',
    marginLeft: 2,
    marginRight: 8,
    textShadowColor: '#FFB6B6',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  version: {
    color: '#B0CFFF',
    fontSize: 15,
    fontFamily: 'monospace',
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: 'linear-gradient(90deg, #00CFFF 0%, #3ECFFF 100%)', // Vibrant blue gradient
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00F0FF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#10141A',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'monospace',
    letterSpacing: 1.2,
    textShadowColor: '#B0CFFF',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default MedicalDisclaimerScreen;
