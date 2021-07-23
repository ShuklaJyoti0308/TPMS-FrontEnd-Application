
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useEffect} from 'react';
 import RazorpayCheckout from 'react-native-razorpay';
 import type {Node} from 'react';
 import {SafeAreaProvider} from 'react-native-safe-area-context';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 
 import { NavigationContainer } from '@react-navigation/native';
 import { createDrawerNavigator } from '@react-navigation/drawer';
 import { createStackNavigator } from '@react-navigation/stack'
  
 import RootStackScreen from './Screens/RootStackScreen';
 import MainTabScreen from './Screens/MainTabScreen';  
 import ChangePasswordScreen from './Screens/ChangePasswordScreen';
 import { AuthContext } from './components/context';

 
 
 const Drawer = createDrawerNavigator();
 const Stack = createStackNavigator();
 
  const App: () => Node = () => {
  
   const initialLoginState = {
     // isLoading: true,
     userName: '',
     jwtToken: null,
   };
 
   const loginReducer = (prevState, action) => {
     switch (action.type) {
       case 'RETRIEVE_TOKEN':
         return {
           ...prevState,
           jwtToken: action.jwtToken
         };
       case 'LOGIN':
         return {
             ...prevState,
             id: action.id,
             userName: action.userName,
             role: action.role, 
             jwtToken: action.jwtToken
         }; 
       case 'LOGOUT' :
         return {
           ...prevState,
           id: null,
           userName: null,
           role: null, 
           jwtToken: null
       };    
     }
   };
 
   const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
    
   const authContext = React.useMemo(() => ({
   
     signIn: async(id, userName, role, jwtToken) => {
       try {
         //console.log('From signin :' + id + ' ' + userName + ' ' + role + ' ' + jwtToken);
         await AsyncStorage.setItem('id', id+'');
         await AsyncStorage.setItem('userName', userName);
         await AsyncStorage.setItem('role', role);
         await AsyncStorage.setItem('jwtToken', jwtToken);
       }catch(e){
         console.log(e);
       }
       console.log('Token fron Login: ',jwtToken);
       dispatch({ type: 'LOGIN', id: id, userName: userName, role: role, jwtToken: jwtToken}); 
     },
 
     signOut: async() => {
       try {
           await AsyncStorage.removeItem('id');
           await AsyncStorage.removeItem('userName');
           await AsyncStorage.removeItem('role');
           await AsyncStorage.removeItem('jwtToken');
       }catch(e){
         console.log(e);
       }
       dispatch({ type: 'LOGOUT' });
     }
 
   }),[]);
 
 
 
   useEffect(() => {
     setTimeout(async() => {
       let jwtToken = null;
       try{
         jwtToken = await AsyncStorage.getItem('jwtToken');
       }catch(e){
         console.log(e);
       }
       dispatch({ type: 'RETRIEVE_TOKEN',jwtToken: jwtToken });
     },1000);
   },[]);
   
   console.log(loginState);
 
 
    return (
      
      <SafeAreaProvider>
        <AuthContext.Provider value={authContext}>
       <NavigationContainer>
       { loginState.jwtToken !== null ? (
         <Stack.Navigator screenOptions={{headerShown: false}}>
         <Stack.Screen name="MainTabScreen" component={MainTabScreen}/>
         <Stack.Screen name="changePasswordScreen" component={ChangePasswordScreen} />
         </Stack.Navigator>
         
       ) 
       : 
         <RootStackScreen />
       }
         
       </NavigationContainer>
        </AuthContext.Provider>
     </SafeAreaProvider>
    );
 
  };
  export default App;