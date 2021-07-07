import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, RefreshControl,  ActivityIndicator, Alert} from 'react-native';
import {
  Title,
  Caption,
  Text,
  TouchableRipple
} from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseurl } from '../config';

const ProfileScreen = ({navigation}) => {

  const [memberData, setMemberData] = useState({});
  const [regData, setRegData] = useState({});
  const [userId, setUserId] = useState(0);
  const [shortName, setShortName] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    let userId = await AsyncStorage.getItem('id');
    userId = parseInt(userId);
    console.log("User id :" + userId);
    setUserId(userId);
    displayRegistration(userId, token);
    displayMember(userId, token);
    

  },[refreshing]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  },[]);

  const displayRegistration = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/' + userId,{ headers })
      .then((response) => {
        if(response.status == 200) {
          //console.log('response from register :', response.data);
          console.log("mail :: ", response.data[0].email);
          setRegData(response.data[0]);
        }  
        else
        {
          showAlert('error', 'Network Error.');
        }  
        
      })
      .catch((error) => {
        showAlert('error', 'Network Error.');
      });
  }


  const displayMember = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    //console.log(headers);
    axios.get(baseurl + '/member/' + userId,{ headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if(response.status == 200) {
          //console.log('response from members :', response.data);
          console.log("Fname :: ", response.data[0].mobileNo);
          setMemberData(response.data[0]);
          setShortName(response.data[0].firstName.substr(0, 1) + response.data[0].lastName.substr(0, 1));  
        }  
        else
        {
          showAlert('error', 'Network Error.');
        }  
        
      })
      .catch((error) => {
         setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Network Error.');
      });
  }

  const { signOut } = React.useContext(AuthContext);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
      keyboardShouldPersistTaps='handled'
      refreshControl={
        <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
        />
        }
      >
      {loading == true && (<ActivityIndicator size="large" color="#bdc4ca" />)}
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: 'row',marginTop:15 }}>
          <Avatar 
            size="medium"
            rounded
            title={ shortName }
            activeOpacity={0.7}
            containerStyle={{ color: 'red', backgroundColor: '#bdc4ca', marginTop: 10 }}
          />
          <View style={{ marginLeft:20 }}>
            <Title style={[styles.title,{marginTop: 5, marginBottom: 5}]}>{memberData.firstName} {memberData.lastName}</Title>
            <Caption style={styles.caption}>{regData.userName}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="cellphone-text" color="#FE6666" size={25} />
          <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>{memberData.mobileNo}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email-outline" color="#FE6666" size={25} />
          <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>{regData.email}</Text>
        </View>
      </View>
      
      <View style={styles.menuWrapper}>
        <TouchableRipple>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#FE6666" size={25} />
            <Text style={styles.menuItemText}>Update Your Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple>
          <View style={styles.menuItem}>
            <Icon name="key-change" color="#FE6666" size={25} />
            <Text style={styles.menuItemText}>Change Password</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={ () => { signOut() } }>
          <View style={styles.menuItem}>
            <Icon name="logout" color="#FE6666" size={25} />
            <Text style={styles.menuItemText}>Signout</Text>
          </View>
        </TouchableRipple>
      </View>

    </ScrollView>
    </SafeAreaView>
  );

};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  menuWrapper: {
    marginTop: 10
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  menuItemText: {
    color: '#000000',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  }
});


