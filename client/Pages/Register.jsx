import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import React, { useContext, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ContextPage } from '../Context/ContextProvider';
import { Button, TextInput, HelperText } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Register(props) {

    const { email, setEmail, phone, setPhone, userName, setUserName, password, setPassword, confirm, setConfirm, addUser, checkEmail, checkUsername } = useContext(ContextPage);
    
      const [camera, setCamera] = useState();
      const [type, setType] = useState(CameraType.back);
      const [imgSrc, setImgSrc] = useState('');
      const [permission, requestPermission] = Camera.useCameraPermissions();
      const [showCamera, setShowCamera] = useState(false);
      const [isPasswordVisible, setIsPasswordVisible] = useState(false);
      const [isVerifyVisible, setIsVerifyVisible] = useState(false);
      const [pressed, setPressed] = useState(false);

      const handlePressIn = () => {
        setPressed(true);
      };
    
      const handlePressOut = () => {
        setPressed(false);
      };

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
  
    const takePicture = () => {
      if (camera) {
        camera.takePictureAsync({ onPictureSaved: onPictureSaved });
      }
    };
  
    const onPictureSaved = photo => {
      setImgSrc(photo.uri);
      console.log(imgSrc);
      setShowCamera(false);
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
    });
      if (!result.canceled) {
        setImgSrc(result.assets[0].uri);
    }
  };

    const handleRegister = async() => {
      const user = {
          email: email,
          phone: phone,
          username: userName,
          image: imgSrc,
          password: password,
          verify: confirm,
      };

      let isEmailOccupied = await checkEmail(email);
      let isUsernameOccupied = await checkUsername(userName);

      if (email && phone && userName && imgSrc && password && confirm) {
        
        if (isEmailOccupied) {
          alert(`Email is already in use. \nPlease choose a different email.`);
          isEmailOccupied = false;
        } else if (isUsernameOccupied) {
          alert(`Username is already occupied. \nPlease choose a different username`);
          isUsernameOccupied = false;
        }
        else {
          if (password === confirm) {  
            addUser(user);
            props.navigation.navigate("Login");
          } else { 
            alert(`Password and verify do not match. \nPlease re-enter your password.`);
          }
        }

      } else {
        alert('Invalid Error')
      }

       isEmailOccupied = await checkEmail(email);
       isUsernameOccupied = await checkUsername(userName);  
    };

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
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
       <View style={styles.iconCon}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
          </View>
          <TouchableOpacity>
              <Text style={styles.reg} onPress={() => props.navigation.navigate("BusinessRegistration")}>Business owner? Click here</Text>
          </TouchableOpacity>
          <View style={styles.inputCon}>
          <TextInput
              style={styles.outlinedInput}
              mode="outlined"  
              label="Email"
              inputMode='email'
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"  
              label="Phone"
              inputMode='tel'
              onChangeText={setPhone}
              value={phone}
            />
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"  
              label="Username"
              onChangeText={setUserName}
              value={userName}
            />
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={handleAddImage}><MaterialIcons style={styles.imgBtn} name="add-a-photo" /></TouchableOpacity>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
            </View>
            {imgSrc && <Image source={{ uri: imgSrc }} style={{ width: 100, height: 100, alignSelf:'center' }} />}
            <TextInput style={styles.outlinedInput}   
              mode="outlined"        
              label="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
              right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>}
            />
            <TextInput style={styles.outlinedInput} 
              mode="outlined"
              label="Verify"
              secureTextEntry={!isVerifyVisible}
              onChangeText={setConfirm}
              value={confirm} 
              right={<TextInput.Icon icon={isVerifyVisible ? 'eye-off' : 'eye'} onPress={() => setIsVerifyVisible(!isVerifyVisible)}/>}

            />
            <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleRegister}>
              <Button style={styles.btn} mode={pressed ? 'outlined' : 'contained'}><Text style={{fontFamily: 'eb-garamond', fontSize: 18}}>Sign Up</Text></Button>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.bottomCon}>
            <TouchableOpacity>
              <Text style={styles.reg} onPress={() => props.navigation.navigate("Login")}>
                Already Have An Account? Sign In
              </Text>
            </TouchableOpacity>
          </View> 
      </ScrollView> )}
      </View>
  )
}


const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      // backgroundColor: "#94B285",
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
    outlinedInput: {
      margin: 5,
      width: "75%",
      alignSelf: 'center',
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
    text: {
      alignSelf: "center",
      fontSize: 18,
      fontFamily: 'eb-garamond',
      fontWeight: 500,
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
    bottomCon: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    reg: {
      alignSelf: "center",
      fontSize: 20,
      fontFamily: 'eb-garamond',
      margin: 10,
    },
  });
