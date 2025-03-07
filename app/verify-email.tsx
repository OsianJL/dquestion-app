import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios, { AxiosError } from "axios";
import { useUser } from "../context/UserContext";

interface ErrorResponse {
  message: string;
}

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams(); // Captura el token del deep link
  const { login } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        // Llamada a la API para verificar el token
        const response = await axios.get(`http://10.0.2.2:5000/confirm/${token}`);
        const userData = response.data; // Datos del usuario tras la confirmación

        Alert.alert("Success", "Your email has been confirmed!");

        // Iniciar sesión automáticamente después de la verificación
        await login(userData.email, userData.password);
        router.replace("/profile");
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/signup")}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign up successfully!</Text>
          <Text style={styles.subtitle}>Redirecting to your profile...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
