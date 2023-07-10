import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ContextPage } from '../Context/ContextProvider';

export default function BusinessRegistration(props) {

    let { foodTypes, LoadFoodTypes, emailB, setEmailB, phoneB, setPhoneB, nameB, setNameB, address, setAddress, city, setCity, foodTypeB, setFoodTypeB, imgB, setImgB, 
        passwordB, setPasswordB, confirmB, setConfirmB, availableSeats, setAvailableSeats, inside, setInside, outside, setOutside, bar, setBar, checkEmailBusiness, addRestaurant } = useContext(ContextPage);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [foodListVisible, setFoodListVisible] = useState(false);
    const [isVerifyVisible, setIsVerifyVisible] = useState(false);

    const cities = require('../utils/cities.json');

    useEffect(() => {
      LoadFoodTypes();
    }, []);

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
            },
            password: passwordB,
            verify: confirmB        
        }

        let isEmailOccupied = await checkEmailBusiness(emailB);

        if (emailB && phoneB && nameB && city && address && foodTypeB && imgB && availableSeats && inside && outside && bar && passwordB && confirmB) {
            if (isEmailOccupied) {
                alert(`Email is already in use. \nPlease choose a different email.`);
                isEmailOccupied = false;
            }
            else {
              if (passwordB === confirmB) {  
                addRestaurant(business);
                props.navigation.navigate("Login");
              } else { 
                alert(`Password and verify do not match. \nPlease re-enter your password.`);
              }
            }
        } else {
            alert('Invalid Error');
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
              inputMode='email'
              onChangeText={setEmailB}
              value={emailB}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              inputMode='tel'
              onChangeText={setPhoneB}
              value={phoneB}
            />
             <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <TextInput
              style={styles.input2}
              placeholder="Name"
              onChangeText={setNameB}
              value={nameB}
            />
          <TouchableOpacity style={styles.input2} onPress={() => setFoodListVisible(true)}>
            <Text style={{marginTop: 8}}>{foodTypeB || "Food Type"}</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={foodListVisible}
            onRequestClose={() => setFoodListVisible(false)}
          >
            <View style={styles.modal}>
              {foodTypes.map((item) => (
                <TouchableOpacity style={styles.modalTO}
                  key={item._id}
                  onPress={() => {
                    setFoodTypeB(item.name);
                    setFoodListVisible(false);
                  }}
                >
                  <Text style={styles.modalItem}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <TextInput
              style={styles.input2}
              placeholder="Address"
              onChangeText={setAddress}
              value={address}
            />
            <TextInput
              style={styles.input2}
              placeholder="City"
              onChangeText={setCity}
              value={city}
            />
            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
            </View>
            {imgB && <Image source={{ uri: imgB }} style={{ width: 100, height: 100, alignSelf:'center' }} />}

              <TextInput
              style={styles.input}
              placeholder="Available Seats"
              keyboardType='numeric'
              onChangeText={setAvailableSeats}
              value={availableSeats}
            />
            <View style={{flexDirection:'row', justifyContent:'center'}}>     
            <TextInput
              style={styles.input3}
              placeholder="Inside"
              keyboardType='numeric'
              onChangeText={setInside}
              value={inside}
            />
            <TextInput
              style={styles.input3}
              placeholder="Outside"
              keyboardType='numeric'
              onChangeText={setOutside}
              value={outside}
            />
            <TextInput
              style={styles.input3}
              placeholder="Bar"
              keyboardType='numeric'
              onChangeText={setBar}
              value={bar}
            />
          </View>

            <View style={{flexDirection:'row', justifyContent:'center'}}> 
             <View style={styles.input2}>
            <TextInput  style={{top:5}}           
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPasswordB}
              value={passwordB}
            />
            <TouchableOpacity style={{ position: 'absolute', top: '25%', right: 10 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <MaterialIcons name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={25} color="#A0A0A0" />
            </TouchableOpacity>
            </View>
            <View style={styles.input2}>
            <TextInput style={{top:5}} 
              placeholder="Verify"
              secureTextEntry={!isVerifyVisible}
              onChangeText={setConfirmB}
              value={confirmB}
            />
            <TouchableOpacity style={{ position: 'absolute', top: '25%', right: 10 }} onPress={() => setIsVerifyVisible(!isVerifyVisible)}>
              <MaterialIcons name={isVerifyVisible ? 'visibility-off' : 'visibility'} size={25} color="#A0A0A0" />
            </TouchableOpacity>
            </View>
             </View> 
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
    input2: {
        height: 50,
        width: "40%",
        alignSelf: "center",
        borderColor: "#B0B0B0",
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },
    input3: {
      height: 50,
      width: "25%",
      alignSelf: "center",
      borderColor: "#B0B0B0",
      borderWidth: 1,
      margin: 10,
      padding: 5,
  },
  modal: {
    flex: 0.7,
    width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: "50%",
  },
  modalTO: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  modalItem: {
    fontSize: 14,
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
      width: "85%",
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
