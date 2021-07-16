import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  Platform,
  StatusBar,
  ScrollView, 
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert  
} from 'react-native';
import {
  Dropdown
} from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';

const PackageScreen = ({navigation}) => {

  const [transportModeData, setTransportModeData] = useState({});
  const [transportModeId, setTransportModeId] = useState(0);
  const [data, setData] = useState([]);
  //const [packageData, setPackageData] = useState({});
  const [userId, setUserId] = useState(0);
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    let userId = await AsyncStorage.getItem('id');
    userId = parseInt(userId);
    setUserId(userId);
    displayTransportMode(token);
  },[refreshing]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  },[]);

  const displayTransportMode = (token) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/transport-modes', { headers })
      .then(response => {
        if (response.status == 200) {
          setData(response.data);
          let dt = response.data;
          let arr = [];
          for (let i = 0; i < dt.length; i++) {
            arr.push({
              value : dt[i].id,
              label : dt[i].name
            });
          }
          setTransportModeData(arr);
        }
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch(error => {
        console.log(error);
        showAlert('error', 'Failed to get transport mode.');
      })
  }

  const onChangeTransportMode = (value) => {
    console.log("id of transport mode :" , value);
      setTransportModeId(value);
     
    };
  


  return (
    
    <ScrollView keyboardShouldPersistTaps='handled'>
    {/* <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} /> */}
    <View style={styles.container}>
      <StatusBar  backgroundColor="#FE6666" barStyle="light-content" />  
        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
          
          <Text style={[styles.text_footer, { marginTop:5 }]}>Transport Mode</Text>
            <View style={styles.action}>
              <Dropdown
                label="Select Transport Mode"
                data={transportModeData}
                enableSearch
                value={transportModeId}
                onChange={onChangeTransportMode}
              />
            </View>

          <Text style={[styles.text_footer, { marginTop:25 }]}>Package Name</Text>
            <View style={styles.action}>
              <Dropdown
                  label="Select Package"
                  //data={memberTypeData}
                  enableSearch
                  //value={memberTypeId}
                  //onChange={onChangeMemberType}
                />
            </View>

            <Text style={[styles.text_footer, { marginTop:25 }]}>Package Type</Text>
            <View style={styles.action}>
              <Dropdown
                  label="Select subscrption Type"
                  //data={memberTypeData}
                  enableSearch
                  //value={memberTypeId}
                  //onChange={onChangeMemberType}
                />
            </View>

          <Text style={[styles.text_footer, { marginTop:25 }]}>Validity</Text>
            <View style={styles.action}>
              <FontAwesome
                name="calendar"
                color="#FE6666"
                size={20}
              />
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                // onChangeText={(val) => setFirstName(val)}
                // value={firstName}
                maxLength={50}
              />
           </View>
          
          <Text style={[styles.text_footer, { marginTop:25 }]}>Price</Text>
            <View style={styles.action}>
            <FontAwesome
              name="money"
              color="#FE6666"
              size={20}
            />
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                // onChangeText={(val) => setFirstName(val)}
                // value={firstName}
                maxLength={50}
              />
            </View>

          <View style={{ marginTop: 50 }}></View>

          <View style={styles.button}>
            <TouchableOpacity
              //onPress={packageRequesthandler}
              style={[styles.signIn, {
                borderColor: '#FE6666',
                borderWidth: 2,
                marginTop: 10
                }]}
            >
            <Text style={[styles.textSign, {
              color: '#FE6666'
            }]}>SEND</Text>
            </TouchableOpacity>
          </View>
          
        </Animatable.View>
      </View>
    </ScrollView>
  );
};

export default PackageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FE6666'
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 90    
    },
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 40,
      paddingVertical: 40
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 22
  },
  text_footer: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold'
  },
  action: {
      flexDirection: 'row',
      marginTop: 2,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -15,
      paddingLeft: 10,
      color: '#000000',
      borderBottomColor: "#bdc4ca",
      borderBottomWidth:0.5
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }

});





