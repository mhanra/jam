import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGlobalSearchParams, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/components/ThemeContext';

export default function HomePage() {
  const { isLightScheme } = useTheme();

  
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeTextInputStyle = isLightScheme
    ? [styles.inputLight, styles.lightTextInput]
    : [styles.inputDark, styles.darkTextInput];
    const router = useRouter();

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={themeTextStyle}>This is the Enter Song Page</Text>
      <StatusBar style={isLightScheme ? "dark" : "light"} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    lightContainer: {
        backgroundColor: "#d0d0c0",
      },
      darkContainer: {
        backgroundColor: "#242c40",
      },
      lightThemeText: {
        color: "#242c40",
      },
      darkThemeText: {
        color: "#d0d0c0",
      },
      inputDark: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        //:  "#242c40",
    },
    inputLight: {
        height: 40,
        borderColor: "#242c40",
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        //color: '#ddd',
    },
    lightTextInput: {
        color: '#000', // Black text for light mode
      },
      darkTextInput: {
        color: '#fff', // White text for dark mode
      },
})