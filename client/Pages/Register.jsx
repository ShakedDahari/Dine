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

    const { isValidEmail, isValidPhone, isValidUsername, isValidPassword, email, setEmail, phone, setPhone, 
      userName, setUserName, password, setPassword, confirm, setConfirm, addUser, checkEmail, checkUsername, checkEmailBusiness } = useContext(ContextPage);
    
      const [camera, setCamera] = useState();
      const [type, setType] = useState(CameraType.back);
      const [imgSrc, setImgSrc] = useState('');
      const [permission, requestPermission] = Camera.useCameraPermissions();
      const [showCamera, setShowCamera] = useState(false);
      const [isPasswordVisible, setIsPasswordVisible] = useState(false);
      const [isVerifyVisible, setIsVerifyVisible] = useState(false);
      const [pressed, setPressed] = useState(false);
      const [emailHelper, setEmailHelper] = useState(false);
      const [isEmailOccupied, setIsEmailOccupied] = useState(false);
      const [isUsernameOccupied, setIsUsernameOccupied] = useState(false);
      const [phoneHelper, setPhoneHelper] = useState(false);
      const [usernameHelper, setUsernameHelper] = useState(false);
      const [passwordHelper, setPasswordHelper] = useState(false);
      const [confirmHelper, setConfirmHelper] = useState(false);

      const [isLengthValid, setIsLengthValid] = useState(true);
      const [hasUppercase, setHasUppercase] = useState(true);
      const [hasLowercase, setHasLowercase] = useState(true);
      const [hasDigit, setHasDigit] = useState(true);

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
    });
      if (!result.canceled) {
        setImgSrc(result.assets[0].uri);
        //uploadImage(result.assets[0].uri);
    }
  };


  const checkInputsValidation = async() => {

    let emailOccupied = await checkEmail(email);
    let usernameOccupied = await checkUsername(userName);
  
    if (emailOccupied) {
      setIsEmailOccupied(true);
      setEmail('');
    } else {
      setIsEmailOccupied(false);
    }
  
    if (usernameOccupied) {
      setIsUsernameOccupied(true);
      setUserName('');
    } else {
      setIsUsernameOccupied(false);
    }
  
    if (!isValidEmail(email)) {
      setEmailHelper(true);
      setEmail('');
    } else {
      setEmailHelper(false);
    }
  
    if (!isValidPhone(phone)) {
      setPhoneHelper(true);
      setPhone('');
    } else {
      setPhoneHelper(false);
    }
  
    if (!isValidUsername(userName)) {
      setUsernameHelper(true);
      setUserName('');
    } else {
      setUsernameHelper(false);
    }

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

  }

    const handleRegister = async() => {

      await checkInputsValidation();

      const user = {
          email: email,
          phone: phone,
          username: userName,
          image: imgSrc,
          password: password,
          verify: confirm,
      };


      if (email && phone && userName && imgSrc && password && confirm && !isEmailOccupied && !isUsernameOccupied && 
        !emailHelper && !phoneHelper && !usernameHelper && !passwordHelper && !confirmHelper) {
        
          addUser(user);
          props.navigation.navigate("Login");
      }
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
            <HelperText style={styles.helperText} type="error" visible={emailHelper || isEmailOccupied}>
              {emailHelper && 'Invalid email address'}
              {isEmailOccupied && 'Email is already registered'}
            </HelperText>
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"  
              label="Phone"
              inputMode='tel'
              onChangeText={setPhone}
              value={phone}
            />
            <HelperText style={styles.helperText} type="error" visible={phoneHelper}>
              Invalid phone number
            </HelperText>
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"  
              label="Username"
              onChangeText={setUserName}
              value={userName}
            />
            <HelperText style={styles.helperText} type="error" visible={usernameHelper || isUsernameOccupied}>
              {usernameHelper && 'Invalid username'}
              {isUsernameOccupied && 'Username is already occupied'}
            </HelperText>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={handleAddImage}><MaterialIcons style={styles.imgBtn} name="add-a-photo" /></TouchableOpacity>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
              {imgSrc && <Image source={{ uri: imgSrc }} style={{ margin: 10, padding: 5, width: 65, height: 65, alignSelf:'center' }} />}
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
      marginBottom: 0, 
      width: "75%",
      alignSelf: 'center',
    },
    helperText: {
      marginTop: -5,
      width: "80%",
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
