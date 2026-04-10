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
        <View style={styles.card}>
          <Text style={styles.kicker}>PERMISSION SETUP</Text>

          <Text style={styles.title}>Camera Access Required</Text>

          <Text style={styles.description}>
            MedScanner uses the camera to read medication labels and generate structured safety information.
          </Text>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Current status</Text>
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
                ? 'Permission Blocked'
                : 'Permission Denied'}
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Important</Text>
            <Text style={styles.warningText}>
              Camera access is required for scanning. Without this permission, scanning and result parsing cannot continue.
            </Text>
          </View>

          <TouchableOpacity
            onPress={requestCameraPermission}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Grant Camera Access</Text>
          </TouchableOpacity>

          {permissionStatus === RESULTS.BLOCKED && (
            <View style={styles.settingsNote}>
              <Text style={styles.settingsNoteText}>
                Open Settings, then Apps, MedScanner, and Permissions to allow Camera access.
              </Text>
            </View>
          )}
        </View>
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
  card: {
    width: '100%',
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 10,
    padding: SPACING.LARGE,
  },
  kicker: {
    fontSize: 10,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.CYAN,
    letterSpacing: 1,
    marginBottom: SPACING.SMALL,
  },
  title: {
    fontSize: 30,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    marginBottom: SPACING.MEDIUM,
  },
  description: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LARGE,
    lineHeight: 20,
  },
  statusBox: {
    width: '100%',
    backgroundColor: COLORS.BG_DARK,
    borderWidth: 2,
    borderColor: COLORS.ALERT_ORANGE,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontFamily: FONTS.VT323,
    fontWeight: 'bold',
  },
  warningBox: {
    width: '100%',
    backgroundColor: COLORS.BG_DARK,
    borderWidth: 1,
    borderColor: COLORS.RED,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
    borderRadius: 6,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: FONTS.VT323,
    color: COLORS.RED,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 17,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.CYAN,
    paddingVertical: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.CYAN,
    marginTop: SPACING.MEDIUM,
  },
  settingsNote: {
    width: '100%',
    backgroundColor: COLORS.BG_DARK,
    borderWidth: 1,
    borderColor: COLORS.AMBER,
    padding: SPACING.MEDIUM,
    marginTop: SPACING.MEDIUM,
    borderRadius: 6,
  },
  settingsNoteText: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.AMBER,
    lineHeight: 16,
  },
});
