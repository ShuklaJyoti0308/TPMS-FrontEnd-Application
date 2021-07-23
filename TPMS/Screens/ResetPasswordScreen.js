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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseurl } from '../config';

const ResetPasswordScreen = (props) => {

    const navigation = useNavigation();
    const username = props.uname;
    const otp = props.otp;
     
    
     const [loading, setLoading] = React.useState(false);

 
     const [password, setPassword] = useState('');
     const [validPassword, setValidPassword] = useState(false);
     const [confirmPassword, setConfirmPassword] = useState('');
     const [secureTextEntry, setSecureTextEntry] = useState(true);
     const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
 
     const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;
 
     const showAlert = (title, message) => {
         Alert.alert(title, message, [
           {text: 'Okay'}
         ]);
     }
 
    
const ResetPasswordHandler = () => {
    console.log('call');
    const reqData = {
        userName: username,
        newPassword: password,
        otp:otp
      };
    console.log("data on reset :",reqData);  
    axios.post(baseurl + '/forgot-password/change-password', reqData)
    .then((response) => {
      setLoading(false);
      console.log("status of change pass :",response.status);
      if(response.status == 200) {
        showAlert('Success', 'Password changed successfully. Now, you can login with new password.');    
      }
      else {
        showAlert('error', 'Network Error');
        }
    })
    .catch((error) => {
        console.log(error.status);
       console.log(error.response);
            showAlert('error', 'Network Error');
         
  });     
}

 
     return (
         <SafeAreaView style={styles.container}>
           <StatusBar backgroundColor="#FE6666" barStyle="light-content" />
           <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
           <View style={styles.header}>
             <Text style={styles.text_header}>Reset Password</Text>
           </View>
     
           <Animatable.View 
             animation="fadeInUpBig"
             style={styles.footer}
           >
           <ScrollView keyboardShouldPersistTaps="handled">
           <Text style={[styles.text_footer, {marginTop: 35}]}>New Password</Text>
            <View style={styles.action}>
                <Feather
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput
                    placeholder="Your Password"
                    secureTextEntry={secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => {
                    setPassword(val);
                    if (val.match(password_regex))
                        setValidPassword(true);
                    else
                        setValidPassword(false);
                    }}
                    maxLength={50}
                    value={password}
                />
                <TouchableOpacity
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                {secureTextEntry ?
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
                {(password.length > 0 && !validPassword) ?
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
                secureTextEntry={confirmSecureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setConfirmPassword(val)}
              />
              <TouchableOpacity
                onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
              >
                {confirmSecureTextEntry ?
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
            {(confirmPassword.length > 0 && password != confirmPassword) ?
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Password and confirm password must match.</Text>
                </Animatable.View>
            : null
            }


            <View style={styles.button}>
                 <TouchableOpacity
                   onPress={() => { ResetPasswordHandler() }}
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
 
            <TouchableOpacity style={styles.linkStyle} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={{ color: '#B5C7DF', marginTop: 25,fontWeight: 'bold',fontSize: 16, textDecorationLine: 'underline' }}>Sign In</Text>
            </TouchableOpacity>
            
             </ScrollView>
           </Animatable.View>
         </SafeAreaView>
       );
     }
     
 export default ResetPasswordScreen;
 
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
     },
     linkStyle: {
        alignItems: 'center',

      },
  
   });
 
 