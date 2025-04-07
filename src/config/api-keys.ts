
/**
 * API Keys configuration file
 * Note: In production, these would typically be stored in environment variables or a secure vault
 * This is a simplified implementation for development purposes
 */

export const API_KEYS = {
  /**
   * ElevenLabs API Key for text-to-speech functionality
   */
  ELEVEN_LABS: "sk_8c48927277fabd7fd22f26a2c9b2c2e8546e692a4e7f4559"
};

/**
 * Get API key by service name
 * @param service The service name to get the API key for
 * @returns The API key for the specified service
 */
export function getApiKey(service: keyof typeof API_KEYS): string {
  return API_KEYS[service];
}
