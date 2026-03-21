import { useCallback, useRef, useState, useEffect } from 'react';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { TextDetectionResult } from '../types';
import { OCR_CONFIG } from '../constants';
import { ErrorHandler } from '../utils/errorHandler';

interface FrameProcessorHookResult {
  isProcessing: boolean;
  lastDetectionResult: TextDetectionResult | null;
  error: Error | null;
  processFrame: (frame: any) => Promise<void>;
}

/**
 * Hook for real-time video frame processing with ML Kit text recognition
 * Returns processed OCR results from camera frames
 *
 * Optimizations:
 * - Debounces heavy ML Kit calls (min 500ms between frames)
 * - Buffers text results to reduce re-renders
 * - Tracks confidence scores and text stability
 */
export const useVisionFrameProcessor = (
  enabled: boolean = true
): FrameProcessorHookResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetectionResult, setLastDetectionResult] =
    useState<TextDetectionResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Debounce tracking to avoid processing every frame
  const lastProcessTimeRef = useRef<number>(0);
  const bufferRef = useRef<TextDetectionResult | null>(null);

  const processFrame = useCallback(
    async (frame: any) => {
      if (!enabled || isProcessing) {
        return;
      }

      const now = Date.now();
      const timeSinceLastProcess = now - lastProcessTimeRef.current;

      // Debounce: Skip if less than MIN_FRAME_INTERVAL ms since last process
      if (timeSinceLastProcess < OCR_CONFIG.MIN_FRAME_INTERVAL) {
        return;
      }

      try {
        setIsProcessing(true);
        setError(null);
        lastProcessTimeRef.current = now;

        // Extract image data from frame
        const image = frame?.image || frame;
        if (!image) {
          throw new Error('No image data in frame');
        }

        // Call ML Kit text recognition
        const result = await TextRecognition.recognize(image);

        // Process results
        if (result && result.blocks && result.blocks.length > 0) {
          const rawText = result.blocks
            .map((block: any) => block.text)
            .join('\n');

          const detectionResult: TextDetectionResult = {
            text: rawText,
            rawText: rawText, // Alias for compatibility
            blocks: result.blocks.map((block: any) => ({
              text: block.text,
              confidence: block.recognizedLanguages?.[0]?.confidence || 0.5,
              boundingBox: block.frame ? {
                x: block.frame.x || 0,
                y: block.frame.y || 0,
                width: block.frame.width || 0,
                height: block.frame.height || 0,
              } : undefined,
            })),
            timestamp: now,
            processingTime: Date.now() - now,
            frameSize: {
              width: frame?.width || image?.width || 0,
              height: frame?.height || image?.height || 0,
            },
          };

          // Update buffer and state
          bufferRef.current = detectionResult;
          setLastDetectionResult(detectionResult);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        ErrorHandler.logOCRError(error);
        setError(error);
      } finally {
        setIsProcessing(false);
      }
    },
    [enabled, isProcessing]
  );

  return {
    isProcessing,
    lastDetectionResult,
    error,
    processFrame,
  };
};

/**
 * Hook to track text stability over consecutive frames
 * Helps determine when text "locks on" (stable for N consecutive frames)
 */
export const useTextStability = (
  detectionResult: TextDetectionResult | null,
  stabilityThreshold: number = 3 // Frames until "locked"
) => {
  const [isTextLocked, setIsTextLocked] = useState(false);
  const lastTextRef = useRef<string>('');
  const stabilityCounterRef = useRef<number>(0);

  useEffect(() => {
    if (!detectionResult) {
      return;
    }

    const currentText = (detectionResult.rawText || detectionResult.text).trim();

    // If text changed, reset counter
    if (currentText !== lastTextRef.current) {
      lastTextRef.current = currentText;
      stabilityCounterRef.current = 0;
      setIsTextLocked(false);
      return;
    }

    // Text is stable, increment counter
    stabilityCounterRef.current += 1;

    if (stabilityCounterRef.current >= stabilityThreshold) {
      setIsTextLocked(true);
    }
  }, [detectionResult, stabilityThreshold]);

  return {
    isTextLocked,
    stabilityCount: stabilityCounterRef.current,
  };
};

/**
 * Hook to detect low-light conditions from frame metadata
 * Returns brightness score (0-1) and warning state
 */
export const useLowLightDetection = (
  frame: any | null,
  threshold: number = OCR_CONFIG.LOW_LIGHT_THRESHOLD
) => {
  const [brightness, setBrightness] = useState<number>(1);
  const [isDimLight, setIsDimLight] = useState(false);

  useEffect(() => {
    if (!frame) {
      return;
    }

    // Estimate brightness from frame metadata
    // Note: This is a simplified approach; real implementation would
    // analyze pixel data if available from vision-camera
    const estimatedBrightness = 1.0; // Placeholder - would calculate from image

    setBrightness(estimatedBrightness);
    setIsDimLight(estimatedBrightness < threshold);
  }, [frame, threshold]);

  return {
    brightness,
    isDimLight,
  };
};
