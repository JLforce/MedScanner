/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 * Prevents white screen of death in production
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Logger, ErrorHandler } from '@/utils/errorHandler';
import { COLORS, FONTS, SPACING } from '@/constants';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  private logger = Logger.getInstance();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    this.logger.critical(
      'REACT_ERROR_BOUNDARY',
      `React Error Caught: ${error.message}`,
      {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
      },
      error.stack
    );

    // Update state with error details
    this.setState((prevState) => ({
      ...prevState,
      errorInfo,
    }));
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.backgroundDark,
            padding: SPACING.lg,
            justifyContent: 'center',
          }}
        >
          <ScrollView>
            <View style={{ marginBottom: SPACING.xl }}>
              {/* Error Icon */}
              <Text
                style={{
                  fontSize: 48,
                  textAlign: 'center',
                  color: COLORS.error,
                  marginBottom: SPACING.lg,
                }}
              >
                ⚠️
              </Text>

              {/* Title */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: COLORS.error,
                  textAlign: 'center',
                  fontFamily: FONTS.retro.family,
                  marginBottom: SPACING.md,
                }}
              >
                SYSTEM ERROR
              </Text>

              {/* Error Message */}
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textPrimary,
                  textAlign: 'center',
                  fontFamily: FONTS.default.family,
                  marginBottom: SPACING.lg,
                  lineHeight: 20,
                }}
              >
                An unexpected error occurred. The app encountered a critical problem and needs to
                restart.
              </Text>

              {/* Error Details (dev mode) */}
              {__DEV__ && this.state.error && (
                <View
                  style={{
                    backgroundColor: COLORS.backgroundMedium,
                    padding: SPACING.md,
                    borderRadius: 4,
                    marginBottom: SPACING.lg,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.error,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textSecondary,
                      fontFamily: FONTS.default.family,
                      marginBottom: SPACING.sm,
                    }}
                  >
                    Error Message:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textPrimary,
                      fontFamily: FONTS.default.family,
                      marginBottom: SPACING.md,
                    }}
                  >
                    {this.state.error.message}
                  </Text>

                  {this.state.errorInfo && (
                    <>
                      <Text
                        style={{
                          fontSize: 12,
                          color: COLORS.textSecondary,
                          fontFamily: FONTS.default.family,
                          marginBottom: SPACING.sm,
                        }}
                      >
                        Component Stack:
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: COLORS.textTertiary,
                          fontFamily: FONTS.default.family,
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Text>
                    </>
                  )}
                </View>
              )}

              {/* Action Buttons */}
              <TouchableOpacity
                onPress={this.handleReset}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: SPACING.md,
                  paddingHorizontal: SPACING.lg,
                  borderRadius: 4,
                  marginBottom: SPACING.md,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              >
                <Text
                  style={{
                    color: COLORS.textInverse,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: FONTS.retro.family,
                  }}
                >
                  RETRY
                </Text>
              </TouchableOpacity>

              {/* Help Text */}
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                  fontFamily: FONTS.default.family,
                  marginTop: SPACING.lg,
                }}
              >
                If the problem persists, please restart the app.
              </Text>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
