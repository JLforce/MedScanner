import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Modal,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import HapticFeedback from 'react-native-haptic-feedback';
import textRecognition from '@react-native-ml-kit/text-recognition';
import { COLORS, FONTS, SPACING, OCR_CONFIG } from '../constants';
import { ParsedMedication, TextDetectionResult } from '../types';
import { CameraPermissionFlow } from '../components/CameraPermissionFlow';
import { ParsingService } from '../services/parsingService';
import { ScanHistoryService } from '../services/scanHistoryService';

interface ScannerScreenProps {
  onMedicationDetected?: (result: TextDetectionResult) => void;
  onMedicationParsed?: (parsed: ParsedMedication) => void;
  onError?: (error: Error) => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  onMedicationDetected,
  onMedicationParsed,
  onError,
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [currentDetection, setCurrentDetection] =
    useState<TextDetectionResult | null>(null);
  const [enableScanning, setEnableScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stabilityCount, setStabilityCount] = useState(0);
  const [isTextLocked, setIsTextLocked] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [parsedMedication, setParsedMedication] = useState<ParsedMedication | null>(null);
  const [showMedicationModal, setShowMedicationModal] = useState(false);

  const cameraRef = useRef<RNCamera>(null);
  const lastProcessedTime = useRef<number>(0);
  const previousText = useRef<string>('');
  const consecutiveMatchCount = useRef<number>(0);
  const parsingService = useRef(ParsingService.getInstance()).current;
  const scanHistoryService = useRef(ScanHistoryService.getInstance()).current;

  // Animation for lock-on indicator
  const lockIndicatorScale = useRef(new Animated.Value(1)).current;

  // Handle permission granted
  const handlePermissionGranted = useCallback(() => {
    setHasPermission(true);
  }, []);

  // Handle permission denied
  const handlePermissionDenied = useCallback(() => {
    Alert.alert(
      'Permission Denied',
      'Camera permission is required to use MedScanner. Please enable it in Settings.'
    );
  }, []);

  const triggerLockFeedback = useCallback(() => {
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    });

