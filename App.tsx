import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { TextDetectionResult, ParsedMedication } from './src/types';
import { COLORS, FONTS } from './src/constants';

function AppContent() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize app services here (DB, settings, etc.)
      // For now, just mark as ready
      setIsInitialized(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    }
  };

  const handleMedicationDetected = (result: TextDetectionResult) => {
    console.log('Medication detected (raw OCR):', result.rawText || result.text);
  };

  const handleMedicationParsed = (parsed: ParsedMedication) => {
    console.log('Medication parsed:', {
      drugName: parsed.drugName,
      dosage: parsed.dosage,
      unit: parsed.unit,
      confidence: parsed.confidence,
      requiresManualReview: parsed.requiresManualReview,
      reviewReason: parsed.reviewReason,
    });
    // TODO: Route to review/analysis screen or save to DB
  };

  const handleScannerError = (error: Error) => {
    console.error('Scanner error:', error);
    setError(error);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Error: {error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.CYAN} />
          <Text style={styles.loadingText}>Initializing MedScanner...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScannerScreen
      onMedicationDetected={handleMedicationDetected}
      onMedicationParsed={handleMedicationParsed}
      onError={handleScannerError}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG_DARK,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG_DARK,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.RED,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
