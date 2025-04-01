
import { supabase } from "@/integrations/supabase/client";

export const testXAIAPI = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    console.error('No API key provided for XAI test');
    return false;
  }

  console.log('Testing X.AI API connection...');
  
  try {
    // Testing with a minimal request to the models endpoint
    const response = await fetch('https://api.x.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('X.AI API test failed:', response.status, response.statusText);
      return false;
    }
    
    console.log('X.AI API test successful');
    return true;
  } catch (error) {
    console.error('X.AI API test failed with exception:', error);
    return false;
  }
};

export const generateWithXAI = async (
  prompt: string,
  apiKey: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
) => {
  console.log('Generating with X.AI:', {
    prompt,
    model: options.model || 'grok-2',
    temperature: options.temperature || 0.7,
    maxTokens: options.maxTokens || 1000,
  });

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'grok-2',
        messages: [
          { role: 'system', content: options.systemPrompt || 'You are a helpful AI assistant' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('X.AI API request failed:', response.status, errorData);
      throw new Error(`X.AI API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating with X.AI:', error);
    throw error;
  }
};
