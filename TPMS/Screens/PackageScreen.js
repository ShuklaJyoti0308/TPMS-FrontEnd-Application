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

  const [memberTypeId, setMemberTypeId] = useState(0);
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  // useEffect(async () => {
  //   const token = await AsyncStorage.getItem('jwtToken');
  //   setToken(token);
  //   let userId = await AsyncStorage.getItem('id');
  //   userId = parseInt(userId);
  //   setUserId(userId);
   // getMemberTypeId(userId, token);
    //displayTransportMode(token);
    
  //},[refreshing]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  },[]);

  // const getMemberTypeId = (userId, token) => {
  //   if(userId == 0)
  //   {
  //     return;
  //   }
  //   const headers = { 'Authorization': 'Bearer ' + token };
  //   axios.get(baseurl + '/member/' + userId,{ headers })
  //     .then((response) => {
  //       if(response.status == 200) {
  //         setMemberTypeId(response.data[0].memberTypeId); 
  //         getPkgByMemberType();
  //       }  
  //       else
  //       {
  //         showAlert('error', 'Network Error.');
  //       }  
        
  //     })
  //     .catch((error) => {
  //       showAlert('Error','Network error');
  //     });
  // }


  // const displayTransportMode = (token) => {
  //   const headers = { 'Authorization': 'Bearer ' + token };
  //   axios.get(baseurl + '/transport-modes', { headers })
  //     .then(response => {
  //       if (response.status == 200) {
  //         setData(response.data);
  //         let dt = response.data;
  //         let arr = [];
  //         for (let i = 0; i < dt.length; i++) {
  //           arr.push({
  //             value : dt[i].id,
  //             label : dt[i].name
  //           });
  //         }
  //         setTransportModeData(arr);
  //       }
  //       else {
  //         showAlert('error', 'Network Error.');
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       showAlert('error', 'Failed to get transport mode.');
  //     })
  // }

  const onChangeTransportMode = (value) => {
    console.log("id of transport mode :" , value);
      setTransportModeId(value);
     
    };
  


  return (
    
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
    {/* <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} /> */}
    <View style={styles.container}>
      <StatusBar  backgroundColor="#FE6666" barStyle="light-content" />  
        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
          <View style={styles.btnContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                //onPress={packageRequesthandler}
                style={styles.mode}
              >
              <Text style={[styles.textMode, {
                color: '#FE6666'
              }]}>BUS</Text>
              </TouchableOpacity>
              
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                //onPress={packageRequesthandler}
                style={styles.mode}
              >
              <Text style={[styles.textMode, {
                color: '#FE6666'
              }]}>TRAM</Text>
              </TouchableOpacity>
              
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                //onPress={packageRequesthandler}
                style={styles.mode}
              >
              <Text style={[styles.textMode, {
                color: '#FE6666'
              }]}>METRO</Text>
              </TouchableOpacity>
              
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                //onPress={packageRequesthandler}
                style={styles.mode}
              >
              <Text style={[styles.textMode, {
                color: '#FE6666'
              }]}>ALL</Text>
              </TouchableOpacity>
              
            </View>
          </View>
          

          <View style={styles.rect}>
            <View style={{ backgroundColor:'#EBF5FA', padding:15, borderTopLeftRadius:10,borderTopRightRadius:10 }}>
              <Text style={styles.package}>Package Name</Text>
            </View>
            
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.pkgPrice}>
                  {/* <FontAwesome
                    name="user-o"
                    color="#FE6666"
                    size={20}
                  /> */}
                  <Text style={styles.amount}>Rs</Text>
                  <Text style={styles.amount}>149</Text>
                </View>
           
                <View style={styles.pkgValidity}>
                  <Text style={styles.day}>256 Days</Text>
                </View>
                
              </View>
              <View style={{ height: 30, marginTop: 25}}>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>Kids,Adult,Senior Citizen</Text>
              </View> 
          </View>  
          <View style={styles.rect}>
            <View style={{ backgroundColor:'#EBF5FA', padding:15, borderTopLeftRadius:10,borderTopRightRadius:10 }}>
              <Text style={styles.package}>Package Name</Text>
            </View>
            
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.pkgPrice}>
                  {/* <FontAwesome
                    name="user-o"
                    color="#FE6666"
                    size={20}
                  /> */}
                  <Text style={styles.amount}>Rs</Text>
                  <Text style={styles.amount}>250</Text>
                </View>
           
                <View style={styles.pkgValidity}>
                  <Text style={styles.day}>298 Days</Text>
                </View>
                
              </View>
              <View style={{ height: 30, marginTop: 25}}>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>Kids,Adult,Senior Citizen</Text>
              </View> 
          </View>  
          
          <View style={styles.rect}>
            <View style={{ backgroundColor:'#EBF5FA', padding:15, borderTopLeftRadius:10,borderTopRightRadius:10 }}>
              <Text style={styles.package}>Package Name</Text>
            </View>
            
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.pkgPrice}>
                  {/* <FontAwesome
                    name="user-o"
                    color="#FE6666"
                    size={20}
                  /> */}
                  <Text style={styles.amount}>Rs</Text>
                  <Text style={styles.amount}>149</Text>
                </View>
           
                <View style={styles.pkgValidity}>
                  <Text style={styles.day}>256 Days</Text>
                </View>
                
              </View>
              <View style={{ height: 30, marginTop: 25}}>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>Kids,Adult,Senior Citizen</Text>
              </View> 
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
  
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 20
  },
 
  text_footer: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold'
  },

  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  button: {
    flex: 1
  },
  mode: {
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, 
    borderColor: '#FE6666',
    borderWidth: 1,
    marginTop: 10,
  },
 
  textMode: {
      fontSize: 14,
      fontWeight: 'bold'
  },

  rect: {
    width: '90%',
    height: 170,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius:10,
    borderColor: '#B7CADC',
    marginTop: 20,
    marginLeft: 15,
  },

  package: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    textAlign: "center"
  },

  pkgPrice: {
    // height: 95,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    // alignSelf: "flex-start"
    // flex: 4
  
  },
  // ellipse: {
  //   width: 61,
  //   height: 61,
  //   marginTop: 0,
  //   borderRadius: 30,
  //   marginLeft: 7
  // },
  amount: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 10,
    marginTop: 20,
    fontWeight: "bold"
  },
  pkgValidity: {
    display: 'flex',
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  day: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginRight: 10,
    marginTop: 20,
    fontWeight: "bold",
   
  },
});





