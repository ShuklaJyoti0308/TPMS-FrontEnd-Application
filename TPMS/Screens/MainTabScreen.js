import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseurl } from '../config';

import HomeScreen from './HomeScreen';
import PassScreen from './PassScreen';
import PackageScreen from './PackageScreen';
import TransportHistoryScreen from './TransportHistoryScreen';
import ProfileScreen from './ProfileScreen';
import ViewPassScreen from './ViewPassScreen';

const HomeStack = createStackNavigator();
const PassStack = createStackNavigator();
const PackageStack = createStackNavigator();
const TransportHistoryStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ViewPassStack = createStackNavigator();


const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {

  const [userId, setUserId] = useState(0);
  const [token, setToken] = React.useState('');
  const [passRequest, setPassRequest]= useState(false);
 

  useEffect(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    let userId = await AsyncStorage.getItem('id');
    userId = parseInt(userId);
    setUserId(userId);
    displayPassStatus(userId, token);
  },[]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }


  const displayPassStatus = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/member/' + userId,{ headers })
      .then((response) => {
        console.log("res: ", response.status);
        console.log("Maintab res data : ", response.data);
        if(response.status == 200) {
            setPassRequest(true);  
        }  
        else
        {
          showAlert('error', 'Failed to show pass.');
        }  
        
      })
      .catch((error) => {
        console.log(error.response);
        //showAlert('error', 'Network Error.');
      });
  }

  return(
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      inactiveColor="#fff"
      barStyle={{ backgroundColor: '#FE6666' }} 
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#FE6666',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      { (passRequest==true) ? 
        (
          <Tab.Screen
            name="View Pass"
            component={ViewPassStackScreen}
            options={{
              tabBarLabel: 'View Pass',
              tabBarColor: '#FE6666',
              tabBarIcon: ({ color }) => (
                <Icon name="ios-menu" color={color} size={26} />
              ),
            }}
          />

        ) : 
        ( <Tab.Screen
            name="Pass"
            component={PassStackScreen}
            options={{
              tabBarLabel: 'Pass',
              tabBarColor: '#FE6666',
              tabBarIcon: ({ color }) => (
                <Icon name="ios-bus" color={color} size={26} />
              ),
            }}
          />
        ) 
      }
      
      <Tab.Screen
        name="Package"
        component={PackageStackScreen}
        options={{
          tabBarLabel: 'Package',
          tabBarColor: '#FE6666',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-pricetags" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Transport History"
        component={TransportHistoryStackScreen}
        options={{
          tabBarLabel: 'Transport History',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-bus-outline" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="person-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )

}  
  

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator screenOptions={{
         headerStyle: {
            backgroundColor: "#FE6666"
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "600"
          }
      }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
          title: 'TPMS',
          headerLeft: () => (
            <Icon.Button name="ios-arrow-back" size={25} iconStyle={{marginRight:0}}  backgroundColor="#FE6666" onPress={() => navigation.goBack()}></Icon.Button>
          )
        }} />
  </HomeStack.Navigator>
);

const PassStackScreen = ({navigation}) => (
  <PassStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: "#FE6666"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600"
        }
      }}>
     <PassStack.Screen name="Pass" component={PassScreen} options={{
          title: 'Request for Transport Pass',
          headerLeft: () => (
            <Icon.Button name="ios-arrow-back" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.goBack()}></Icon.Button>
          )
        }} />
  </PassStack.Navigator>
);

const ViewPassStackScreen = ({navigation}) => (
  <ViewPassStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: "#FE6666"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600"
        }
      }}>
     <ViewPassStack.Screen name="View Pass" component={ViewPassScreen} options={{
          title: 'View Pass',
          headerLeft: () => (
            <Icon.Button name="ios-arrow-back" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.goBack()}></Icon.Button>
          )
        }} />
  </ViewPassStack.Navigator>
);

const PackageStackScreen = ({navigation}) => (
  <PackageStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: "#FE6666"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600"
        }
      }}>
     <PackageStack.Screen name="Package" component={PackageScreen} options={{
          title: 'Transport Package',
          headerLeft: () => (
            <Icon.Button name="ios-arrow-back" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.goBack()}></Icon.Button>
          )
        }} />
  </PackageStack.Navigator>
);

const TransportHistoryStackScreen = ({navigation}) => (
  <TransportHistoryStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: "#FE6666"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600"
        }
      }}>
     <TransportHistoryStack.Screen name="TransportHistory" component={TransportHistoryScreen} options={{
          title: 'Transport History',
          headerLeft: () => (
            <Icon.Button name="ios-arrow-back" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.goBack()}></Icon.Button>
          )
        }} />
  </TransportHistoryStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: "#FE6666"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600"
        }
      }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{
          title: 'Profile',
          headerLeft: () => (
            <Icon.Button name="ios-arrow-back" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.goBack()}></Icon.Button>
          )
        }} />
  </ProfileStack.Navigator>
);