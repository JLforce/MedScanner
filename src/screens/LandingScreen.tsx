import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '../constants';

const { width } = Dimensions.get('window');

interface LandingScreenProps {
  onStartScanning: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartScanning }) => {
  // Animations
  const pulseAnim = useSharedValue(1);
  const cursorOpacity = useSharedValue(1);
  const scanlinePos = useSharedValue(-100);

  useEffect(() => {
    // Pulse animation for the button
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    // Blinking cursor for the brand name
    cursorOpacity.value = withRepeat(
      withTiming(0, { duration: 500 }),
      -1,
      true
    );

    // Moving scanline effect
    scanlinePos.value = withRepeat(
      withTiming(500, { duration: 4000 }),
      -1,
      false
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    shadowOpacity: interpolate(pulseAnim.value, [1, 1.05], [0.3, 0.6]),
  }));

  const animatedCursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  const animatedScanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanlinePos.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decor */}
      <View style={styles.backdropLayer}>
         <Animated.View style={[styles.scanline, animatedScanlineStyle]} />
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SYSTEM: OPERATIONAL</Text>
        </View>
        <Text style={styles.versionText}>V1.0.4-STABLE</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandPrefix}>[</Text>
          <Text style={styles.brand}>MED-SCANNER</Text>
          <Animated.View style={[styles.cursor, animatedCursorStyle]} />
          <Text style={styles.brandSuffix}>]</Text>
        </View>
        <Text style={styles.tagline}>PRECISION MEDICATION ANALYSIS</Text>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <View style={styles.dividerDot} />
          <View style={styles.divider} />
        </View>
      </View>

      {/* Main Panel */}
      <View style={styles.panel}>
        <View style={styles.panelCornerTL} />
        <View style={styles.panelCornerTR} />
        <View style={styles.panelCornerBL} />
        <View style={styles.panelCornerBR} />

        <Text style={styles.panelTitle}>CORE CAPABILITIES</Text>
        
        <View style={styles.featureList}>
          <FeatureItem label="OCR" value="ML-KIT VISION v3" />
          <FeatureItem label="PARSER" value="NEURAL REGEX ENGINE" />
          <FeatureItem label="SAFETY" value="DRUG-INTERACTION DB" />
        </View>

        <Text style={styles.heroDescription}>
          Advanced computer vision system designed to assist seniors and caregivers with 
          accurate medication label reading and interaction safety checks.
        </Text>
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={onStartScanning} 
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>INITIALIZE SCAN</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.helperText}>POSITION LABEL WITHIN TARGET RETICLE</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          * CLINICAL ADVISORY: THIS TOOL IS FOR INFORMATIONAL PURPOSES ONLY.
        </Text>
        <Text style={styles.footerNote}>
          ALWAYS CONSULT A PROFESSIONAL BEFORE MEDICATION CHANGES.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const FeatureItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.featureRow}>
    <Text style={styles.featureLabel}>{label}</Text>
    <View style={styles.featureConnector} />
    <Text style={styles.featureValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
    paddingHorizontal: SPACING.LARGE,
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BG_DARK,
    overflow: 'hidden',
  },
  scanline: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.CYAN,
    opacity: 0.1,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.MEDIUM,
    paddingBottom: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BG_MEDIUM,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.GREEN,
    marginRight: 6,
    shadowColor: COLORS.GREEN,
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.GREEN,
    letterSpacing: 1,
  },
  versionText: {
    fontSize: 10,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
  },
  heroSection: {
    marginTop: SPACING.XLARGE,
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandPrefix: {
    fontSize: 32,
    fontFamily: FONTS.VT323,
    color: COLORS.TEXT_SECONDARY,
    marginRight: 8,
  },
  brandSuffix: {
    fontSize: 32,
    fontFamily: FONTS.VT323,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
  },
  brand: {
    fontSize: 42,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    letterSpacing: 2,
    textShadowColor: COLORS.CYAN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cursor: {
    width: 12,
    height: 28,
    backgroundColor: COLORS.CYAN,
    marginLeft: 4,
  },
  tagline: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.MEDIUM,
    width: '60%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BG_MEDIUM,
  },
  dividerDot: {
    width: 4,
    height: 4,
    backgroundColor: COLORS.CYAN,
    marginHorizontal: 8,
    transform: [{ rotate: '45deg' }],
  },
  panel: {
    marginTop: SPACING.XLARGE,
    backgroundColor: 'rgba(26, 31, 58, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.BG_MEDIUM,
    padding: SPACING.LARGE,
    position: 'relative',
  },
  panelCornerTL: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: COLORS.CYAN },
  panelCornerTR: { position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTopWidth: 2, borderRightWidth: 2, borderColor: COLORS.CYAN },
  panelCornerBL: { position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: COLORS.CYAN },
  panelCornerBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: COLORS.CYAN },
  
  panelTitle: {
    fontSize: 18,
    fontFamily: FONTS.VT323,
    color: COLORS.AMBER,
    marginBottom: SPACING.MEDIUM,
    letterSpacing: 1,
  },
  featureList: {
    marginBottom: SPACING.MEDIUM,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  featureLabel: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    width: 60,
  },
  featureConnector: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BG_DARK,
    marginHorizontal: 8,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: COLORS.TEXT_TERTIARY,
  },
  featureValue: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.CYAN,
  },
  heroDescription: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
    textAlign: 'justify',
  },
  actionSection: {
    marginTop: 'auto',
    marginBottom: SPACING.XLARGE,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.CYAN,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.XLARGE,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.CYAN,
    shadowColor: COLORS.CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 20,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  helperText: {
    marginTop: SPACING.MEDIUM,
    fontSize: 10,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: SPACING.LARGE,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 9,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
    marginBottom: 2,
  },
});
