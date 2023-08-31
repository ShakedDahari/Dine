import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MD3LightTheme as DefaultTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { createTheme } from '@mui/material/styles';
import { Ionicons } from '@expo/vector-icons';

import Page1 from './Pages/Page1';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Order from './Pages/Order';
import Admin from './Pages/Admin';
import Charts from './Pages/Charts';
import BusinessRegistration from './Pages/BusinessRegistration';
import RestaurantDetails from './Pages/RestaurantDetails';
import Reservations from './Pages/Reservations';
import Reviews from './Pages/Reviews';
import Profile from './Pages/Profile';
import About from './Pages/About';
import Contact from './Pages/Contact';
import ContextProvider from './Context/ContextProvider';
import React, { useEffect } from 'react';

import { apiUrl } from './utils/api_url';
import { BackHandler, I18nManager } from 'react-native';

const theme =  createTheme({
  ...DefaultTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#90b2ac',
    secondary: '#aaccc6',
    tertiary: '#577287',
  },
});

const font = {
  "eb-garamond": require('./assets/EBGaramond-VariableFont_wght.ttf'),
  "eb-garamond-italic": require('./assets/EBGaramond-Italic-VariableFont_wght.ttf'),
}

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

I18nManager.allowRTL(false);


//creates the popup hamburger menu with the pages options
function MyDrawer() {
  return (            //startup page 
    <Drawer.Navigator initialRouteName="Login" 
    screenOptions={{
      drawerType: 'slide',
      drawerLabelStyle: {
        fontSize: 20,
      },
      drawerItemStyle: { 
        height: 70, 
        justifyContent: 'center',
     },
    }}>  
      <Drawer.Screen
          name="Login"                                                             //page title
          component={Login}                                                       //component = page element
          options={{ drawerItemStyle: { height: 0 }, headerShown: false}}        //sets menu label of page
      />
      <Drawer.Screen
        name="Register"
        component={Register}
        options={{ drawerItemStyle: { height: 0 }, headerShown: false }}
      />
       <Drawer.Screen
        name="Order"
        component={Order}
        options={{ drawerItemStyle: { height: 0 } }}
      />

       <Drawer.Screen
        name="Admin"
        component={Admin}
        options={{ drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="BusinessRegistration"
        component={BusinessRegistration}
        options={{ drawerItemStyle: { height: 0 }, headerShown: false  }}
      />
      <Drawer.Screen
        name="RestaurantDetails"
        component={RestaurantDetails}
        options={{ drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
          name="Home"                        
          component={Page1}                  
          options={{ drawerLabel: 'Home', drawerActiveTintColor: '#90b2ac', drawerIcon: ({ focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={30} color={'#90b2ac'} />) }} 
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ drawerLabel: 'Profile', drawerActiveTintColor: '#90b2ac', drawerIcon: ({ focused }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={30} color={'#90b2ac'} />)  }}
      />
      <Drawer.Screen
        name="Reservation"
        component={Home}
        options={{ drawerLabel: 'Reservation', drawerActiveTintColor: '#90b2ac', drawerIcon: ({ focused }) => (
          <Ionicons name={focused ? 'map' : 'map-outline'} size={30} color={'#90b2ac'} />) }} 
      />
      <Drawer.Screen
        name="Statistics"
        component={Charts}
        options={{ drawerLabel: 'Statistics', drawerActiveTintColor: '#90b2ac', drawerIcon: ({ focused }) => (
          <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={30} color={'#90b2ac'} />)  }}
      />
      <Drawer.Screen
          name="Contact"
          component={Contact}
          options={{ drawerLabel: 'Contact', drawerActiveTintColor: '#90b2ac', drawerIcon: ({ focused }) => (
            <Ionicons name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'} size={30} color={'#90b2ac'} />)  }}
        />
      <Drawer.Screen
        name="About"
        component={About}
        options={{ drawerLabel: 'About', drawerActiveTintColor: '#90b2ac', drawerIcon: ({ focused }) => (
          <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={30} color={'#90b2ac'} />)  }}
      />
    </Drawer.Navigator>
  );
}

const handleBackPress = (screenName, navigation) => {
  switch (screenName) {
    case 'Login':
      BackHandler.exitApp();
      return true;
    case 'Home':
      navigation.navigate('Login');
      return true;
    case 'Register':
      navigation.navigate('Login');
      return true;
    case 'BusinessRegistration':
      navigation.navigate('Register');
      return true;
    case 'Reservation':
      navigation.navigate('Home');
      return true;
    case 'Order':
      navigation.navigate('Reservation');
      return true;
    default:
      // For all other screens, use the default back behavior (navigate back)
      return false;
  }
};

const fetchApi = async() => {
  try {
    const res  = await fetch(`${apiUrl}/api/users`);
    const data = await res.json();
    if (data) {
      console.log("Api Success");
    }
  } catch (error) {
    console.log(error.message);
  }
}


export default function App() {

  const navigationRef = React.useRef();

  useEffect(() => {
    fetchApi();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Get the current active screen from the navigation state
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute) {
        const { name } = currentRoute;
        return handleBackPress(name, navigationRef.current);
      }
      return false;
    });

    return () => backHandler.remove();

  }, [])


  return (
    <PaperProvider theme={theme}>
    <ContextProvider>
    <NavigationContainer ref={navigationRef}>
      <MyDrawer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Page1} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Reservation" component={Home} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Statistics" component={Charts} />
        <Stack.Screen name="BusinessRegistration" component={BusinessRegistration} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
        <Stack.Screen name="Reservations" component={Reservations} />
        <Stack.Screen name="Reviews" component={Reviews} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Contact" component={Contact}/>
      </Stack.Navigator>
      </MyDrawer>
  </NavigationContainer>
  </ContextProvider>
  </PaperProvider>
  );
}
