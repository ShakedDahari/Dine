import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


export default function Contact() {

    const appLocation = { latitude: 32.34115642971186, longitude: 34.913690117604546 };
    const appEmail = "dineintimeapp@gmail.com";
    const appPhone = "052-3681396";

    const whatsappURL = `https://api.whatsapp.com/send?phone=${appPhone}`; 
    const instagramURL = 'https://www.instagram.com/shaked_dahari'; 
    const linkedinURL = 'https://www.linkedin.com/in/shaked-dahari';
    const githubURL = 'https://github.com/ShakedDahari'; 
      
    const handleSocialMediaLink = async (url) => {
      const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Cannot open URL: " + url);
        }
    };
    
    const handleCall = (phoneNumber) => {
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.canOpenURL(phoneUrl)
          .then((supported) => {
            if (!supported) {
              console.log(`Phone call not supported for number: ${phoneNumber}`);
            } else {
              return Linking.openURL(phoneUrl);
            }
          })
          .catch((error) => console.error('Error opening phone app:', error));
      };  
      
      const handleEmail = (emailAddress) => {
        const emailUrl = `mailto:${emailAddress}`;
        Linking.canOpenURL(emailUrl)
          .then((supported) => {
            if (!supported) {
              console.log(`Email not supported for address: ${emailAddress}`);
            } else {
              return Linking.openURL(emailUrl);
            }
          })
          .catch((error) => console.error('Error opening email app:', error));
      };

  return (
    <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
            <View style={styles.iconCon}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
            </View>
            <View style={styles.topCon}>
                <Text style={styles.header}>Get In Touch With Us !</Text>
                <TouchableOpacity onPress={() => handleEmail(appEmail)} style={styles.block}> 
                    <MaterialIcons name={'mail'} style={styles.material} />
                    <Text style={styles.heading}>Email</Text>
                    <Text style={styles.info}>{appEmail}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCall(appPhone)} style={styles.block}> 
                    <MaterialIcons name={'call'} style={styles.material} />
                    <Text style={styles.heading}>Phone</Text>
                    <Text style={styles.info}>{appPhone}</Text>
                </TouchableOpacity>
                <MapView
                    style={{ width: '80%', height: 200, margin: 15, padding: 15 }}
                    initialRegion={{
                        latitude: appLocation.latitude,
                        longitude: appLocation.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.022,
                    }}>
                    <Marker
                        coordinate={appLocation}
                        title={"DineInTime"}
                    />
                </MapView>
                <Text style={styles.header}>Connect With Us</Text>
                <View style={styles.social}>
                <TouchableOpacity onPress={() => handleSocialMediaLink(whatsappURL)} >
                <Ionicons name="logo-whatsapp" style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSocialMediaLink(instagramURL)} >
                    <Ionicons name="logo-instagram" style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSocialMediaLink(linkedinURL)} >
                    <Ionicons name="logo-linkedin" style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSocialMediaLink(githubURL)} >
                    <Ionicons name="logo-github" style={styles.socialIcon} />
                </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    iconCon: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    icon: {
      width: 100,
      height: 100,
      alignSelf: "center",
    },
    topCon: {
        alignItems: 'center',
        alignContent: 'center',
    },
    text: {
        alignSelf: "center",
        fontSize: 18,
        fontFamily: 'eb-garamond',
        fontWeight: 500,
    },
    header: {
        fontSize: 30,
        fontWeight: 400,
        fontFamily: 'eb-garamond-italic',
        margin: 20,
    },
    block: {
        flexDirection: 'column', 
        margin: 15,
        padding: 15,
        backgroundColor: '#D9D9D9',
        width: '80%',
        borderRadius: 10,
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
    },
      info: {
        fontSize: 20,
        fontFamily: 'eb-garamond',
        alignSelf: 'center',
    },
    material: {
        fontSize: 50,
        alignSelf: 'center',
        padding: 10,
        color: "#90b2ac",
    },
    social: {
        flexDirection: 'row',
    },
    socialIcon: {
        color: "#90b2ac",
        fontSize: 50,
        margin: 10,
    },
});