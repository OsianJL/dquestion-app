import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Alert } from 'react-native'

interface ErrorResponse {
    message: string;
  }

interface User {
  id: string;
  email: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Cargar usuario desde AsyncStorage al inicio
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://your-backend.com/api/login", { email, password });
      const userData = response.data;
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      router.replace("/profile"); // Redirige a la pantalla de perfil
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        Alert.alert("Error", axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acceder al contexto de usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
