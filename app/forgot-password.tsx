import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";

interface ErrorResponse {
  message: string;
}

// Esquema de validación con Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await axios.post("https://your-backend.com/api/forgot-password", data);
      Alert.alert("Success", "A password reset link has been sent to your email.");
      router.push("/login");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      Alert.alert("Error", axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Enter your email" 
        keyboardType="email-address" 
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Reset Link"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#007bff",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    marginTop: 10,
    color: "#007bff",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    width: "80%",
  },
});
