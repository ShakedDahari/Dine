import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ContextPage } from '../Context/ContextProvider';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

export default function BusinessRegistration(props) {

    let { emailB, setEmailB, phoneB, setPhoneB, nameB, setNameB, address, setAddress, city, setCity, foodTypeB, setFoodTypeB,
        imgB, setImgB, availableSeats, setAvailableSeats, inside, setInside, outside, setOutside, bar, setBar, checkEmailBusiness, addRestaurant } = useContext(ContextPage);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
      });
        if (!result.canceled) {
          setImgB(result.assets[0].uri);
      }
    };

    const handleSend = async () => {
        const business = {
            email: emailB,
            phone: phoneB,
            name: nameB, 
            location: city, 
            address: address,
            foodType: foodTypeB, 
            image: imgB,
            availableSeats: parseInt(availableSeats), 
            locationSeats : {
                inside: parseInt(inside),
                outside: parseInt(outside),
                bar: parseInt(bar) 
            }         
        }

        let isEmailOccupied = await checkEmailBusiness(emailB);

        if (emailB && phoneB && nameB && city && address && foodTypeB && imgB && availableSeats && inside && outside && bar) {
            if (isEmailOccupied) {
                alert(`Email is already in use. \nPlease choose a different email.`);
                isEmailOccupied = false;
            }
            else {
                addRestaurant(business);
            }
        }

    };
  

  return (
    <View style={styles.container}>
       <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
       <View style={styles.iconCon}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
          </View>
          <View style={styles.inputCon}>
          <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmailB}
              value={emailB}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              onChangeText={setPhoneB}
              value={phoneB}
            />
            <TextInput
              style={styles.input}
              placeholder="Restaurant Name"
              onChangeText={setNameB}
              value={nameB}
            />
            <TextInput
              style={styles.input}
              placeholder="Food Type"
              onChangeText={setFoodTypeB}
              value={foodTypeB}
            />
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
            </View>
            {imgB && <Image source={{ uri: imgB }} style={{ width: 100, height: 100, alignSelf:'center' }} />}

            <TextInput
              style={styles.input}
              placeholder="Address"
              onChangeText={setAddress}
              value={address}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              onChangeText={setCity}
              value={city}
            />
            <TextInput
              style={styles.input}
              placeholder="Available Seats"
              onChangeText={setAvailableSeats}
              value={availableSeats}
            />
     
            <TextInput
              style={styles.input}
              placeholder="Inside Seats"
              onChangeText={setInside}
              value={inside}
            />
            <TextInput
              style={styles.input}
              placeholder="Outside Seats"
              onChangeText={setOutside}
              value={outside}
            />
            <TextInput
              style={styles.input}
              placeholder="Bar Seats"
              onChangeText={setBar}
              value={bar}
            />
        

            {/* <View style={{flexDirection:'row', justifyContent:'center'}}> 
             <View style={styles.pass}>
            <TextInput  style={{top:5}}           
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity style={{ position: 'absolute', top: '25%', right: 10 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <MaterialIcons name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={25} color="#A0A0A0" />
            </TouchableOpacity>
            </View>
            <View style={styles.pass}>
            <TextInput style={{top:5}} 
              placeholder="Verify"
              secureTextEntry={!isVerifyVisible}
              onChangeText={setConfirm}
              value={confirm}
            />
            <TouchableOpacity style={{ position: 'absolute', top: '25%', right: 10 }} onPress={() => setIsVerifyVisible(!isVerifyVisible)}>
              <MaterialIcons name={isVerifyVisible ? 'visibility-off' : 'visibility'} size={25} color="#A0A0A0" />
            </TouchableOpacity>
            </View>
            {/* </View>  */}
            <TouchableOpacity style={styles.btn} onPress={handleSend}>
              <Text style={styles.title}>Send</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      backgroundColor: "#94B285",
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
    inputCon: {
      flex: 1,
      backgroundColor: "#D9D9D9",
      borderRadius: 30,
      margin: 30,
      padding: 20,
      marginTop: 10,
      marginBottom: 0,
      height: '100%',
      justifyContent: "center",
    },
    input: {
      height: 50,
      width: "85%",
      alignSelf: "center",
      borderColor: "#B0B0B0",
      borderWidth: 1,
      margin: 10,
      padding: 5,
    },
    pass: {
        height: 50,
        width: "40%",
        alignSelf: "center",
        borderColor: "#B0B0B0",
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },
    imgBtn: {
      fontSize: 50,
      alignSelf: "center",
      borderColor: "#B0B0B0",
      borderWidth: 1,
      margin: 10,
      padding: 5,
    },
    text: {
      alignSelf: "center",
      color: "#D9D9D9",
      fontSize: 30,
      fontFamily: "sans-serif-condensed",
      fontWeight: 700,
    },
    btn: {
      height: 50,
      alignSelf: "center",
      justifyContent: "center",
      width: "75%",
      backgroundColor: "#B0B0B0",
      borderColor: "#838383",
      borderWidth: 3,
      margin: 10,
    },
    title: {
      alignSelf: "center",
      fontSize: 20,
    },
  });
