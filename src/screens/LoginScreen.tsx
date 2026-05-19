import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { supabase } from '../services/supabaseClient';
import { COLORS, FONTS, SPACING } from '../constants';

interface LoginScreenProps {
  navigation: any;
  onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const animatedSystemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    textShadowRadius: 12 * pulseAnim.value,
    fontWeight: 'bold',
  }));

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: username, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigation.replace('LandingScreen');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.homeIconButton} onPress={() => navigation.replace('landing')}>
          <Text style={styles.homeIcon}>🏠</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.systemAccess, animatedSystemStyle]}>SYSTEM ACCESS</Animated.Text>
        <Text style={styles.subHeader}>REGISTERED USER LOGIN</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>USERNAME</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={COLORS.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>{loading ? 'INITIALIZING...' : 'LOGIN'}</Text>
        </TouchableOpacity>
        <View style={styles.linkRow}>
          <TouchableOpacity onPress={() => navigation.navigate('signup')} style={styles.linkItem}>
            <Text style={styles.linkText}> SIGNUP </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.linkItem}>
            <Text style={styles.linkText}>       FORGOT PASSWORD? </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>
        </Text>
        <Text style={styles.footerNote}></Text>
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
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.BG_DARK,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemAccess: {
    color: COLORS.GREEN,
    fontFamily: FONTS.VT323,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: SPACING.md,
    textAlign: 'center',
    textShadowColor: COLORS.CYAN,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  subHeader: {
    color: COLORS.CYAN,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 12,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    letterSpacing: 1,
  },
  formGroup: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.GREEN,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 12,
    marginBottom: 4,
    letterSpacing: 1,
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
    marginBottom: 2,
  },
  error: {
    color: COLORS.RED,
    fontFamily: FONTS.SHARE_TECH_MONO,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.GREEN,
    paddingVertical: 14,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  loginButtonText: {
    color: COLORS.BG_DARK,
    fontFamily: FONTS.VT323,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  linkItem: {
    marginHorizontal: 8,
  },
  linkText: {
    color: COLORS.CYAN,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 14,
    letterSpacing: 1,
  },
  disclaimer: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 11,
    marginTop: SPACING.xl,
    marginBottom: 2,
    textAlign: 'center',
    opacity: 0.7,
  },
  footerNote: {
    color: COLORS.textTertiary,
    fontFamily: FONTS.SHARE_TECH_MONO,
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 2,
  },
});

export default LoginScreen;