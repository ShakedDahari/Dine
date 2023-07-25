import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MD3LightTheme as DefaultTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { createTheme } from '@mui/material/styles';

import Page1 from './Pages/Page1';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Order from './Pages/Order';
import Admin from './Pages/Admin';
import Charts from './Pages/Charts';
import BusinessRegistration from './Pages/BusinessRegistration';
import RestaurantDetails from './Pages/RestaurantDetails';
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
    <Drawer.Navigator initialRouteName="Login">  
      <Drawer.Screen
          name="Login"
          component={Login}
          options={{ drawerLabel: 'Login' }}
      />
      <Drawer.Screen
        name="Main"                       //page title
        component={Page1}                  //component = page element
        options={{ drawerLabel: 'Main' }} //sets menu label of page
      />
      <Drawer.Screen
        name="Register"
        component={Register}
        options={{ drawerLabel: 'Register' }}
      />
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ drawerLabel: 'Home' }}
      />
       <Drawer.Screen
        name="Order"
        component={Order}
        options={{ drawerLabel: 'Order' }} //hides from menu bar {drawerItemStyle: { height: 0 }}
      />
       <Drawer.Screen
        name="Admin"
        component={Admin}
        options={{ drawerLabel: 'Admin' }}
      />
        <Drawer.Screen
        name="Chart"
        component={Charts}
        options={{ drawerLabel: 'Chart' }}
      />
      <Drawer.Screen
        name="BusinessRegistration"
        component={BusinessRegistration}
        options={{ drawerLabel: 'BusinessRegistration' }}
      />
      <Drawer.Screen
        name="RestaurantDetails"
        component={RestaurantDetails}
        options={{ drawerLabel: 'RestaurantDetails' }}
      />
    </Drawer.Navigator>
  );
}

const handleBackPress = (screenName, navigation) => {
  switch (screenName) {
    case 'Login':
      BackHandler.exitApp();
      return true;
    case 'Main':
      navigation.navigate('Login');
      return true;
    case 'Register':
      navigation.navigate('Login');
      return true;
    case 'BusinessRegistration':
      navigation.navigate('Register');
      return true;
    case 'Home':
      navigation.navigate('Main');
      return true;
    // case 'RestaurantDetails':
    //   navigation.navigate('Main');
    //   return true;
    case 'Order':
      navigation.navigate('Home');
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
        <Stack.Screen name="Main" component={Page1} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Chart" component={Charts} />
        <Stack.Screen name="BusinessRegistration" component={BusinessRegistration} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
      </Stack.Navigator>
      </MyDrawer>
  </NavigationContainer>
  </ContextProvider>
  </PaperProvider>
  );
}
