// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function PushNotification() {
//   // let { expoPushToken, setExpoPushToken } = useContext(ContextPage);
//   // const [notification, setNotification] = useState(false);
//   // const notificationListener = useRef();
//   // const responseListener = useRef();

//   // useEffect(() => {
//   //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//   //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//   //     setNotification(notification);
//   //   });

//   //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//   //     console.log(response);
//   //   });

//   //   return () => {
//   //     Notifications.removeNotificationSubscription(notificationListener.current);
//   //     Notifications.removeNotificationSubscription(responseListener.current);
//   //   };
//   // }, []);

//   // return (
//   //   <View
//   //     style={{
//   //       flex: 1,
//   //       alignItems: 'center',
//   //       justifyContent: 'space-around',
//   //     }}>
//   //     <Text>Your expo push token: {expoPushToken}</Text>
//   //     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//   //       <Text>Title: {notification && notification.request.content.title} </Text>
//   //       <Text>Body: {notification && notification.request.content.body}</Text>
//   //       <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//   //     </View>
//   //     <Button
//   //       title="Press to schedule a notification"
//   //       onPress={async () => {
//   //         await schedulePushNotification();
//   //       }}
//   //     />
//   //   </View>
//   // );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       sound: 'default',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// export async function sendNotification(title, body, expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: title,
//     body: body,
//   };
  
//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

// export async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }

import { LogBox } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";

LogBox.ignoreLogs([
  'Calling getExpoPushTokenAsync without specifying a projectId is deprecated and will no longer be supported in SDK 49+',
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export async function sendPushNotification(title, body, expoPushToken) {
  const message = {
    to: expoPushToken.data,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
  };

  console.log(message);

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync( //{projectId: Constants.manifest.extra.eas.projectId,}
      );
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}

