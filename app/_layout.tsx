import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { UserProvider } from "../context/UserContext";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Manejar enlaces cuando la app ya está abierta
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      const { path, queryParams } = Linking.parse(url);
      
      if (path === "verify-email" && queryParams?.token) {
        router.push(`/verify-email?token=${queryParams.token}`);
      }
    };

    // Escuchar eventos de deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Manejar el caso en que la app se abra con un deep link
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => subscription.remove();
  }, []);

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}
