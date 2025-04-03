import { useState, useEffect, useRef } from 'react';
import { useSettings } from './use-settings';

export const useVoiceGreeting = () => {
  const { preferences } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [greeting, setGreeting] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synth = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
      setIsAvailable(!!synth.current);
    }

    // Check user preference for voice greeting
    const userPreference = preferences?.voiceGreetingEnabled;
    setVoiceEnabled(userPreference === true);

    // Generate appropriate greeting based on time of day
    const hours = new Date().getHours();
    let greetingText = '';
    
    if (hours < 12) {
      greetingText = 'Good morning';
    } else if (hours < 18) {
      greetingText = 'Good afternoon';
    } else {
      greetingText = 'Good evening';
    }
    
    // Add user name if available
    const userName = preferences?.userName || '';
    if (userName) {
      greetingText += `, ${userName}`;
    }
    
    setGreeting(greetingText);

    // Cleanup function
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, [preferences]);

  // Function to speak the greeting
  const speakGreeting = (text: string = greeting) => {
    if (!isAvailable || !voiceEnabled) return;
    
    if (synth.current) {
      // Cancel any ongoing speech
      synth.current.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice properties if preferred
      if (preferences?.voiceSettings) {
        const { rate, pitch, volume, voice } = preferences.voiceSettings;
        
        if (rate) utterance.rate = rate;
        if (pitch) utterance.pitch = pitch;
        if (volume) utterance.volume = volume;
        
        // Set voice if specified and available
        if (voice && synth.current.getVoices().length > 0) {
          const voices = synth.current.getVoices();
          const selectedVoice = voices.find(v => v.name === voice);
          if (selectedVoice) utterance.voice = selectedVoice;
        }
      }
      
      // Add event handlers
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      // Speak the utterance
      synth.current.speak(utterance);
    }
  };

  // Function to play audio greeting if available
  const playAudioGreeting = (audioUrl: string) => {
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }
    
    audioRef.current.onplay = () => setIsPlaying(true);
    audioRef.current.onended = () => setIsPlaying(false);
    audioRef.current.onerror = () => setIsPlaying(false);
    
    audioRef.current.play().catch(err => {
      console.error('Error playing audio greeting:', err);
      setIsPlaying(false);
    });
  };

  // Function to stop any playing greeting
  const stopGreeting = () => {
    if (synth.current) {
      synth.current.cancel();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsPlaying(false);
  };

  // Toggle voice greeting preference
  const toggleVoiceGreeting = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    // This would typically save to user preferences
    return enabled;
  };

  return {
    isPlaying,
    isAvailable,
    voiceEnabled,
    greeting,
    speakGreeting,
    playAudioGreeting,
    stopGreeting,
    toggleVoiceGreeting
  };
};
