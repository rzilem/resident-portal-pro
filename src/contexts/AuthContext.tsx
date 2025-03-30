
import * as React from 'react';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string; // Add role property
};

interface AuthContextType {
  user: User | null;
  loading: boolean; // Add loading property
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true); // Initialize loading state

  // Effect to simulate loading check on initial render
  React.useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would check localStorage or a token
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate authentication
      const user = {
        id: '1',
        email: email,
        role: 'user' // Default role
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the useAuth hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
