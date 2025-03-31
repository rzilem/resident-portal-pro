
// Test API call to validate X.AI credentials
export const testXAIAPI = async (apiKey: string) => {
  if (!apiKey) {
    console.error('No API key provided for X.AI test');
    return false;
  }
  
  try {
    console.log('Testing X.AI API with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
    
    // Since we can't make actual API calls in this demo, we'll simulate a test
    // In a real implementation, you would make a lightweight API call to X.AI
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate an API response based on the API key format
    // Just for demo purposes - always returns true if the key starts with "sk-"
    const success = apiKey.startsWith('sk-');
    
    console.log('X.AI test result:', success ? 'success' : 'failed');
    return success;
  } catch (error) {
    console.error('Error testing X.AI API:', error);
    return false;
  }
};
