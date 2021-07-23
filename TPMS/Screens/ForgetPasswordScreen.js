import React, { useState } from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseurl } from '../config';
import ResetPasswordScreen from './ResetPasswordScreen';

const ForgetPasswordScreen = () => {

   const navigation = useNavigation();
   

    const [userName,setUserName] = useState('');
    const [loading, setLoading] = React.useState(false);
   

    //For Update Password
    const [otp, setOtp] = useState('');
    const [OtpStatus,setOtpStatus] = React.useState(false);


    // const [password, setPassword] = useState('');
    // const [validPassword, setValidPassword] = useState(false);
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [secureTextEntry, setSecureTextEntry] = useState(true);
    // const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

    // const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;

    const showAlert = (title, message) => {
        Alert.alert(title, message, [
          {text: 'Okay'}
        ]);
    }

    const ForgetPasswordHandler = () => {
        if ( userName.length == 0) {
            showAlert('Wrong Input!', 'Username field cannot be empty.');
            return;
          }
        else{
            setLoading(true);
            const headers = { 
                'Content-Type': 'text/plain'
            }
            console.log("uname:", userName);
            axios.post(baseurl + '/forgot-password/send-email', userName, { headers })
                .then((response) => {
                  setLoading(false);
                  console.log("status code of mail success:",response.data);
                  if(response.status == 200) {
                    showAlert('Success', 'OTP sent successfully on your registered email. Please check your email...!');
                  
                  }
                  else {
                    showAlert('error', 'Network Error');
                    }
                    
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.status);
                        setLoading(false);
                        if (error.response.status == 404) {
                            showAlert('Invalid details', 'Username is incorrect. Please enter correct username to proceed.');
                        } else {
                            showAlert('error', 'Network Error');
                        }
                    } else {
                        showAlert('error', 'Network Error');
                    }  
              });

         }  
    }

    const validateOTP = () => {
        if ( otp.length == 0) {
            showAlert('Wrong Input!', 'Please enter otp for proceed.');
            return;
          }
        else{
            setLoading(true);
            const reqData = {
                otp: otp,
                userName:userName
            };
            axios.post(baseurl + '/forgot-password/validate-otp',reqData)
                .then((response) => {
                  setLoading(false);
                  console.log("status code of valid otp :",response.status);
                  if(response.status == 200) {
                    setOtpStatus(true);
                    showAlert('Success', 'OTP matched successfully. You can change your password.');    
                  }
                  else {
                    showAlert('error', 'Network Error');
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.status);
                        setLoading(false);
                        if (error.response.status == 404) {
                            showAlert('Invalid OTP.', 'Please enter correct OTP to proceed');
                        } else {
                            showAlert('error', 'Network Error');
                        }
                    } else {
                        showAlert('error', 'Network Error');
                    }  
              });

         }
    }

   
    if(OtpStatus==true) {
        return(
            <ResetPasswordScreen uname={userName}  otp={otp} />  
        );
    }

    return (
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="#FE6666" barStyle="light-content" />
          <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
          <View style={styles.header}>
            <Text style={styles.text_header}>Forget Password</Text>
          </View>
    
          <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
          >
          <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={[styles.text_footer,{marginTop: 25}]}>Username</Text>
            <View style={styles.action}>
                <FontAwesome
                    name="user-o"
                    color="#000000"
                    size={20}
                />
                <TextInput
                    placeholder="Your Username"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setUserName(val)}
                    value={userName}
                />
                {userName.length > 0 ?
                    <Animatable.View
                        animation="bounceIn">
                        <Feather
                        name="check-circle"
                        size={20}
                        color="#FE6666"
                        />  
                    </Animatable.View>
                : null}
            </View>
            { 
                (userName.length > 0 && userName.length < 6) ? 
                <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Username must be 6 characters long.</Text>
                </Animatable.View> 
                : null
            }
                
            
        
            <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => { ForgetPasswordHandler() }}
                  style={[styles.signIn, {
                    borderColor: '#FE6666',
                    borderWidth: 2
                    }]}
                >
                <Text style={[styles.textSign, {
                  color: '#FE6666'
                }]}>Get OTP</Text>
                </TouchableOpacity>
            </View> 
            
            <View style={{ marginTop: 50, marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '300', color: '#000000' }}>Update Password after getting OTP..</Text>
            </View>

            <Text style={styles.text_footer}>OTP</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Enter OTP here"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => { setOtp(val) }}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                    />
                    {otp.length == 6 ?
                        <Animatable.View
                        animation="bounceIn"
                        >
                        <Feather
                            name="check-circle"
                            color="#FE6666"
                            size={20}
                        />
                        </Animatable.View>
                    : null}
                </View>

            <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => { validateOTP() }}
                  style={[styles.signIn, {
                    borderColor: '#FE6666',
                    borderWidth: 2
                    }]}
                >
                <Text style={[styles.textSign, {
                  color: '#FE6666'
                }]}>Reset Password</Text>
                </TouchableOpacity>
            </View> 

            </ScrollView>
          </Animatable.View>
        </SafeAreaView>
      );
    }
    
export default ForgetPasswordScreen;

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
        marginTop: 15  
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

