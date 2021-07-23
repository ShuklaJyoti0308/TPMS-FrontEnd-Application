import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import ForgetPasswordScreen from './ForgetPasswordScreen';
import ResetPasswordScreen from './ResetPasswordScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}/>
        <RootStack.Screen name="RegistrationScreen" component={RegistrationScreen}/>
        <RootStack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen}/>
        {/* <RootStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>  */}
    </RootStack.Navigator>
);

export default RootStackScreen;