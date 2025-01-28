import { useTheme } from "@/components/ThemeContext";
import React, { useState } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import { auth } from '../firebase'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';

 export default function EmailVerification() {
    const { isLightScheme } = useTheme();
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [error, setError] = useState(''); // To manage and display error messages

    const checkEmailVerification = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('No authenticated user found');
          setModalVisible(true);
          return;
        }
        await user.reload();
        console.log(user.emailVerified);
          if (user.emailVerified){
              router.replace('/username');
          } else {
              setError('Email not verified - verify your email and try again');
              setModalVisible(true);
          }
      } catch (error) {
        setError('An error occurred - please try again later');
        setModalVisible(true);
      }
      
    }

    return(
        <GestureHandlerRootView style={[styles.container, themeContainerStyle]}>
            {/* Logo */}
            <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/logo_only.png')} style={styles.logo} />
            </View>
            {/* Main Text */}
            <View style={styles.mainTextContainer}>
                <Text style={themeTextStyle}>1. Verify your email address through the link sent to your inbox.</Text>
                <Text style={themeTextStyle}>2. Press the button once your email has been verified to start Jamming!</Text>
            </View>
            {/* Is Email Verified Button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={() => checkEmailVerification()}>
               <Text style={{ color: 'white' }}>Continue</Text>
            </TouchableOpacity>
             {/* Test Button 
            <TouchableOpacity style={styles.buttonContainer} onPress={() => setVerified(true)}>
               <Text style={{ color: 'white' }}>Verify</Text>
            </TouchableOpacity>
            */}
            {/* Modal for error messages */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <StatusBar style={isLightScheme ? "dark" : "light"} />
        </GestureHandlerRootView>
    )
 }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      imageContainer: {
        padding: 20,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
      mainTextContainer: {
        padding: 20,
    },
    mainText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
      buttonContainer: {
        padding: 20,
        backgroundColor: '#f34727',
        borderRadius: 20,
        margin: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
      },
      modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f34727',
        borderRadius: 5,
      },
      modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },

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
});