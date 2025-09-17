
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available, otherwise throw an error.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates four images from a prompt by making parallel requests,
 * and reports progress for each image individually via callbacks.
 * @param prompt The text prompt for image generation.
 * @param onImageGenerated A callback function fired when an image is successfully generated.
 * @param onImageError A callback function fired when an image generation fails.
 */
export const generateImagesFromPrompt = async (
  prompt: string,
  onImageGenerated: (image: string, index: number) => void,
  onImageError: (error: Error, index: number) => void
): Promise<void> => {
  try {
    const generationPromises = Array.from({ length: 4 }).map((_, index) => {
      // Create a unique prompt for each image to encourage diversity
      const uniquePrompt = `${prompt} - variation ${index + 1}`;
      
      return ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: uniquePrompt,
        config: {
          numberOfImages: 1, // Generate one image per request
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      })
      .then(response => {
        if (!response.generatedImages || response.generatedImages.length === 0) {
          throw new Error("The API did not return an image. The prompt might be too restrictive or violate safety policies.");
        }
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        onImageGenerated(imageUrl, index);
      })
      .catch(error => {
        console.error(`Error generating image at index ${index}:`, error);
        let userFriendlyError: Error;
        if (error instanceof Error) {
            if (error.message.includes('deadline')) {
                userFriendlyError = new Error("Request timed out.");
            } else if (error.message.includes('API key')) {
                userFriendlyError = new Error("API key issue.");
            } else {
                userFriendlyError = new Error("Generation failed.");
            }
        } else {
            userFriendlyError = new Error("An unknown error occurred.");
        }
        onImageError(userFriendlyError, index);
      });
    });

    // Wait for all generation attempts to complete (either success or failure)
    await Promise.allSettled(generationPromises);

  } catch (error) {
    console.error("A critical error occurred during image generation setup:", error);
    // This top-level catch is for setup errors, not individual image failures.
    throw new Error("Failed to initialize image generation process.");
  }
};
