import * as React from 'react';
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
  Alert  
} from 'react-native';
import {
  Dropdown
} from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';

const PackageScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FE6666" barStyle="light-content" />

        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
        <ScrollView keyboardShouldPersistTaps='handled'> 
          
          <Text style={[styles.text_footer, { marginTop:25 }]}>Transport Mode</Text>
            <View style={styles.action}>
              <Dropdown
                label="Select Transport Mode"
                //data={memberTypeData}
                enableSearch
                //value={memberTypeId}
                //onChange={onChangeMemberType}
              />
            </View>

          <Text style={[styles.text_footer, { marginTop:25 }]}>Package</Text>
            <View style={styles.action}>
              <Dropdown
                  label="Select Package"
                  //data={memberTypeData}
                  enableSearch
                  //value={memberTypeId}
                  //onChange={onChangeMemberType}
                />
            </View>

          <Text style={[styles.text_footer, { marginTop:10 }]}>Validity</Text>
            <View style={styles.action}>
              <FontAwesome
                name="calendar"
                color="#000000"
                size={20}
              />
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                // onChangeText={(val) => setFirstName(val)}
                // value={firstName}
                maxLength={50}
              />
            {/* {(firstName != '') ?
              <Animatable.View
                animation="bounceIn">
              <Feather
                name="check-circle"
                size={20}
                color="grey"
              />  
              </Animatable.View>
              : null} */}
            </View>
          
          <Text style={[styles.text_footer, { marginTop:10 }]}>Price</Text>
            <View style={styles.action}>
            <FontAwesome
              name="money"
              color="#000000"
              size={20}
            />
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                // onChangeText={(val) => setFirstName(val)}
                // value={firstName}
                maxLength={50}
              />
            {/* {(firstName != '') ?
              <Animatable.View
                animation="bounceIn">
              <Feather
                name="check-circle"
                size={20}
                color="grey"
              />  
              </Animatable.View>
              : null} */}
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
          
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>

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
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
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





