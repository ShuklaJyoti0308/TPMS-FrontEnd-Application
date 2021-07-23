import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';
import { baseurl } from '../config';

const ChangePasswordScreen = ({navigation}) => {

    const [userId, setUserId] = useState(0);
    const [userName, setUserName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validNewPassword, setValidNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const [secureTextEntry2, setSecureTextEntry2] = useState(true);
    const [secureTextEntry3, setSecureTextEntry3] = useState(true);
    const [token, setToken] = useState('');
    const [loading, setLoading] = React.useState(false);

    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;

    useEffect(async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        setToken(token);
        let userId = await AsyncStorage.getItem('id');
        userId = parseInt(userId);
        console.log("User id :" + userId);
        //setUserId(userId);
        getUserName(userId, token);
    },[]);
    
    const getUserName = (userId, token) => {
      if(userId == 0)
      {
        return;
      }
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.get(baseurl + '/users/' + userId,{ headers })
        .then((response) => {
          if(response.status == 200) {
            console.log('user data :', response.data);
            setUserName(response.data[0].userName);
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

    const showAlert = (title, message) => {
        Alert.alert(title, message, [
          {text: 'Okay'}
        ]);
    }

    const changePasswordHandler = () => {
      if (oldPassword.length == 0) {
          showAlert('Invalid Input', 'Please enter valid old password to proceed.');
      }
      else if (!validNewPassword) {
          showAlert('Invalid Input', 'Please enter valid new password to proceed.');
      }
      else if (newPassword != confirmNewPassword) {
          showAlert('Invalid Input', 'New Password and Confirm New Password must be same.');
      }
      else {
        setLoading(true);
        const headers = { 'Authorization': 'Bearer ' + token };
        const requestData = {
          userName: userName,
          oldPassword: oldPassword,
          newPassword: newPassword
        };

        axios.put(baseurl + '/user/changePassword', requestData, { headers })
        .then((response) => {
            setLoading(false);
            if (response.status == 200) {
                showAlert('Success', 'Password updated successfully.!');
            } else {
                showAlert('error', 'Network Error');
            }
        })
        .catch((error) => {
            setLoading(false);
            if (error.response) {
              console.log(error.response.status);
              if (error.response.status == 401) {
                  showAlert('warning', 'Invalid Old Password');
              }else {
                  showAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
              }
            }
        });

      }
    }


    return (
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="#FE6666" barStyle="light-content" />
          <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
          <View style={styles.header}>
            <Text style={styles.text_header}>Change Password</Text>
          </View>
    
          <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
          >
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={[styles.text_footer,{marginTop: 25}]}>Old Password</Text>
            <View style={styles.action}>
                <Feather
                    name="lock"
                    color="#05375a"
                    size={20}
                />
              <TextInput
                placeholder="Your Old Password"
                secureTextEntry={secureTextEntry1 ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setOldPassword(val)}
               />
               <TouchableOpacity
                    onPress={() => setSecureTextEntry1(!secureTextEntry1)}
                >
                    {secureTextEntry1 ?
                        <Feather
                            name="eye-off"
                            color="grey"
                            size={20}
                        />
                        :
                        <Feather
                            name="eye"
                            color="grey"
                            size={20}
                        />
                    }
                </TouchableOpacity>                            
            </View>
            {(oldPassword.length > 0 && oldPassword.length < 8) ?
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                </Animatable.View>
                : null
            }
    
            <Text style={[styles.text_footer,{marginTop: 35}]}>New Password</Text>
            <View style={styles.action}>
              <Feather
                name="lock"
                color="#000000"
                size={18}
              />
              <TextInput
                placeholder="Your New Password"
                secureTextEntry={secureTextEntry2 ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => {
                    setNewPassword(val);
                    if (val.match(password_regex))
                        setValidNewPassword(true);
                    else
                        setValidNewPassword(false);
                }}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry2(!secureTextEntry2)}
              >
                {secureTextEntry2 ?
                <Feather
                  name="eye-off"
                  size={18}
                  color="grey"
                /> 
                :
                <Feather
                  name="eye"
                  size={18}
                  color="grey"
                /> 
                }
              </TouchableOpacity>   
            </View>
            {(newPassword.length > 0 && !validNewPassword) ?
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.</Text>
                </Animatable.View>
                : null
            }


            <Text style={[styles.text_footer,{marginTop: 35}]}>Confirm New Password</Text>
            <View style={styles.action}>
              <Feather
                name="lock"
                color="#000000"
                size={18}
              />
              <TextInput
                placeholder="Confirm Your Password"
                secureTextEntry={secureTextEntry3 ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setConfirmNewPassword(val)}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry3(!secureTextEntry3)}
              >
                {secureTextEntry3 ?
                <Feather
                  name="eye-off"
                  size={18}
                  color="grey"
                /> 
                :
                <Feather
                  name="eye"
                  size={18}
                  color="grey"
                /> 
                }
              </TouchableOpacity>   
            </View>
            {(newPassword.length > 0 && newPassword != confirmNewPassword) ?
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Password and confirm password must match.</Text>
                </Animatable.View>
                : null
            }
    
            <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => { changePasswordHandler() }}
                  style={[styles.signIn, {
                    borderColor: '#FE6666',
                    borderWidth: 2,
                    marginTop: 10
                    }]}
                >
                <Text style={[styles.textSign, {
                  color: '#FE6666'
                }]}>Change Password</Text>
                </TouchableOpacity>
            </View> 
    
            <View style={{ marginTop: 50 }}></View>
            </ScrollView>
          </Animatable.View>
        </SafeAreaView>
      );
    }
    
export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#FE6666'
      
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 80
    },
    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24
    },
    text_footer: {
        color: '#000000',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#000000',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 30  
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
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
  });

