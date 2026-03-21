import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';

interface LandingScreenProps {
  onStartScanning: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartScanning }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backdropLayer} />

      <View style={styles.topRail}>
        <Text style={styles.badge}>CLINICAL ASSIST MODE</Text>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.brand}>MedScanner</Text>
        <Text style={styles.tagline}>Medication Label Assistant</Text>
        <Text style={styles.heroDescription}>
          Scan labels and receive clear medication details designed for safer, day-to-day use.
        </Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>How it helps</Text>
          <Text style={styles.panelSubTitle}>Fast on-device processing</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.itemDot} />
          <Text style={styles.featureItem}>Capture label text using your camera</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.itemDot} />
          <Text style={styles.featureItem}>Extract drug name, dosage, and confidence score</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.itemDot} />
          <Text style={styles.featureItem}>Review parsed results before scanning again</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={onStartScanning} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Start Scanning</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>Tip: Hold label inside the frame for a clean lock-on.</Text>
      </View>

      <Text style={styles.footerNote}>Always confirm medication changes with your pharmacist or doctor.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.LARGE,
    paddingBottom: SPACING.XLARGE,
    justifyContent: 'space-between',
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BG_DARK,
    opacity: 0.98,
  },
  topRail: {
    alignItems: 'flex-start',
  },
  badge: {
    fontSize: 10,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.CYAN,
    borderWidth: 1,
    borderColor: COLORS.BG_MEDIUM,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 4,
    borderRadius: 20,
    letterSpacing: 1,
  },
  heroSection: {
    marginTop: SPACING.LARGE,
  },
  brand: {
    fontSize: 48,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
  },
  heroDescription: {
    marginTop: SPACING.MEDIUM,
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 19,
    maxWidth: '96%',
  },
  panel: {
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 8,
    padding: SPACING.LARGE,
  },
  panelHeader: {
    marginBottom: SPACING.MEDIUM,
  },
  panelTitle: {
    fontSize: 22,
    fontFamily: FONTS.VT323,
    color: COLORS.AMBER,
  },
  panelSubTitle: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.SMALL,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.CYAN,
    marginTop: 6,
    marginRight: SPACING.SMALL,
  },
  featureItem: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 18,
    flex: 1,
  },
  actionSection: {
    marginTop: SPACING.LARGE,
  },
  primaryButton: {
    backgroundColor: COLORS.CYAN,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 6,
    paddingVertical: SPACING.MEDIUM,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  helperText: {
    marginTop: SPACING.SMALL,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 16,
  },
});
