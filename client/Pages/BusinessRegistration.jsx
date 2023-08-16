import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ContextPage } from '../Context/ContextProvider';
import { Button, TextInput, HelperText } from 'react-native-paper';

export default function BusinessRegistration(props) {

    let { isValidEmail, isValidPhone, isValidUsername, isValidPassword, isValidNumbers, foodTypes, LoadFoodTypes, emailB, setEmailB, phoneB, setPhoneB, nameB, setNameB, address, setAddress, city, setCity, foodTypeB, setFoodTypeB, imgB, setImgB, 
        passwordB, setPasswordB, confirmB, setConfirmB, availableSeats, setAvailableSeats, inside, setInside, outside, setOutside, bar, setBar, checkEmailBusiness, addRestaurant, checkEmail } = useContext(ContextPage);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [foodListVisible, setFoodListVisible] = useState(false);
    const [isVerifyVisible, setIsVerifyVisible] = useState(false);
    const [isCityListVisible, setIsCityListVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [pressed, setPressed] = useState(false);
    const [emailHelper, setEmailHelper] = useState(false);
    const [isEmailOccupied, setIsEmailOccupied] = useState(false);
    const [phoneHelper, setPhoneHelper] = useState(false);
    const [nameHelper, setNameHelper] = useState(false);
    const [addressHelper, setAddressHelper] = useState(false);
    const [availableSeatsHelper, setAvailableSeatsHelper] = useState(false);
    const [insideHelper, setInsideHelper] = useState(false);
    const [outsideHelper, setOutsideHelper] = useState(false);
    const [barHelper, setBarHelper] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState(false);
    const [confirmHelper, setConfirmHelper] = useState(false);
    const [isLengthValid, setIsLengthValid] = useState(true);
    const [hasUppercase, setHasUppercase] = useState(true);
    const [hasLowercase, setHasLowercase] = useState(true);
    const [hasDigit, setHasDigit] = useState(true);

    useEffect(() => {
      LoadFoodTypes();
    }, []);

    const sortedFoodTypes = [...foodTypes].sort((a, b) => a.name.localeCompare(b.name));

    const handlePressIn = () => {
      setPressed(true);
    };
  
    const handlePressOut = () => {
      setPressed(false);
    };  

    const cities = require('../utils/cities.json');

    const handleSearch = (query) => {
      setSearchQuery(query);
  
      // Filter the cities based on the search query
      const filtered = cities.filter((city) =>
        city.english_name.toLowerCase().startsWith(query.toLowerCase())  ||
        city.english_name.toLowerCase().includes(query.toLowerCase()) // In case that startsWith not found --> use includes
      );

      // Display the top 5 relevant matches
      const topMatches = filtered.slice(0, 5);
      setFilteredCities(topMatches);
    };


    const handleSelectCity = (selectedCity) => {
      setCity(selectedCity);
      setSearchQuery(selectedCity);
      setIsCityListVisible(false);
    };
  
    const renderItem = ({ item, index }) => (
      <TouchableOpacity style={styles.cityItem} onPress={() => handleSelectCity(item.english_name)}>
        <Text style={styles.cityName}>{item.english_name}</Text>
      </TouchableOpacity>
    );  


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
      });
        if (!result.canceled) {
          setImgB(result.assets[0].uri);
      }
    };

    const checkInputsValidation = async() => {

      let emailOccupied = await checkEmailBusiness(emailB);

      if (emailOccupied) {
        setIsEmailOccupied(true);
        setEmailB('');
      } else {
        setIsEmailOccupied(false);
      }
    
      if (!isValidEmail(emailB)) {
        setEmailHelper(true);
        setEmailB('');
      } else {
        setEmailHelper(false);
      }
  
      if (!isValidPhone(phoneB)) {
        setPhoneHelper(true);
        setPhoneB('');
      } else {
        setPhoneHelper(false);
      }

      if (!isValidUsername(nameB)) {
        setNameHelper(true);
        setNameB('');
      } else {
        setNameHelper(false);
      }

      if (!isValidUsername(address)) {
        setAddressHelper(true);
        setAddress('');
      } else {
        setAddressHelper(false);
      }

      if (!isValidNumbers(availableSeats)) {
        setAvailableSeatsHelper(true);
        setAvailableSeats('');
      } else {
        setAvailableSeatsHelper(false);
      }

      if (!isValidNumbers(inside)) {
        setInsideHelper(true);
        setInside('');
      } else {
        setInsideHelper(false);
      }

      if (!isValidNumbers(outside)) {
        setOutsideHelper(true);
        setOutside('');
      } else {
        setOutsideHelper(false);
      }
      
      if (!isValidNumbers(bar)) {
        setBarHelper(true);
        setBar('');
      } else {
        setBarHelper(false);
      }
  
      if (!isValidPassword(passwordB)) {
        if (passwordB !== undefined) {
          setIsLengthValid(passwordB.length >= 6);
        } else {
          setIsLengthValid(false);
        }
        setHasUppercase(/[A-Z]/.test(passwordB));
        setHasLowercase(/[a-z]/.test(passwordB));
        setHasDigit(/[0-9]/.test(passwordB));
        setPasswordHelper(true);
        setPasswordB('');
        setConfirmB('');
      } else {
        setPasswordHelper(false);
      }
  
      if (passwordB !== confirmB) {
        setConfirmHelper(true);
        setConfirmB('');
      } else {
        setConfirmHelper(false);
      }
      
    }


    const handleSend = async () => {

      await checkInputsValidation();

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

        

        if (emailB && phoneB && nameB && city && address && foodTypeB && imgB && availableSeats && inside && outside && bar && passwordB && confirmB &&
        !emailHelper && !phoneHelper && !nameHelper && !addressHelper && !availableSeatsHelper && !insideHelper && !outsideHelper && !passwordHelper && !confirmHelper) {
            addRestaurant(business);
            props.navigation.navigate("Login");
        }
    };
  

  return (
    <View style={styles.container}>
       <ScrollView keyboardShouldPersistTaps="handled" overScrollMode='never' style={{ flex: 1 }}>
       <View style={styles.iconCon}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
          </View>
          <View style={styles.inputCon}>
          <TextInput
              style={styles.outlinedInput1}
              mode="outlined"  
              label="Email"
              inputMode='email'
              onChangeText={setEmailB}
              value={emailB}
            />
            <HelperText style={styles.helperText1} type="error" visible={emailHelper || isEmailOccupied}>
              {emailHelper && 'Invalid email address'}
              {isEmailOccupied && 'Email is already registered'}
            </HelperText>
            <TextInput
              style={styles.outlinedInput1}
              mode="outlined"
              label="Phone"
              inputMode='tel'
              onChangeText={setPhoneB}
              value={phoneB}
            />
            <HelperText style={styles.helperText1} type="error" visible={phoneHelper}>
              Invalid phone number
            </HelperText>
             <View style={{flexDirection:'row', justifyContent:'center'}}> 
             <View style={{flexDirection:'column', width: '45%'}}>
              <TextInput
                style={styles.outlinedInput1}
                mode="outlined"
                label="Name"
                onChangeText={setNameB}
                value={nameB}
              />
              <HelperText style={styles.helperText1} type="error" visible={nameHelper}>
                Invalid name
              </HelperText>
              </View>
              <View style={{flexDirection:'column', width: '45%'}}>
          <TouchableOpacity style={styles.outlinedInput} onPress={() => setFoodListVisible(true)}>
            <Text style={{ fontSize: 12, color: '#1C1B1F', margin: 15}}>{foodTypeB || "Food Type"}</Text>
          </TouchableOpacity>
            <HelperText style={styles.helperText2} type="error" visible={foodTypeB}>
              Select food type
            </HelperText>
            </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={foodListVisible}
            onRequestClose={() => setFoodListVisible(false)}
          >
            <View style={styles.modal}>
              {sortedFoodTypes.map((item) => (
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
            <TextInput
              style={styles.outlinedInput1}
              mode="outlined"
              label="Address"
              onChangeText={setAddress}
              value={address}
            />
            <HelperText style={styles.helperText1} type="error" visible={addressHelper}>
              Invalid address
            </HelperText>
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              mode="outlined"
              label="City"
              style={styles.outlinedInput1}
              onFocus={() => setIsCityListVisible(true)}
              onMagicTap={() => setIsCityListVisible(false)}
            />
              <HelperText style={styles.helperText1} type="error" visible={city}>
                Select city
              </HelperText>
            <View>
              {isCityListVisible && (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: "column" }}
                  data={filteredCities}
                  renderItem={renderItem}
                  keyExtractor={(_, index) => index.toString()}
                  style={styles.cityList}
                />
              )}
            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
            </View>
            <HelperText style={styles.helperText1} type="error" visible={imgB ? false : true}>
                Select image
            </HelperText>
            {imgB && <Image source={{ uri: imgB }} style={{ width: 100, height: 100, alignSelf:'center' }} />}

            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <View style={{flexDirection:'column', width: '45%'}}>  
              <TextInput
              style={styles.outlinedInput1}
              mode="outlined"
              label="Available Seats"
              keyboardType='numeric'
              onChangeText={setAvailableSeats}
              value={availableSeats}
            />
            <HelperText style={styles.helperText2} type="error" visible={availableSeatsHelper}>
              Invalid number
            </HelperText>
            </View>  
            <View style={{flexDirection:'column', width: '45%'}}>
            <TextInput
              style={styles.outlinedInput1}
              mode="outlined"
              label="Inside"
              keyboardType='numeric'
              onChangeText={setInside}
              value={inside}
            />
            <HelperText style={styles.helperText1} type="error" visible={insideHelper}>
              Invalid number
            </HelperText>
            </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <View style={{flexDirection:'column', width: '45%'}}> 
            <TextInput
              style={styles.outlinedInput1}
              mode="outlined"
              label="Outside"
              keyboardType='numeric'
              onChangeText={setOutside}
              value={outside}
            />
            <HelperText style={styles.helperText1} type="error" visible={outsideHelper}>
              Invalid number
            </HelperText>
            </View>
            <View style={{flexDirection:'column', width: '45%'}}> 
            <TextInput
              style={styles.outlinedInput1}
              mode="outlined"
              label="Bar"
              keyboardType='numeric'
              onChangeText={setBar}
              value={bar}
            />
            <HelperText style={styles.helperText1} type="error" visible={barHelper}>
              Invalid number
            </HelperText>
            </View>
          </View>

            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <View style={{flexDirection:'column', width: '45%'}}> 
            <TextInput    
              style={styles.outlinedInput1}
              mode="outlined"       
              label="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPasswordB}
              value={passwordB}
              right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>}
            />
            <HelperText style={styles.helperText1} type="error" visible={passwordHelper}>
              Password must have
              {!isLengthValid && '\n*At least 6 characters'}
              {!hasUppercase && '\n*At least 1 uppercase letter'}
              {!hasLowercase && '\n*At least 1 lowercase letter'}
              {!hasDigit && '\n*At least 1 digit'}
            </HelperText>
            </View>
            <View style={{flexDirection:'column', width: '45%'}}> 
            <TextInput style={styles.outlinedInput1}
              mode="outlined"
              label="Verify"
              secureTextEntry={!isVerifyVisible}
              onChangeText={setConfirmB}
              value={confirmB}
              right={<TextInput.Icon icon={isVerifyVisible ? 'eye-off' : 'eye'} onPress={() => setIsVerifyVisible(!isVerifyVisible)}/>}
            />
            <HelperText style={styles.helperText2} type="error" visible={confirmHelper}>
              Password and verify do not match
            </HelperText>
            </View>
            </View>
            <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleSend}>
              <Button style={styles.btn} mode={pressed ? 'outlined' : 'contained'}><Text style={{fontFamily: 'eb-garamond', fontSize: 18}}>Send</Text></Button>
            </TouchableWithoutFeedback>
          </View>
            <TouchableOpacity>
              <Text style={styles.check} onPress={() => props.navigation.navigate("Login")}>
                Already Have An Account? Sign In
              </Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      //backgroundColor: "#94B285",
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
    outlinedInput: {
      width: "90%",
      backgroundColor: 'white',
      height: 50,
      borderRadius: 5,
      justifyContent: 'center',
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 6,
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
    outlinedInput1: {
      // margin: 5,
      width: "90%",
      alignSelf: 'center',
      fontSize: 12,
    },
    helperText1: {
      marginTop: -5,
      width: "90%",
      alignSelf: 'center',        
    },
    outlinedInput2: {
    // margin: 5,
    width: "45%",
    alignSelf: 'center',
    fontSize: 12,
  },
    helperText2: {
      marginTop: -5,
      width: "90%",
      alignSelf: 'center',        
    },
  text: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: 'eb-garamond',
    fontWeight: 500,
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
    btn: {
      height: 50,
      alignSelf: "center",
      width: "75%",
      borderWidth: 2,
      margin: 10,
    },
    title: {
      alignSelf: "center",
      fontSize: 20,
    },
    cityList: {
      width: '50%',
      alignSelf: 'flex-end',
      borderRadius: 5,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    cityItem: {
      maxWidth: '100%',
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    cityName: {
      fontSize: 15,
    },
    check: {
      alignSelf: "center",
      fontSize: 20,
      fontFamily: 'eb-garamond',
      //margin: 10,
      marginBottom: 20,
    },
  });
