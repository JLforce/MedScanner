import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const OnboardingScreen = ({ onNext, onSkip }: { onNext?: () => void; onSkip?: () => void }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MED_SCAN_V1.0</Text>
        <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>
      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/scan_bottle_green.png')} style={styles.image} resizeMode="contain" />
      </View>
      {/* How to Scan Section */}
      <View style={styles.howToContainer}>
        <Text style={styles.howToTitle}>HOW TO SCAN</Text>
        <View style={styles.underline} />
        <Text style={styles.instructions}>
          Hold your device 6 inches from the medication container.{"\n"}
          Ensure the label is centered within the brackets.
        </Text>
        <View style={styles.stepsContainer}>
          <Text style={styles.step}><Text style={styles.stepNum}>01.</Text> ALIGN LABEL WITH GRID</Text>
          <Text style={styles.step}><Text style={styles.stepNum}>02.</Text> KEEP STEADY FOR 2 SECONDS</Text>
          <Text style={styles.step}><Text style={styles.stepNum}>03.</Text> WAIT FOR AUDIBLE CONFIRMATION</Text>
        </View>
      </View>
      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        <View style={styles.backBtn} />
        <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
          <Text style={styles.nextText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10141A',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#B6F0FF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  skipBtn: {
    padding: 4,
  },
  skipText: {
    color: '#7A8B9C',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  dot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#232B36',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#3ECFFF',
  },
  imageContainer: {
    width: 240,
    height: 200,
    backgroundColor: '#181F29',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#3ECFFF',
    alignSelf: 'center',
  },
  image: {
    width: 200,
    height: 160,
  },
  howToContainer: {
    width: 320,
    backgroundColor: 'transparent',
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'center',
  },
  howToTitle: {
    color: '#D6FFB6',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  underline: {
    width: 38,
    height: 3,
    backgroundColor: '#3ECFFF',
    borderRadius: 2,
    marginBottom: 10,
  },
  instructions: {
    color: '#B6C2D1',
    fontFamily: 'monospace',
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 20,
  },
  stepsContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  step: {
    color: '#B6C2D1',
    fontFamily: 'monospace',
    fontSize: 15,
    marginBottom: 2,
    letterSpacing: 1,
  },
  stepNum: {
    color: '#3ECFFF',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 15,
  },
  navContainer: {
    flexDirection: 'row',
    width: 320,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
    alignSelf: 'center',
  },
  backBtn: {
    width: 90,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#181F29',
    opacity: 0.3,
  },
  nextBtn: {
    width: 90,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#3C6FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3C6FFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nextText: {
    color: '#E0E6ED',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

export default OnboardingScreen;
