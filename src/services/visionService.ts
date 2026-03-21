// Google Cloud Vision API Service for text recognition

const VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || '';

interface VisionResponse {
  text: string;
  blocks: Array<{
    confidence: number;
    text: string;
  }>;
}

export const recognizeTextFromUri = async (imageUri: string): Promise<VisionResponse> => {
  if (!VISION_API_KEY) {
    throw new Error('Google Vision API key not configured. Set EXPO_PUBLIC_GOOGLE_VISION_API_KEY in your .env file.');
  }

  try {
    // Read the image file and convert to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(',')[1];

          // Call Google Cloud Vision API
          const visionResponse = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                requests: [
                  {
                    image: {
                      content: base64Image,
                    },
                    features: [
                      {
                        type: 'TEXT_DETECTION',
                      },
                    ],
                  },
                ],
              }),
            }
          );

          const data = await visionResponse.json();

          if (data.error) {
            reject(new Error(`Vision API Error: ${data.error.message}`));
            return;
          }

          const annotations = data.responses[0].textAnnotations || [];

          // Extract full text (first annotation contains all text)
          const fullText = annotations.length > 0 ? annotations[0].description : '';

          // Extract blocks (paragraphs/sections)
          const blocks = annotations.slice(1).map((annotation: any) => ({
            text: annotation.description,
            confidence: annotation.confidence || 0,
          }));

          resolve({
            text: fullText,
            blocks,
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Text recognition failed: ${error}`);
  }
};
