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
//import DocumentPicker from 'react-native-document-picker';
import {
  Dropdown
} from 'sharingan-rn-modal-dropdown';
import CheckBox from 'react-native-check-box';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';


const PassScreen = ({navigation}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [dob, setDob] = useState('');
    const [phyAddLine1, setPhyAddLine1] = useState('');
    const [phyAddLine2, setPhyAddLine2] = useState('');
    const [phyCity, setPhyCity] = useState('');
    const [phyZipCode, setPhyZipCode] = useState('');
    const [postalAddLine1, setPostalAddLine1] = useState('');
    const [postalAddLine2, setPostalAddLine2] = useState('');
    const [postalCity, setPostalCity] = useState('');
    const [postalZipCode, setPostalZipCode] = useState('');

    const [memberTypeData, setMemberTypeData] = useState([]);
    const [memberTypeId, setMemberTypeId] = useState(0);
    const [documentData, setDocumentData] = useState([]);
    const [documentId, setDocumentId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    // const [open, setOpen] = useState(false);
    // const [value, setValue] = useState(null);
    // const [items, setItems] = useState([
    //   {label: 'Student', value: 'Student'},
    //   {label: 'Kid', value: 'Kid'},
    //   {label: 'Senior Citizen', value: 'Senior Citizen'}
    // ]);


    // const [docOpen, setDocOpen] = useState(false);
    // const [docValue, setDocValue] = useState(null);
    // const [docItems, setDocItems] = useState([
    //   {label: 'Bonafide Certificate', value: 'Bonafide Certificate'},
    //   {label: 'Aadhar Card', value: 'Aadhar Card'}
    // ]);
    
   
  
  useEffect(async() => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    displayMemberType(token);
  }, []);  

  const displayMemberType = (token) => {
    console.log('Token : ' + token);
    const headers = { 'Authorization': 'Bearer ' + token }
    axios.get(baseurl + '/member-types', { headers })
      .then(response => {
        console.log(response.data);
      })
  }
  const onChangeMemberType = (value) => {
    setMemberTypeId(value);
};
  return (
      <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FE6666" barStyle="light-content" />

        {/* <View style={styles.header}>
          <Text style={styles.text_header}>Pass Request</Text>
        </View> */}
  
        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
        <ScrollView keyboardShouldPersistTaps='handled'>

        <Text style={[styles.text_footer, { marginTop:10 }]}>First Name</Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Your First Name"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => setFirstName(val)}
              value={firstName}
              maxLength={50}
             />
            {(firstName != '') ?
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
          
          <Text style={[styles.text_footer, { marginTop:20 }]}>Last Name</Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Your First Name"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => setLastName(val)}
              value={lastName}
              maxLength={50}
             />
            {(lastName != '') ?
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
          

          <Text style={[styles.text_footer, { marginTop:20 }]}>Mobile Number</Text>
          <View style={styles.action}>
            <FontAwesome
              name="mobile"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Your Mobile Number"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setMobileNo(val)}}
              value={mobileNo}
              keyboardType="number-pad"
              maxLength={15}
             />
          </View>

          <Text style={[styles.text_footer, { marginTop:20 }]}>Date of Birth</Text>
          <View style={styles.action}>
            {/* <FontAwesome
              name="calendar"
              color="#000000"
              size={20}
            /> */}
            {/* <DatePicker
              style={{width: 200}}
              mode="date"
              date={dob}
              format="YYYY-MM-DD"
              placeholder="Select Date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
                },
                dateInput: {
                marginLeft: 36
                }
              }}
              onDateChange={(date) => setDob(date)}
              value={dob}
            />  */}
          </View>

          <Text style={[styles.text_footer, { marginTop:20 }]}>Physical Address</Text>
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Line 1"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPhyAddLine1(val)}}
              value={phyAddLine1}
              maxLength={50}
             />
             {(phyAddLine1 != '') ?
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
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Line 2"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPhyAddLine2(val)}}
              value={phyAddLine2}
              maxLength={50}
             />
             {(phyAddLine2 != '') ?
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
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Zip Code"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPhyZipCode(val)}}
              value={phyZipCode}
              keyboardType="number-pad"
              maxLength={6}
             />
             {(phyZipCode != '') ?
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
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="City"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPhyCity(val)}}
              value={phyCity}
              maxLength={30}
             />
             {(phyCity != '') ?
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

          <Text style={[styles.text_footer, { marginTop:20}]}>Postal Address </Text>
          <CheckBox
            style={{
              flex: 1,
              paddingTop:5
            }}
            onClick={(val)=>{console.log(val)}}
            rightText={"Same as Physical"}
          />
         
          
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Line 1"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPostalAddLine1(val)}}
              value={postalAddLine1}
              maxLength={50}
             />
             {(postalAddLine1 != '') ?
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
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Line 2"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPostalAddLine2(val)}}
              value={postalAddLine2}
              maxLength={50}
            />
            {(postalAddLine2 != '') ?
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
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="Zip Code"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPostalZipCode(val)}}
              value={postalZipCode}
              keyboardType="number-pad"
              maxLength={6}
             />
             {(postalZipCode != '') ?
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
          <View style={styles.action}>
            <FontAwesome
              name="address-book-o"
              color="#000000"
              size={20}
            />
            <TextInput
              placeholder="City"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {setPostalCity(val)}}
              value={postalCity}
              maxLength={30}
            />
            {(postalCity != '') ?
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

          
          <Text style={[styles.text_footer, { marginTop:25 }]}>User Type</Text>
          <View style={styles.action}>
            <Dropdown
              label="Select User Type"
              data={memberTypeData}
              enableSearch
              value={memberTypeId}
              onChange={onChangeMemberType}
            />
          </View>

          {/* <Text style={[styles.text_footer, { marginTop:25 }]}>Documents</Text>
          <View style={styles.action}>
            <Dropdown
              label="Select Documents "
              data={docData}
              enableSearch
              // value={docId}
              // onChange={onMemberTypeSS}
            />
          </View> */}
       

          <View style={styles.button}></View>
          <Button
          title="Send"
          //onPress={() => {}}
          color="#FE6666"
          />
          <View style={{ marginTop: 500 }}></View>
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default PassScreen;

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
  }

});

