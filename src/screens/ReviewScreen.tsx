import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ParsedMedication } from '../types';
import { COLORS, FONTS, SPACING } from '../constants';

interface ReviewScreenProps {
  medication: ParsedMedication;
  onScanAnother: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  medication,
  onScanAnother,
}) => {
  const confidencePercent = Math.round(medication.confidence * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Result</Text>
        <Text style={styles.headerSubtitle}>Detected medication details</Text>
      </View>

      <View style={styles.resultCard}>
        <View style={styles.rowBlock}>
          <Text style={styles.label}>Drug Name</Text>
          <Text style={styles.value}>{medication.drugName}</Text>
        </View>

        <View style={styles.rowBlock}>
          <Text style={styles.label}>Dosage</Text>
          <Text style={styles.value}>{medication.dosage} {medication.unit}</Text>
        </View>

        <View style={styles.rowBlock}>
          <Text style={styles.label}>Confidence</Text>
          <Text style={styles.value}>{confidencePercent}%</Text>
        </View>

        <View style={styles.rowBlock}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.value,
              medication.requiresManualReview ? styles.warnText : styles.okText,
            ]}
          >
            {medication.requiresManualReview ? 'Review Needed' : 'Verified'}
          </Text>
        </View>

        {medication.reviewReason ? (
          <View style={styles.rowBlock}>
            <Text style={styles.label}>Review Reason</Text>
            <Text style={styles.reason}>{medication.reviewReason}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onScanAnother} activeOpacity={0.85}>
        <Text style={styles.primaryButtonText}>Scan Another Label</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.LARGE,
  },
  header: {
    marginBottom: SPACING.LARGE,
  },
  headerTitle: {
    fontSize: 34,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
    letterSpacing: 1,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
  },
  resultCard: {
    backgroundColor: COLORS.BG_DARKER,
    borderWidth: 2,
    borderColor: COLORS.CYAN,
    borderRadius: 8,
    padding: SPACING.LARGE,
  },
  rowBlock: {
    marginBottom: SPACING.MEDIUM,
    paddingBottom: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BG_MEDIUM,
  },
  label: {
    fontSize: 11,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 0.5,
  },
  value: {
    marginTop: 2,
    fontSize: 24,
    fontFamily: FONTS.VT323,
    color: COLORS.CYAN,
  },
  okText: {
    color: COLORS.CYAN,
  },
  warnText: {
    color: COLORS.RED,
  },
  reason: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: FONTS.SHARE_TECH_MONO,
    color: COLORS.AMBER,
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: SPACING.XLARGE,
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
    letterSpacing: 0.8,
    fontWeight: 'bold',
  },
});
