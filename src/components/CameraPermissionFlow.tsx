import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

interface CameraPermissionFlowProps {
  onPermissionGranted: () => void;
  onPermissionDenied?: () => void;
}

export const CameraPermissionFlow: React.FC<CameraPermissionFlowProps> = ({
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const status = await check(PERMISSIONS.ANDROID.CAMERA);
      setPermissionStatus(status);
      setLoading(false);

      if (status === RESULTS.GRANTED) {
        onPermissionGranted();
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      setLoading(true);
      const status = await request(PERMISSIONS.ANDROID.CAMERA);
      setPermissionStatus(status);

      if (status === RESULTS.GRANTED) {
        onPermissionGranted();
      } else if (
        status === RESULTS.DENIED ||
        status === RESULTS.BLOCKED
      ) {
        onPermissionDenied?.();
        Alert.alert(
          'Camera Permission Required',
          'MedScanner needs camera access to scan medication labels. Please enable it in Settings.',
          [
            {
              text: 'Cancel',
              onPress: () => onPermissionDenied?.(),
            },
            {
              text: 'Retry',
              onPress: () => requestCameraPermission(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={COLORS.CYAN} />
          <Text style={styles.loadingText}>Initializing Camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permissionStatus === RESULTS.GRANTED) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Retro Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📷</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Camera Access Required</Text>

        {/* Description */}
        <Text style={styles.description}>
          MedScanner needs access to your camera to scan medication labels and check for dangerous drug interactions.
        </Text>

        {/* Permission Status */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text
            style={[
              styles.statusValue,
              {
                color:
                  permissionStatus === RESULTS.BLOCKED
                    ? COLORS.RED
                    : COLORS.ALERT_ORANGE,
              },
            ]}
          >
            {permissionStatus === RESULTS.BLOCKED
              ? 'PERMISSION BLOCKED'
              : 'PERMISSION DENIED'}
          </Text>
        </View>

        {/* Warning Message */}
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Important:</Text>
          <Text style={styles.warningText}>
            Without camera access, MedScanner cannot scan medications. This feature is critical for your safety.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={requestCameraPermission}
          style={styles.button}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>ENABLE CAMERA ACCESS</Text>
        </TouchableOpacity>

        {/* Manual Settings Instruction */}
        {permissionStatus === RESULTS.BLOCKED && (
          <View style={styles.settingsNote}>
            <Text style={styles.settingsNoteText}>
              If you continue to see this message, manually enable Camera in Settings → Apps → MedScanner → Permissions.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: SPACING.LARGE,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.XLARGE,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LARGE,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusBox: {
    width: '100%',
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 2,
    borderColor: COLORS.ALERT_ORANGE,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
    borderRadius: 2,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SMALL,
  },
  statusValue: {
    fontSize: 16,
    fontFamily: FONTS.VT323,
    fontWeight: 'bold',
  },
  warningBox: {
    width: '100%',
    backgroundColor: COLORS.BG_DARKER,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.RED,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
    borderRadius: 2,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: FONTS.VT323,
    color: COLORS.RED,
    marginBottom: SPACING.SMALL,
  },
  warningText: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 18,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.CYAN,
    paddingVertical: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.CYAN,
    marginTop: SPACING.MEDIUM,
  },
  settingsNote: {
    width: '100%',
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 2,
    borderColor: COLORS.AMBER,
    padding: SPACING.MEDIUM,
    marginTop: SPACING.MEDIUM,
    borderRadius: 2,
  },
  settingsNoteText: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.AMBER,
    lineHeight: 16,
  },
});
