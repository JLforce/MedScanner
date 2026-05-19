import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { supabase } from '../services/supabaseClient';
import { COLORS, FONTS, SPACING } from '../constants';

interface SignupScreenProps {
  navigation: any;
  onSignupSuccess?: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation, onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Email confirmation disabled — navigate straight to login
      navigation.navigate('login');
    }
  };

  // Animation for MEDSCANNER label
  const pulseAnim = useSharedValue(1);
  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      true
    );
  }, []);
  const animatedBrandStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    textShadowRadius: 12 * pulseAnim.value,
    fontWeight: 'bold',
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.homeIconButton} onPress={() => navigation.replace('landing')}>
          <Text style={styles.homeIcon}>🏠</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.brandLabel, animatedBrandStyle]}>MEDSCANNER</Animated.Text>
        <Text style={styles.header}>NEW PROFILE INITIALIZATION</Text>

        <TextInput
          style={[styles.input, { width: '100%', marginBottom: SPACING.lg }]}
          placeholder="FULL_NAME"
          placeholderTextColor={COLORS.textSecondary}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        {/* Wrapped in formGroup for consistent spacing */}
        <TextInput
          style={[styles.input, { width: '100%', marginBottom: SPACING.lg }]}
          placeholder="EMAIL_ADDRESS"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { width: '100%', marginBottom: SPACING.lg }]}
          placeholder="CREATE_PASSWORD"
          placeholderTextColor={COLORS.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { width: '100%', marginBottom: SPACING.lg }]}
          placeholder="CONFIRM_PASSWORD"
          placeholderTextColor={COLORS.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'CREATING...' : ' CREATE ACCOUNT '}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.loginLinkText}> LOGIN </Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By creating a profile, you agree to the terms and conditions of MedScanner.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  homeIconButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
    backgroundColor: COLORS.BG_DARKER,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  homeIcon: {
    fontSize: 24,
    color: COLORS.CYAN,
  },
  brandLabel: {
    color: COLORS.CYAN,
    fontFamily: FONTS.VT323,
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: SPACING['2xl'],
    textAlign: 'center',
    textShadowColor: COLORS.GREEN,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    textTransform: 'uppercase',
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.BG_DARK,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: COLORS.CYAN,
    fontFamily: FONTS.VT323,
    fontSize: 24,
    marginBottom: SPACING['2xl'],
    letterSpacing: 2,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.GREEN,
    borderRadius: 4,
    padding: 12,
    color: COLORS.GREEN,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 16,
    backgroundColor: COLORS.BG_DARKER,
  },
  error: {
    color: COLORS.RED,
    fontFamily: FONTS.SHARE_TECH_MONO,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.GREEN,
    paddingVertical: 14,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  createButtonText: {
    color: COLORS.BG_DARK,
    fontFamily: FONTS.VT323,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  loginLink: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  loginLinkText: {
    color: COLORS.CYAN,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 14,
    letterSpacing: 1,
  },
  termsText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 10,
    marginTop: SPACING.xl,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default SignupScreen;