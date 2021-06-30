import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import PassScreen from './PassScreen';
import PackageScreen from './PackageScreen';
import TransportHistoryScreen from './TransportHistoryScreen';
import ProfileScreen from './ProfileScreen';

const HomeStack = createStackNavigator();
const PassStack = createStackNavigator();
const PackageStack = createStackNavigator();
const TransportHistoryStack = createStackNavigator();
const ProfileStack = createStackNavigator();


const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
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
      <Tab.Screen
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
      <Tab.Screen
        name="Package"
        component={PackageStackScreen}
        options={{
          tabBarLabel: 'Package',
          tabBarColor: '#FE6666',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-train-outline" color={color} size={26} />
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
);

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
            <Icon.Button name="ios-menu" size={25} iconStyle={{marginRight:0}}  backgroundColor="#FE6666" onPress={() => navigation.navigate('ProfileScreen')}></Icon.Button>
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
            <Icon.Button name="ios-menu" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.navigate('ProfileScreen')}></Icon.Button>
          )
        }} />
  </PassStack.Navigator>
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
            <Icon.Button name="ios-menu" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.navigate('ProfileScreen')}></Icon.Button>
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
            <Icon.Button name="ios-menu" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.navigate('ProfileScreen')}></Icon.Button>
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
            <Icon.Button name="ios-menu" size={25} iconStyle={{marginRight:0}} backgroundColor="#FE6666" onPress={() => navigation.navigate('ProfileScreen')}></Icon.Button>
          )
        }} />
  </ProfileStack.Navigator>
);