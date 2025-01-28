import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useTheme } from "@/components/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow icon
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
    const { isLightScheme, toggleTheme } = useTheme();
    const router = useRouter();

    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeBottomBorderStyle = isLightScheme ? styles.lightBottomBorder : styles.darkBottomBorder;

    // Handle Log Out 
    function logOut() {
        //AsyncStorage.removeItem('loggedInUser');
        signOut(auth)
        .then(() => {
            router.replace('/')
        })
        .catch(error => alert(error.message))
    }

    return (
        <ScrollView style={[styles.container, themeContainerStyle]}>
             {/* Back Button */}
             <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
                <Ionicons name="arrow-back" size={24} color="blue" />
            </TouchableOpacity>
            {/* Title */}
            <View style={styles.centreContainer}>
                <Text style={[styles.title, themeTextStyle]}>Settings</Text>
            </View>
            {/*  Colour Scheme */}
            <View style={[styles.item, themeBottomBorderStyle]}>
                <Text style={[styles.itemText, themeTextStyle]}>Change Colour Scheme</Text>
                <TouchableOpacity style={styles.colourSchemeButton} onPress={toggleTheme}>
                    <Text style={styles.buttonText}>{isLightScheme ? 'Light' : 'Dark'}</Text>
                </TouchableOpacity>
            </View>
            {/*  Log Out */}
            <View style={styles.centreContainer}>
                <TouchableOpacity style={styles.logOutButton} onPress={()=>logOut()}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
             </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: "center",
        //justifyContent: "center",
      },
      backButton: {
        position: 'absolute',
        top: 20, 
        left: 20,
        zIndex: 1, // Ensure the button appears on top
    },
      colourSchemeButton: {
        padding: 10,
        backgroundColor: "#f34727",
        borderRadius: 10,
      },
      item: {
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
      },
      itemText: {
        flex: 1,
        fontSize: 16,
    },
      centreContainer: {
        alignItems: 'center',
      },
      title: {
        marginTop: 40,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        
    },
    logOutButton: {
        width: 120,
        padding: 20,
        backgroundColor: '#f34727',
        borderRadius: 20,
        margin: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
       //padding: 10,
        //backgroundColor: '#f34727',
        //borderRadius: 10,
      },
      buttonText: {
        color: 'white',
    },

      // Theme
      lightContainer: {
        backgroundColor: "#d0d0c0",
      },
      darkContainer: {
        backgroundColor: "#242c40",
      },
      lightThemeText: {
        color: "black",
      },
      darkThemeText: {
        color: "white",
      },
      lightBottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#242c40',
      },
      darkBottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#d0d0c0",
      },
})