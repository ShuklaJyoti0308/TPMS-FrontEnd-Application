import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    StatusBar,
    SafeAreaView,
    Alert,
    ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';
import { baseurl } from '../config';
import { AuthContext } from '../components/context';

const LoginScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    userName: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true
  });
  const [loading, setLoading] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);

  const textInputChange = (val) => {
    if(val.length !== 0)
    {
      setData({
        ...data,
        userName: val,
        check_textInputChange: true
      })
    }
    else{
      setData({
        ...data,
        userName: val,
        check_textInputChange: false
      })
    }
  }

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val
    })
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const handleSignIn = () => {
    if ( data.userName.length == 0 || data.password.length == 0 ) {
      showAlert('Wrong Input!', 'Username or Password field cannot be empty.');
      return;
    }

    setLoading(true);
    const reqDate = {
      userName: data.userName,
      password: data.password
    };

    axios.post(baseurl + '/authenticate', reqDate)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        if(response.status == 200)
        {
          console.log(response.data);
          showAlert('Login Success', 'Welcome ' + data.userName);
          signIn(response.data.id, response.data.userName, response.data.role, response.data.jwtToken);
        }
       
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          const response = error.response;
          if (response.status == 400 || response.status == 401) {
              showAlert('warning', 'Login Failed');
          } else {
              showAlert('error', 'Network Error');
          }
      } else {
          showAlert('error', 'Network Error');
      }
      });

  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FE6666" barStyle="light-content" />
      <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
      <View style={styles.header}>
        <Text style={styles.text_header}>WELCOME TO TPMS..!</Text>
      </View>

      <Animatable.View 
        animation="fadeInUpBig"
        style={styles.footer}
      >
      <ScrollView>
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
            onChangeText={(val) => textInputChange(val)}
           />
           {data.check_textInputChange ?
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

        <Text style={[styles.text_footer,{marginTop: 35}]}>Password</Text>
        <View style={styles.action}>
          <FontAwesome
            name="lock"
            color="#000000"
            size={18}
          />
          <TextInput
            placeholder="Your Password"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <TouchableOpacity
            onPress={updateSecureTextEntry}
          >
            {data.secureTextEntry ?
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

        <View style={styles.button}>
            <TouchableOpacity
              onPress={handleSignIn}
              style={[styles.signIn, {
                borderColor: '#FE6666',
                borderWidth: 2,
                marginTop: 10
                }]}
            >
            <Text style={[styles.textSign, {
              color: '#FE6666'
            }]}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkStyle} onPress={() => navigation.navigate('RegistrationScreen')}>
              <Text style={{ color: '#FE6666', marginTop: 15, fontSize: 16, textDecorationLine: 'underline' }}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

        </View> 

        <View style={{ marginTop: 1000 }}></View>
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
}

export default LoginScreen;

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
        //marginTop:-12,
        paddingLeft: 10,
        color: '#000000',
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
    },
    linkStyle: {
      marginTop: 20
    }
  });