import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow icon
import FollowButton from '@/components/FollowButton';
import { useTheme } from "@/components/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";


export default function otherUserProfile() {
    const { userId } = useLocalSearchParams(); // Get userId from route parameters

    const { isLightScheme } = useTheme();
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeTextInputStyle = isLightScheme
    ? [styles.inputLight, styles.lightTextInput]
    : [styles.inputDark, styles.darkTextInput];
    const router = useRouter();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = doc(firestore, 'users', userId);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setUserData(userSnapshot.data());
                } else {
                    console.log('No such user!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    // Function to get artist names from the song object
    const getArtistNames = (song) => {
        if (!song || !Array.isArray(song.artists)) {
            return 'Unknown Artist'; // Fallback if no artist data is available
        }
        return song.artists.map(artist => artist || 'Unknown Artist').join(', ');
    };

    // Function to get the album image URL
    const getAlbumImageUrl = (song) => {
        return song?.cover[0]?.url; // Get the first image URL (usually the largest)
    };

    if (loading) {
        return (
            <GestureHandlerRootView style={[styles.container, themeContainerStyle]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </GestureHandlerRootView>
        );
    }

    if (!userData) {
        return (
            <GestureHandlerRootView style={[styles.container, themeContainerStyle]}>
                <Text style={[styles.errorText, themeTextStyle]}>User not found.</Text>
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView style={[styles.container, themeContainerStyle]}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
                <Ionicons name="arrow-back" size={24} color="blue" />
            </TouchableOpacity>
            
            {userData.profilePictureUrl && (
                <Image
                    source={{ uri: userData.profilePictureUrl }}
                    style={styles.profileImage}
                />
            )}
            <Text style={[styles.title, themeTextStyle]}>{userData.username}</Text>

            {userData.bio && <Text style={[styles.info, themeTextStyle]}>Bio: {userData.bio}</Text>}
            {userData.selectedSong ? (
                <View style={styles.songContainer}>
                {getAlbumImageUrl(userData.selectedSong) ? (
                    <Image
                    source={{ uri: getAlbumImageUrl(userData.selectedSong) }}
                    style={styles.albumImage}
                    />
                ) : null}
                <Text style={[styles.info, themeTextStyle]}>{userData.selectedSong.name}</Text>
                <Text style={[styles.info, themeTextStyle]}>{getArtistNames(userData.selectedSong)}</Text>
                </View>
            ) : (
                <Text style={[styles.info, themeTextStyle]}>No song selected.</Text>
            )}
            
            <FollowButton followUserId={userId} />
            <TouchableOpacity 
            style={styles.favouritesButton} 
            onPress={() => router.push({
                pathname: '/favouritesList', 
                params: { userId: userId }
            })}
            >
                <Ionicons 
                  name="heart" 
                  size={36} 
                  color={isLightScheme ? 'black': 'white'}
                />
                <Text style={[styles.info, themeTextStyle]}>Favourites</Text> 
            </TouchableOpacity>
        </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        position: 'absolute',
        top: 20, 
        left: 20,
        zIndex: 1, // Ensure the button appears on top
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    errorText: { 
        fontSize: 18,
    },
    songContainer: {
        alignItems: 'center',
    },
    albumImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
    },
    followButton: {

    },
    favouritesButton: {
        alignItems: 'center',
        marginTop: 20,
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