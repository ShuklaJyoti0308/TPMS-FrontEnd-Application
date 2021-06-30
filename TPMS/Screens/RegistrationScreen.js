import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    TextInput,
    Button,
    Platform,
    StatusBar,
    ScrollView, 
    SafeAreaView,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import {baseurl} from '../config';

const RegistrationScreen = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = useState(false);
  const [valid, setValid] = useState(false);

  const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;
  const username_regex = /^[a-zA-Z]+$/;

//   const showAlert = (status, title, msg) => {
//     SweetAlert.showAlertWithOptions({
//             title: title,
//             subTitle: msg,
//             confirmButtonTitle: 'OK',
//             confirmButtonColor: '#000',
//             style: status,
//             cancellable: true
//         },
//         () => {
//             setLoading(false);
//             if(success == true){
//                 setSuccess(false);
//                 navigation.goBack();
//             }
//         }
//     );
// }
const showAlert = (title, message) => {
  Alert.alert(title, message, [
    {text: 'Okay'}
  ]);
}

  const handleSignUp = () => {
    console.log('Sign-Up');
    if (!validEmail){
      showAlert('Invalid Input', 'Please enter valid email Id.');
    }
    else if(userName.length < 6){
      showAlert('Invalid Input', 'Please enter valid Username.');
    }
    else if(!validPassword){
      showAlert('Invalid Input', 'Please enter valid Password.');
    }
    else if(confirmPassword.length == 0){
      showAlert('Invalid Input', 'Please enter confirm password.');
    }
    else if(password != confirmPassword){
      showAlert('Invalid Input', 'Password and confirm password didn\'t match.');
    }
    else{
      setLoading(true);

      const reqDate = {
        userName: userName,
        password: password,
        email: email,
        role: "USER"
      };

      axios.post(baseurl+'/register', reqDate)
      .then((response) => {
        console.log(response.status);
          setLoading(false);
          if(response.status==200)
          {
            showAlert('Registration Success', 'You are registered successfully..!');
            //setSuccess(true);
            navigation.navigate('LoginScreen');
          }
          else{
            showAlert('Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
          }
      })
      .catch((error) => {
        //console.log(error);
        //console.log(error.response.data);
        setLoading(false);
        showAlert('Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FE6666" barStyle="light-content" />
      <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now.!</Text>
      </View>

      <Animatable.View 
        animation="fadeInUpBig"
        style={styles.footer}
      >
        <ScrollView keyboardShouldPersistTaps='handled'>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome
            name="envelope-square"
            color="#000000"
            size={20}
          />
          <TextInput
            placeholder="Your Email Address"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => {
              setEmail(val);
              if(val.match(email_regex))
                setValidEmail(true);
              else
                setValidEmail(false);
            }}
            keyboardType="email-address"
            maxLength={50}
           />
           {validEmail ?
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

        <Text style={[styles.text_footer,{marginTop: 30}]}>Username</Text>
        <View style={styles.action}>
          <FontAwesome
            name="user-plus"
            color="#000000"
            size={20}
          />
          <TextInput
            placeholder="Your Username"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => setUserName(val)}
            maxLength={50}
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
        { (userName.length > 0 && userName.length < 6) ? 
          <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>Username must be 6 characters long.</Text>
          </Animatable.View> 
          : null
        }

        <Text style={[styles.text_footer,{marginTop: 30}]}>Password</Text>
        <View style={styles.action}>
          <FontAwesome
            name="lock"
            color="#000000"
            size={18}
          />
          <TextInput
            placeholder="Your Password"
            secureTextEntry={secureTextEntry ? true : false}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => {
              setPassword(val);
              if(val.match(password_regex))
                setValidPassword(true);
              else
                setValidPassword(false);  
            }}
            maxLength={50}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            {secureTextEntry ?
            <Feather
              name="eye-off"
              size={20}
              color="grey"
            /> 
            :
            <Feather
              name="eye"
              size={20}
              color="grey"
            /> 
            }
          </TouchableOpacity>   
        </View>
        { (password.length > 0 && !validPassword) ? 
          <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>Password must contain at least one number,special character, uppercase letter, lowercase letter and at least 8 or more characters.</Text>
          </Animatable.View>
          : null
        }

        <Text style={[styles.text_footer,{marginTop: 30}]}>Confirm Password</Text>
        <View style={styles.action}>
          <FontAwesome
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
            maxLength={50}
          />
          <TouchableOpacity
              onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
          >
            {confirmSecureTextEntry ?
            <Feather
              name="eye-off"
              size={20}
              color="grey"
            /> 
            :
            <Feather
              name="eye"
              size={20}
              color="grey"
            /> 
            }
          </TouchableOpacity>   
        </View>
        { (confirmPassword.length > 0 && password != confirmPassword) ?
          <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>Password and Confirm Password should be same.</Text>
          </Animatable.View>
          : null
        }

        <View style={styles.button}></View>
          <Button
          title="Sign Up"
          onPress={() => {handleSignUp()}}
          color="#FE6666"
          />
        

        <View style={styles.button}></View>
        <Button
          title="Sign In"
          onPress={() => navigation.goBack()}
          color="#FE6666"
          />
        </ScrollView>  
      </Animatable.View>
    </SafeAreaView>
    
  );
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#FE6666'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50   
      },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22
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
        color: '#000000'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 40
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