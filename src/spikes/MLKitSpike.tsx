import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

export default function MLKitSpike() {
  const cameraRef = useRef<RNCamera>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const captureAndRecognize = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      console.log('Button pressed!');
      console.log('Attempting to take picture...');
      
      const options = { quality: 0.7, base64: false };
      const data = await cameraRef.current.takePictureAsync(options);
      
      console.log('Picture taken:', data.uri);
      
      const result = await TextRecognition.recognize(data.uri);
      console.log('=== ML KIT SPIKE RESULT ===');
      console.log('Detected text:', result.text);
      console.log('Blocks:', result.blocks?.length || 0);
      
      Alert.alert(
        'Text Detected',
        `${result.blocks?.length || 0} text blocks detected\n\n${(result.text || '').substring(0, 150)}...`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('Error during capture/recognize:', error);
      Alert.alert('Error', `Failed to process image: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      
      <Pressable
        onPress={captureAndRecognize}
        disabled={isProcessing}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isProcessing && styles.buttonDisabled,
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>CAPTURE & RECOGNIZE</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0051D5',
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
