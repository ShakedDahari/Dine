import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MD3LightTheme as DefaultTheme, MD3LightTheme, PaperProvider, configureFonts } from 'react-native-paper';
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
import { useEffect } from 'react';

import { apiUrl } from './utils/api_url';
import { I18nManager } from 'react-native';


const theme =  createTheme({
  ...DefaultTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#90b2ac',
    secondary: '#aaccc6',
    tertiary: '#577287',
  },
  //colors: colors.colors, // The color codes scheme
  //fonts: configureFonts({config: fontConfig.fontConfig, isV3: false}),
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

const fetchApi = async() => {
  try {
    const res  = await fetch(`${apiUrl}/api/users`);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
}


export default function App() {

  useEffect(() => {
    fetchApi();
  }, [])


  return (
    <PaperProvider theme={theme}>
    <ContextProvider>
    <NavigationContainer>
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
