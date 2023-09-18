import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ContextPage } from '../Context/ContextProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, HelperText, Modal, TextInput } from 'react-native-paper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Profile() {

    const { isRestaurantOwner, loginUser, setLoginUser, isUploading, isValidPassword, isValidNumbers, setEmail, setPhone, imgSrc, setImgSrc, setUserName, password, setPassword, confirm, setConfirm, handleLocalImageUpload, editUser, setEmailB, setPhoneB,
         setNameB, setAddress, setFoodTypeB, passwordB, setPasswordB, confirmB, setConfirmB, availableSeats, setAvailableSeats, inside, setInside, outside, setOutside, bar, setBar, editRestaurant } = useContext(ContextPage);
    
    const [camera, setCamera] = useState();
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isVerifyVisible, setIsVerifyVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isEditRestaurantClose, setIsEditRestaurantClose] = useState(false);
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
    

    const handleEdit = () => {
        setEmail(loginUser.email);
        setPhone(loginUser.phone);
        setImgSrc(loginUser.image);
        setUserName(loginUser.username);
        setPassword(loginUser.password);
        setConfirm(loginUser.verify);
        setEditModalVisible(true);
    };
    
    const handleEditModalClose = () => {
        setEditModalVisible(false);
    };

    const handleEditRestaurant = () => {
        setEmailB(loginUser.email);
        setPhoneB(loginUser.phone);
        setNameB(loginUser.name);
        setAddress(loginUser.location);
        setFoodTypeB(loginUser.foodType);
        setImgSrc(loginUser.image);
        setAvailableSeats(loginUser.availableSeats.toString());
        setInside(loginUser.locationSeats?.inside.toString());
        setOutside(loginUser.locationSeats?.outside.toString());
        setBar(loginUser.locationSeats?.bar.toString());
        setPasswordB(loginUser.password);
        setConfirmB(loginUser.verify);
        setIsEditRestaurantClose(true);
    }

    const handleEditRestaurantClose = () => {
        setIsEditRestaurantClose(false);
    }

    const editProfile = async () => {
        await checkInputsValidation();

        const user = {
            _id: loginUser._id,
            email: loginUser.email,
            phone: loginUser.phone,
            username: loginUser.username,
            image: imgSrc,
            password: password,
            verify: confirm,
        };
  
  
        if (imgSrc && password && confirm && !passwordHelper && !confirmHelper) {
            await editUser(loginUser._id, imgSrc, password, confirm);
            handleEditModalClose();
            setLoginUser(user);  
        }
    };

    const editRestaurantProfile = async () => {
        await inputsValidationRestaurant();

        const business = {
            _id: loginUser._id,
            email: loginUser.email,
            phone: loginUser.phone,
            name: loginUser.name, 
            location: loginUser.location, 
            foodType: loginUser.foodType, 
            image: imgSrc,
            availableSeats: parseInt(availableSeats), 
            locationSeats : {
                inside: parseInt(inside),
                outside: parseInt(outside),
                bar: parseInt(bar) 
            },
            password: passwordB,
            verify: confirmB        
        } 

        if ( imgSrc && availableSeats && inside && outside && bar && passwordB && confirmB &&
            !availableSeatsHelper && !insideHelper && !outsideHelper && !passwordHelper && !confirmHelper) {
            
            await editRestaurant(loginUser._id, imgSrc, parseInt(availableSeats), parseInt(inside), parseInt(outside), parseInt(bar), passwordB, confirmB);
            handleEditRestaurantClose();
            setLoginUser(business);
        }
    }

    const handleAddImage = () => {
        setShowCamera(true);
      }
  
      const handleBack = () => {
        setShowCamera(false);
      }  

    if (!permission) {
        return <View />;
      }
    
      if (!permission.granted) {
        return (
          <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
            <Button mode="contained" style={styles.btn} onPress={requestPermission}>grant permission</Button>
          </View>
        );
      }
    
      function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
      }
    
      const takePicture = async () => {
        if (camera) {
          camera.takePictureAsync({ onPictureSaved: onPictureSaved });
        }
      };
      
      const onPictureSaved = async (photo) => {
        await handleLocalImageUpload(photo.uri);
        setShowCamera(false);
      }
  
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
      });
        if (!result.canceled) {
          await handleLocalImageUpload(result.assets[0].uri);
        }
    };
  

    const checkInputsValidation = async() => {

        if (!isValidPassword(password)) {
            if (password !== undefined) {
              setIsLengthValid(password.length >= 6);
            } else {
              setIsLengthValid(false);
            }
            setHasUppercase(/[A-Z]/.test(password));
            setHasLowercase(/[a-z]/.test(password));
            setHasDigit(/[0-9]/.test(password));
            setPasswordHelper(true);
            setPassword('');
            setConfirm('');
          } else {
            setPasswordHelper(false);
          }
      
          if (password !== confirm) {
            setConfirmHelper(true);
            setConfirm('');
          } else {
            setConfirmHelper(false);
          }
    };

    const inputsValidationRestaurant = async () => {

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

  return (
    <View style={styles.container}>
        {showCamera ? (<Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
       <TouchableOpacity onPress={toggleCameraType}>
         <MaterialIcons style={styles.btnCam} name="screen-rotation" />
       </TouchableOpacity>
       <TouchableOpacity onPress={takePicture}>
         <MaterialIcons style={styles.btnCam} name="camera" />
       </TouchableOpacity>
       <TouchableOpacity onPress={handleBack}>
         <MaterialIcons style={styles.btnCam} name="undo"/>
       </TouchableOpacity>
     </Camera> ) : (
         <ScrollView keyboardShouldPersistTaps="handled" overScrollMode='never' style={{ flex: 1 }}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
            <Image source={{ uri: loginUser.image }} style={styles.image} />
        {!isRestaurantOwner ? (
        <View>
            <Button icon="note-edit-outline" mode='outlined' style={styles.btn} onPress={handleEdit}>Edit Profile</Button>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR USERNAME</Text>
                <Text style={styles.font}>{loginUser.username}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR PHONE</Text>
                <Text style={styles.font}>{loginUser.phone}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR EMAIL</Text>
                <Text style={styles.font}>{loginUser.email}</Text>
                <View style={styles.divider} />
            </View>
        </View>
        ) : (
            <View>
            <Button icon="note-edit-outline" mode='outlined' style={styles.btn} onPress={handleEditRestaurant}>Edit Profile</Button>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR NAME</Text>
                <Text style={styles.font}>{loginUser.name}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR LOCATION</Text>
                <Text style={styles.font}>{loginUser.location}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR PHONE</Text>
                <Text style={styles.font}>{loginUser.phone}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR EMAIL</Text>
                <Text style={styles.font}>{loginUser.email}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR FOOD TYPE</Text>
                <Text style={styles.font}>{loginUser.foodType}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR AVAILABLE SEATS</Text>
                <Text style={styles.font}>{loginUser.availableSeats}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR INSIDE SEATS</Text>
                <Text style={styles.font}>{loginUser.locationSeats?.inside}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR OUTSIDE SEATS</Text>
                <Text style={styles.font}>{loginUser.locationSeats?.outside}</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>YOUR BAR SEATS</Text>
                <Text style={styles.font}>{loginUser.locationSeats?.bar}</Text>
                <View style={styles.divider} />
            </View>
            </View>
        )}
        <Modal visible={isEditModalVisible} 
            transparent={true} 
            animationType="slide"
            onDismiss={handleEditModalClose}>
            <View style={styles.modalContainer}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={handleAddImage}><MaterialIcons style={styles.imgBtn} name="add-a-photo" /></TouchableOpacity>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
              {isUploading ? (
                <ActivityIndicator size={50} color="#90b2ac" />
              ) : imgSrc ? (
                <Image source={{ uri: imgSrc }} style={{ margin: 10, padding: 5, width: 65, height: 65, alignSelf: 'center' }} />
              ) : null}
            </View>
              <HelperText style={styles.helperText} type="error" visible={imgSrc ? false : true}>
                Select image
              </HelperText>
            <TextInput style={styles.outlinedInput}   
              mode="outlined"        
              label="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
              right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>}
            />
            <HelperText style={styles.helperText} type="error" visible={passwordHelper}>
              Password must have
              {!isLengthValid && '\n*At least 6 characters'}
              {!hasUppercase && '\n*At least 1 uppercase letter'}
              {!hasLowercase && '\n*At least 1 lowercase letter'}
              {!hasDigit && '\n*At least 1 digit'}
            </HelperText>
            <TextInput style={styles.outlinedInput} 
              mode="outlined"
              label="Verify"
              secureTextEntry={!isVerifyVisible}
              onChangeText={setConfirm}
              value={confirm} 
              right={<TextInput.Icon icon={isVerifyVisible ? 'eye-off' : 'eye'} onPress={() => setIsVerifyVisible(!isVerifyVisible)}/>}
            />
            <HelperText style={styles.helperText} type="error" visible={confirmHelper}>
              Password and verify do not match
            </HelperText>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button icon="content-save" mode="outlined" style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={editProfile}>Save</Button>
                <Button mode="outlined" style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={handleEditModalClose}>Cancel</Button>
            </View>
            </View>
        </Modal>

        <Modal visible={isEditRestaurantClose} 
            transparent={true} 
            animationType="slide"
            onDismiss={handleEditRestaurantClose}>
            <View style={styles.modalContainer}>

            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
              {isUploading ? (
                <ActivityIndicator size={50} color="#90b2ac" />
              ) : imgSrc ? (
                <Image source={{ uri: imgSrc }} style={{ margin: 10, padding: 5, width: 65, height: 65, alignSelf: 'center' }} />
              ) : null}
            </View>
            <HelperText style={styles.helperText} type="error" visible={imgSrc ? false : true}>
                Select image
            </HelperText>

            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <View style={{flexDirection:'column', width: '48%'}}>  
              <TextInput
              style={styles.outlinedInput}
              mode="outlined"
              label="Seats"
              keyboardType='numeric'
              onChangeText={setAvailableSeats}
              value={availableSeats}
            />
            <HelperText style={styles.helperText} type="error" visible={availableSeatsHelper}>
              Invalid number
            </HelperText>
            </View>  
            <View style={{flexDirection:'column', width: '48%'}}>
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"
              label="Inside"
              keyboardType='numeric'
              onChangeText={setInside}
              value={inside}
            />
            <HelperText style={styles.helperText} type="error" visible={insideHelper}>
              Invalid number
            </HelperText>
            </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <View style={{flexDirection:'column', width: '48%'}}> 
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"
              label="Outside"
              keyboardType='numeric'
              onChangeText={setOutside}
              value={outside}
            />
            <HelperText style={styles.helperText} type="error" visible={outsideHelper}>
              Invalid number
            </HelperText>
            </View>
            <View style={{flexDirection:'column', width: '48%'}}> 
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"
              label="Bar"
              keyboardType='numeric'
              onChangeText={setBar}
              value={bar}
            />
            <HelperText style={styles.helperText} type="error" visible={barHelper}>
              Invalid number
            </HelperText>
            </View>
          </View>

            <View style={{flexDirection:'row', justifyContent:'center'}}> 
            <View style={{flexDirection:'column', width: '48%'}}> 
            <TextInput    
              style={styles.outlinedInput}
              mode="outlined"       
              label="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPasswordB}
              value={passwordB}
              right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>}
            />
            </View>
            <View style={{flexDirection:'column', width: '48%'}}> 
            <TextInput style={styles.outlinedInput}
              mode="outlined"
              label="Verify"
              secureTextEntry={!isVerifyVisible}
              onChangeText={setConfirmB}
              value={confirmB}
              right={<TextInput.Icon icon={isVerifyVisible ? 'eye-off' : 'eye'} onPress={() => setIsVerifyVisible(!isVerifyVisible)}/>}
            />
            </View>
            </View>
            <HelperText style={styles.helperText1} type="error" visible={passwordHelper || confirmHelper}>
              {passwordHelper && 'Password must have'}
              {passwordHelper && !isLengthValid && '\n*At least 6 characters'}
              {passwordHelper && !hasUppercase && '\n*At least 1 uppercase letter'}
              {passwordHelper && !hasLowercase && '\n*At least 1 lowercase letter'}
              {passwordHelper && !hasDigit && '\n*At least 1 digit'}
              {confirmHelper && '\nPassword and verify do not match'}
            </HelperText>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button icon="content-save" mode="outlined" style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={editRestaurantProfile}>Save</Button>
                <Button mode="outlined" style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={handleEditRestaurantClose}>Cancel</Button>
            </View>
            </View>
            </Modal>
        </ScrollView> )}
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    icon: {
      width: 100,
      height: 100,
      alignSelf: "center",
    },
    text: {
        alignSelf: "center",
        fontSize: 18,
        fontFamily: 'eb-garamond',
    },
    image: {
        marginVertical: 30,
        width: "50%",
        height: 200,
        alignSelf: 'center',
        borderRadius: 100,
    },
    font: {
        fontSize: 30,
        color: 'black',
        fontFamily: 'eb-garamond-italic',
    },
    section: {
        margin: 20,
      },
      sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'eb-garamond',
        color: 'gray',
      },
      divider: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginVertical: 10,
      },
      btn: {
        height: 50,
        alignSelf: "center",
        width: "50%",
        borderWidth: 2,
        borderColor: "#90b2ac",
        margin: 10,
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
        elevation: 15,
      },
      outlinedInput: {
        width: "90%",
        alignSelf: 'center',
      },
      imgBtn: {
        fontSize: 50,
        alignSelf: "center",
        borderColor: "#90b2ac",
        borderWidth: 1,
        margin: 10,
        padding: 5,
      },
      camera: {
        width: windowWidth-50, 
        height: windowHeight-50, 
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    btnCam: {
        fontSize: 50,
        height: 60,
        justifyContent: 'center',
        borderRadius: 30,
        padding: 5,
        margin: 10,
        backgroundColor: 'white',
    },
});