    Animated.sequence([
      Animated.timing(lockIndicatorScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(lockIndicatorScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [lockIndicatorScale]);

  const handleLockOn = useCallback(
    async (detection: TextDetectionResult, source: 'auto-lock' | 'manual-lock') => {
      setIsTextLocked(true);
      triggerLockFeedback();
      onMedicationDetected?.(detection);

      try {
        const parsed = await parsingService.parseMedicationLabel(
          detection.rawText || detection.text,
          detection.confidence ?? 0.85
        );
        setParsedMedication(parsed);
        onMedicationParsed?.(parsed);

        try {
          await scanHistoryService.saveParsedMedication(parsed, source);
        } catch (storageError) {
          console.warn('Scan history save failed:', storageError);
        }
      } catch (parseError) {
        console.error('Parsing error:', parseError);
      }
    },
    [
      onMedicationDetected,
      onMedicationParsed,
      parsingService,
      scanHistoryService,
      triggerLockFeedback,
    ]
  );

  // Process text detection result
  const processTextRecognition = useCallback(
    async (uri: string) => {
      if (!enableScanning || isProcessing) return;

      const now = Date.now();
      if (now - lastProcessedTime.current < OCR_CONFIG.MIN_FRAME_INTERVAL) {
        return;
      }

      try {
        setIsProcessing(true);
        lastProcessedTime.current = now;

        const result = await textRecognition.recognize(uri);
        const detectedText = result.text.trim();

        if (detectedText) {
          const detection: TextDetectionResult = {
            text: detectedText,
            rawText: detectedText,
            blocks: result.blocks.map(block => ({
              text: block.text,
              confidence: 1.0, // ML Kit doesn't provide confidence per block
              lines: block.lines.map(line => ({
                text: line.text,
                elements: line.elements.map(element => ({
                  text: element.text,
                })),
              })),
            })),
            timestamp: now,
          };

          setCurrentDetection(detection);

          // Check text stability with fuzzy matching (trim & normalize)
          const normalizedCurrent = detectedText.toLowerCase().trim().replace(/\s+/g, ' ');
          const normalizedPrevious = previousText.current.toLowerCase().trim().replace(/\s+/g, ' ');
          
          if (normalizedCurrent === normalizedPrevious) {
            consecutiveMatchCount.current += 1;
            setStabilityCount(consecutiveMatchCount.current);

            if (consecutiveMatchCount.current >= OCR_CONFIG.STABILITY_THRESHOLD) {
              if (!isTextLocked) {
                await handleLockOn(detection, 'auto-lock');
              }
            }
          } else {
            consecutiveMatchCount.current = 1;
            setStabilityCount(1);
            setIsTextLocked(false);
            setParsedMedication(null);
            previousText.current = detectedText;
          }
        }
      } catch (error) {
        console.error('Text recognition error:', error);
        onError?.(error as Error);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      enableScanning,
      isProcessing,
      isTextLocked,
      onMedicationDetected,
      onMedicationParsed,
      onError,
      handleLockOn,
    ]
  );

  // Periodic frame capture for OCR
  useEffect(() => {
    if (!enableScanning || !hasPermission || !cameraRef.current) return;

    const captureInterval = setInterval(async () => {
      // Prevent overlapping captures
      if (isCapturing || isProcessing || !cameraRef.current || !enableScanning) {
        return;
      }

      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        });
        await processTextRecognition(photo.uri);
      } catch (error) {
        console.error('Frame capture error:', error);
      } finally {
        setIsCapturing(false);
      }
    }, OCR_CONFIG.MIN_FRAME_INTERVAL);

    return () => clearInterval(captureInterval);
  }, [enableScanning, hasPermission, isProcessing, isCapturing, processTextRecognition]);

  // If no permission, show permission flow
  if (!hasPermission) {
    return (
      <CameraPermissionFlow
        onPermissionGranted={handlePermissionGranted}
        onPermissionDenied={handlePermissionDenied}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera Feed */}
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Camera Permission',
          message: 'MedScanner needs camera access',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={undefined}
      />


      {/* Scanning HUD Overlay */}
      <View style={styles.hudOverlay} pointerEvents="none">
        {/* Corner Indicators */}
        <View style={styles.corners}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Scanning Region */}
        <View style={styles.scanningRegion}>
          <Text style={styles.scanLabel}>SCANNING...</Text>
        </View>

        {/* Lock-On Indicator */}
        {isTextLocked && (
          <Animated.View
            style={[
              styles.lockIndicator,
              {
                transform: [{ scale: lockIndicatorScale }],
              },
            ]}
          >
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockText}>TEXT LOCKED</Text>
          </Animated.View>
        )}

        {/* Stability Counter */}
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {isProcessing ? 'PROCESSING...' : 'READY'}
          </Text>
          <Text style={styles.stabilitText}>
            STABILITY: {stabilityCount}/{OCR_CONFIG.STABILITY_THRESHOLD}
          </Text>
        </View>
      </View>

      {/* Control Bar */}
      <View style={styles.controlBar}>
        {/* Left Column: Buttons (Pause above, Lock-On below) */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setEnableScanning(!enableScanning)}
            activeOpacity={0.7}
          >
            <Text style={styles.controlButtonText}>
              {enableScanning ? '⏸ PAUSE' : '▶ RESUME'}
            </Text>
          </TouchableOpacity>

