// _layout.tsx
import React from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="enterSong" options={{ title: "Enter Song" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }}/>
        <Stack.Screen name="home" options={{ title: "Home" }} />
        <Stack.Screen name="userProfilePage" options={{ title: "User Profile" }} />
        <Stack.Screen name="favouritesList" options={{ title: "Favourites List" }} />
        <Stack.Screen name="commentsScreen" options={{ title: "Comments Screen" }} />
        <Stack.Screen name="otherUserProfile" options={{ title: "Other User's Profile" }} />
        <Stack.Screen name="username" options={{ title: "Select Username" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />        
        <Stack.Screen name="emailVerification" options={{ title: "Email Verification Screen" }} />
        </Stack>
      </ThemeProvider>
  );
}
