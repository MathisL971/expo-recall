import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { Button, TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import SettingsSVG from "../assets/svgs/settings";
import { SettingsSheet } from "./(auth)/_components/settings-sheet";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkLoaded>
            <AuthenticationLayer />
          </ClerkLoaded>
        </ClerkProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

const AuthenticationLayer = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && !inAuthGroup) {
      router.replace("/index");
    } else if (!isSignedIn && inAuthGroup) {
      router.replace("/auth");
    }
  }, [isSignedIn]);

  return (
    <Stack>
      {isSignedIn ? (
        <Stack.Screen
          name="(auth)"
          options={{
            headerTitle: "Recall",
            headerRight: () => {
              return (
                <Button
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                  }}
                  onPress={() => {
                    setOpen(true);
                  }}
                >
                  <SettingsSVG />
                  {open && <SettingsSheet open={open} setOpen={setOpen} />}
                </Button>
              );
            },
          }}
        />
      ) : (
        <Stack.Screen
          name="(public)"
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack>
  );
};