          {/* Manual Lock-On Button */}
          <TouchableOpacity
            style={[
              styles.lockOnButton,
              !currentDetection && !isTextLocked && styles.lockOnButtonDisabled,
            ]}
            onPress={async () => {
              if (isTextLocked) {
                setIsTextLocked(false);
                setStabilityCount(0);
                consecutiveMatchCount.current = 0;
                previousText.current = '';
                setParsedMedication(null);
                return;
              }

              if (currentDetection) {
                await handleLockOn(currentDetection, 'manual-lock');
              }
            }}
            disabled={!currentDetection && !isTextLocked}
            activeOpacity={0.7}
          >
            <Text style={styles.lockOnButtonText}>
              {isTextLocked ? '🔓 UNLOCK' : '🔒 LOCK-ON'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right: Detection Info - Clickable */}
        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => parsedMedication && setShowMedicationModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.infoLabel}>📊 MEDICATION DATA</Text>
          <Text style={styles.infoValue} numberOfLines={3}>
            {parsedMedication
              ? `${parsedMedication.drugName}\n${parsedMedication.dosage}${parsedMedication.unit}`
              : (currentDetection?.rawText || currentDetection?.text) || 'Scanning...'}
          </Text>
          <Text style={styles.infoMeta} numberOfLines={2}>
            {parsedMedication
              ? `✓ CONF: ${Math.round(parsedMedication.confidence * 100)}%${parsedMedication.requiresManualReview ? '  ⚠️ REVIEW' : '  ✓ OK'}`
              : '⏳ TAP LOCK-ON BUTTON'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Medication Details Modal */}
      <Modal
        visible={showMedicationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMedicationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowMedicationModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>💊 MEDICATION DETAILS</Text>

            {parsedMedication && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Drug Name:</Text>
                  <Text style={styles.detailValue}>{parsedMedication.drugName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dosage:</Text>
                  <Text style={styles.detailValue}>
                    {parsedMedication.dosage} {parsedMedication.unit}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Confidence:</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(parsedMedication.confidence * 100)}%
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: parsedMedication.requiresManualReview
                          ? COLORS.RED
                          : COLORS.CYAN,
                      },
                    ]}
                  >
                    {parsedMedication.requiresManualReview
                      ? '⚠️ NEEDS REVIEW'
                      : '✓ VERIFIED'}
                  </Text>
                </View>

                {parsedMedication.reviewReason && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Review Reason:</Text>
                    <Text style={styles.detailReason}>
                      {parsedMedication.reviewReason}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowMedicationModal(false)}
                >
                  <Text style={styles.modalButtonText}>CLOSE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  camera: {
    flex: 1,
  },
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corners: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: COLORS.CYAN,
  },
  topLeft: {
    top: 40,
    left: 30,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 40,
    right: 30,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 40,
    left: 30,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 40,
    right: 30,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanningRegion: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
  },
  scanLabel: {
    fontSize: 14,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    letterSpacing: 2,
  },
  lockIndicator: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 2,
    borderColor: COLORS.AMBER,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: 4,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: SPACING.SMALL,
  },
  lockText: {
    fontSize: 12,
    fontFamily: FONTS.VT323,
    color: COLORS.AMBER,
    letterSpacing: 1,
  },
  statusBar: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 1,
    borderColor: COLORS.CYAN,
    padding: SPACING.SMALL,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.CYAN,
    marginBottom: SPACING.SMALL,
  },
  stabilitText: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.BG_DARKER,
    borderTopWidth: 3,
    borderTopColor: COLORS.CYAN,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.LARGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: SPACING.MEDIUM,
    minHeight: 100,
  },
  buttonSection: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: SPACING.SMALL,
  },
  controlButton: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    backgroundColor: COLORS.CYAN,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 2,
  },
  controlButtonText: {
    fontSize: 12,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  lockOnButton: {
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.SMALL,
    backgroundColor: COLORS.AMBER,
    borderWidth: 2,
    borderColor: COLORS.AMBER,
    borderRadius: 2,
  },
  lockOnButtonDisabled: {
    backgroundColor: COLORS.TEXT_SECONDARY,
    borderColor: COLORS.TEXT_SECONDARY,
    opacity: 0.5,
  },
  lockOnButtonText: {
    fontSize: 12,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoBox: {
    flex: 1,
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 3,
    borderColor: COLORS.AMBER,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FONTS.VT323,
    color: COLORS.AMBER,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  infoMeta: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  modalContent: {
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 3,
    borderColor: COLORS.CYAN,
    borderRadius: 8,
    padding: SPACING.LARGE,
    maxWidth: '90%',
    minWidth: '85%',
  },
  modalClose: {
    position: 'absolute',
    top: SPACING.MEDIUM,
    right: SPACING.MEDIUM,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.RED,
    borderRadius: 18,
  },
  modalCloseText: {
    fontSize: 20,
    color: COLORS.BG_DARK,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: SPACING.SMALL,
  },
  detailRow: {
    marginBottom: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CYAN,
    paddingBottom: SPACING.SMALL,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.AMBER,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    fontWeight: 'bold',
  },
  detailReason: {
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.RED,
    fontStyle: 'italic',
  },
  modalButton: {
    marginTop: SPACING.LARGE,
    backgroundColor: COLORS.CYAN,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: FONTS.VT323,
    color: COLORS.BG_DARK,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.VT323,
    color: COLORS.RED,
    textAlign: 'center',
  },
});
