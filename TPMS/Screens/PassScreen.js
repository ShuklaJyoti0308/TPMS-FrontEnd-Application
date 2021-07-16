import React, {useState, useEffect} from 'react';
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
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Checkbox } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';
import { Avatar } from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import ViewPassScreen from './ViewPassScreen';

const PassScreen = ({navigation}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('Female');
    const [mobileNo, setMobileNo] = useState('');
    const [profileImage, setProfileImage] = useState('C:\JYOTI_INTERN\TPMS_Data');
    const [requestDate, setRequestDate] = useState('');
    

    const [dob, setDob] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [phyAddLine1, setPhyAddLine1] = useState('');
    const [phyAddLine2, setPhyAddLine2] = useState('');
    const [phyCity, setPhyCity] = useState('');
    const [phyZipCode, setPhyZipCode] = useState('');
    const [postalAddLine1, setPostalAddLine1] = useState('');
    const [postalAddLine2, setPostalAddLine2] = useState('');
    const [postalCity, setPostalCity] = useState('');
    const [postalZipCode, setPostalZipCode] = useState('');
    const [checked, setChecked] = React.useState(false);


    const [memberTypeData, setMemberTypeData] = useState([]);
    const [memberTypeId, setMemberTypeId] = useState(0);
    const [documentData, setDocumentData] = useState([]);
    const [data, setData] = useState([]);
    

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [memberId, setMemberId] = useState(0);
    const [userName, setUserName] = useState('');

    const [passRequest, setPassRequest]= useState(false);

    useEffect(async() => {
      const token = await AsyncStorage.getItem('jwtToken');
      setToken(token);
      let userId = await AsyncStorage.getItem('id');
      userId = parseInt(userId);
      console.log("User id :" + userId);
      setUserId(userId);

      displayPassStatus(userId, token);
      getUsername(userId,token);
      displayMemberType(token);

      var date = new Date() //Current Date
      let fDate=date.getDate() + "-" + parseInt(date.getMonth()+1) + "-" + date.getFullYear();
      var currentDate = moment().format('YYYY-MM-DD');
      console.log("current date:",currentDate)
      setRequestDate(currentDate);
      
    }, []);  

    const displayPassStatus = (userId, token) => {
      if(userId == 0)
      {
        return;
      }
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.get(baseurl + '/member/' + userId,{ headers })
        .then((response) => {
          console.log("res: ", response.status);
          console.log("Maintab res data : ", response.data);
          if(response.status == 200) {
              setPassRequest(true);  
          }  
          else
          {
            showAlert('error', 'Failed to show pass.');
          }  
          
        })
        .catch((error) => {
          console.log(error.response);
          //showAlert('error', 'Network Error.');
        });
    }
  
    const getUsername = (userId,token) => {
    
      const headers = { 'Authorization': 'Bearer ' + token }
      axios.get(baseurl + '/users/' + userId, { headers })
        .then((response) => {
        //console.log("res: ", response.status);
        console.log("username data  : ", response.data);
        if(response.status == 200) {
          console.log("username : ",response.data[0].userName);
          setUserName(response.data[0].userName); 
        }  
        else
        {
          showAlert('error', 'Network Error. Please try again...');
        }
        })
        .catch(error => {
          showAlert('error', 'Failed to get username.');
        })
    }
  
  
    const showAlert = (title, message) => {
      Alert.alert(title, message, [
        {text : 'Okay'},
        {text : 'Cancel'}
      ]);
    } 
  

    const openDocumentFile = async (proofId) => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        //console.log(res);
        //console.log("Before Select : ",documentData);
        if(validateImage(res)){
          let data = [...documentData];
          let proof = data.find((item) => item.proofId == proofId);
          proof.proofImage = res
          proof.proofPath = res.uri;
          proof.proofFileName = res.name; 
          proof.proofFileType = res.type;
          setDocumentData(data);
          //console.log("After File Select : ",documentData);
        }
       
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    const cancelDocumentFile = (proofId) => {
      //console.log(documentData)
      // way-1
      // let data = [...documentData];
      // let proof = data.find((item) => item.proofId == proofId);
      // proof.avatarPath = "";
      // proof.documentPicture = "";
      // setDocumentData(data);

      // way-2
      setDocumentData((previousData) => {
        let data = [...previousData];
        let proof = data.find((item) => item.proofId == proofId);
        proof.proofPath = "";
        proof.proofFileName = "";
        proof.proofFileType = "";
        proof.proofImage = ""
        return data;
      });
    };
    const validateImage = (image) => {
      let result = true;
      
      if (image.type != "image/jpeg" && image.type != "image/jpg" && image.type != "image/pdf") {
          result = false;
          showAlert('warning','Please select image of proper format. Only jpeg and pdf are allowed.');
         
      }
      
      return result;
  }


    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      setDob(date);
      hideDatePicker();
    };
    

  const displayMemberType = (token) => {
    
    const headers = { 'Authorization': 'Bearer ' + token }
    axios.get(baseurl + '/member-types', { headers })
      .then(response => {
        if (response.status == 200) {
          setData(response.data);
          let dt = response.data;
          //console.log(dt);
          let arr = [];
          for (let i = 0; i < dt.length; i++) {
            arr.push({
              value : dt[i].memberTypeId,
              label : dt[i].memberTypeName
            });
          }
          setMemberTypeData(arr);
        }
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch(error => {
        showAlert('error', 'Failed to get user types, Try after sometimes.');
      })
  }

  const displayDocument = (memberTypeId) => {
    setLoading(true);
    const headers = { 'Authorization': 'Bearer ' + token }
    axios.get(baseurl + '/proofs/member-types/' + memberTypeId , { headers })
      .then(response => {
        setLoading(false);
        
        if (response.status == 200) {
          //console.log(response.data);

          let dt = response.data;
          dt.forEach((item) => {
            // item.proofId = dt.proofId;
            // item.proofName = dt.proofName;
            item.proofPath = "";
            item.proofFileName = "";
            item.proofFileType = "";
            item.profileImage = "";
          });
          setDocumentData(dt);
        }
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch(error => {
        setLoading(false);
        showAlert('error', 'Failed to show documents to be upload, Try Again.');
      })
  }

  const onChangeMemberType = (value) => {
  console.log("id of Memebr Type :" , value);
    setMemberTypeId(value);
    displayDocument(value);
  };

  const handlePostalAddress = () => {
    setPostalAddLine1(phyAddLine1);
    setPostalAddLine2(phyAddLine2);
    setPostalZipCode(phyZipCode);
    setPostalCity(phyCity);
  }
 
  const clearPostalAddress = () => {
    setPostalAddLine1("");
    setPostalAddLine2("");
    setPostalZipCode("");
    setPostalCity("");
  }

  const passRequesthandler = () => {
    if ( firstName.length==0 ) {
      showAlert('Wrong Input!', 'Please enter first name to proceed.');
    }
    else if ( lastName.length==0 ) {
      showAlert('Wrong Input!', 'Please enter last name to proceed.');
    }
    else if ( gender.length==0 ) {
      showAlert('Wrong Input!', 'Please select gender to proceed.');
    }
    else if ( mobileNo.length<10 ) {
      showAlert('Wrong Input!', 'Please enter 10 digit valid mobile number proceed.');
    }
    else if ( dob == '' ) {
      showAlert('Wrong Input!', 'Please select date of birth to proceed.');
    }
    else if ( phyAddLine1.length==0 ) {
      showAlert('Wrong Input!', 'Please enter addline1 of permanent address to proceed.');
    }
    else if ( phyAddLine2.length==0 ) {
      showAlert('Wrong Input!', 'Please enter addline2 of permanent address to proceed.');
    }
    else if ( phyZipCode.length==0 ) {
      showAlert('Wrong Input!', 'Please enter zip code of permanent address to proceed.');
    }
    else if ( phyCity.length==0 ) {
      showAlert('Wrong Input!', 'Please enter city of permanent address to proceed.');
    }
    else if ( postalAddLine1.length==0 ) {
      showAlert('Wrong Input!', 'Please enter addline1 of postal address to proceed.');
    }
    else if ( postalAddLine2.length==0 ) {
      showAlert('Wrong Input!', 'Please enter addline2 of postal address to proceed.');
    }
    else if ( postalZipCode.length==0 ) {
      showAlert('Wrong Input!', 'Please enter zip code of postal address to proceed.');
    }
    else if ( postalCity.length==0 ) {
      showAlert('Wrong Input!', 'Please enter city of postal address to proceed.');
    }
     else if ( memberTypeId==0 ) {
       showAlert('Wrong Input!', 'Please select user type to proceed.');
     }
    else
    {
      setLoading(true);
      

      console.log("request date : ",requestDate);
      const reqData = {
        userId: userId,
        memberTypeId: memberTypeId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        mobileNo: mobileNo,
        dob: dob,
        profileImage: profileImage,
        requestDate: requestDate
      };

      const headers = { 'Authorization': 'Bearer ' + token }

      axios.post(baseurl + '/members', reqData, { headers })
        .then((response) => {
          console.log(response.status)
          if(response.status == 201) {
            let memberId = response.data.memberId
            console.log("Record inserted in Member Table of id :", memberId);

            //Call address api to insert user's address

            const requestData = {
              memberId: memberId,
              addLine1: phyAddLine1,
              addLine2: phyAddLine2,
              city: phyCity,
              zipCode: phyZipCode,
              postalAddLine1: postalAddLine1,
              postalAddLine2: postalAddLine2,
              postalCity: postalCity,
              postalZipCode: postalZipCode,
            };
            //console.log(requestData);
               
            axios.post(baseurl + '/member/member-address', requestData, { headers })
              .then((response ) => {
                //console.log("status : ",response.status)
                if(response.status == 201) {
                  console.log("Record inserted in Address Table.");
                console.log("Document data : ",documentData);
                documentData.forEach((item) => {

                    const formData = new FormData();
                    formData.append('proofId',item.proofId);
                    formData.append('memberId',memberId);

                    console.log("path :" , item.proofPath);
                    console.log(" name ",item.proofFileName);
                    console.log("type :",item.proofFileType);

                    formData.append('proofImage', item.proofImage);

                
                    console.log("formdata : ");
                    console.log(formData._parts[1][1]);

                    console.log(formData);

                    const headers = { 
                      'Content-Type': 'multipart/form-data',
                      'Authorization': 'Bearer ' + token }

                    axios.post(baseurl + '/member-proofs', formData, { headers })
                      .then((response) => {

                      if (response.status == 201) {
                            const headers = { 
                            'Content-Type': 'text/plain',
                            'Authorization': 'Bearer ' + token }
                          axios.post(baseurl + '/pass-request-email', userName, { headers })
                            .then((response) => {
                              setLoading(false);
                              console.log("status code of mail success:",response.status);
                              if(response.status == 200) {
                                showAlert('Pass Request Success', 'Your Pass request has been placed successfully. You will receive an email from TPMS team after approval of pass request');
                                setPassRequest(true);
                              }
                            })
                            .catch((error) => {
                              console.log(error);
                              console.log(error.response);
                              showAlert('error','Failed to send mail');  
                          });

                      } else {
                          showSweetAlert('error', 'Network Error', errorMessage);
                      }
                      
                      })
                      .catch((error) => {
                        setLoading(false);
                        console.log(error);
                        console.log(error.response);
                        showAlert('error','Failed to add proof details of user. Please try again...');  
                    });
                  });
                  
                }
                else{
                  showAlert('Network Error', 'Oops! Something went wrong. Please try again later.');
                }
              setPhyAddLine1(''); 
              setPhyAddLine2(''); 
              setPhyZipCode('');
              setPhyCity(''); 
              setPostalAddLine1(''); 
              setPostalAddLine2(''); 
              setPostalZipCode('');
              setPostalCity('');  
            })
            .catch((error) => {
              setLoading(false);
              showAlert('error','Failed to add address details of user. Please try again...');  
            });
          }
          else
          {
            showAlert('Network Error','Something went wrong Please Try Again.');  
          }
          setUserId(0);
          setMemberTypeId(0);
          setFirstName('');
          setLastName('');
          setGender('female');
          setMobileNo('');
          setDob('');
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          console.log(error.response);
          showAlert('Error','Failed to add user personal detail. Please try again...');

      })

    }
  }

  // console.log('documentData in render');
  // console.log(documentData);
  if(passRequest==true){
    return <ViewPassScreen />
  }
  return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />  
          <View style={styles.container}>    
          <StatusBar backgroundColor="#FE6666" barStyle="light-content" /> 
        
          <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
          >
        
            <Text style={[styles.text_footer, { marginTop:5 }]}>First Name</Text>
              <View style={styles.action}>
                <FontAwesome
                  name="user-o"
                  color="#FE6666"
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
                  color="#FE6666"
                  size={20}
                />
                <TextInput
                  placeholder="Your Last Name"
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

              <Text style={[styles.text_footer, { marginTop:20 }]}>Gender</Text>
              <View style={styles.action}>
                <RadioButton
                    value="Female"
                    label="Female"
                    status={ gender === 'Female' ? 'checked' : 'unchecked' }
                    onPress={() => setGender('Female')}
                    
                  />
                  <Text style={{fontSize:16, marginTop:-5, padding:10}}>Female</Text>
                <RadioButton
                    value="Male"
                    label="Male"
                    status={ gender === 'Male' ? 'checked' : 'unchecked' }
                    onPress={() => setGender('Male')}
                />
                <Text style={{fontSize:16, marginTop:-5, padding:10}}>Male</Text>
              </View>
          

              <Text style={[styles.text_footer, { marginTop:20 }]}>Mobile Number</Text>
              <View style={styles.action}>
                <FontAwesome
                  name="mobile"
                  color="#FE6666"
                  size={25}
                />
                <TextInput
                  placeholder="Your Mobile Number"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => {setMobileNo(val)}}
                  value={mobileNo}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>

              <Text style={[styles.text_footer, { marginTop: 20 }]}>Date of Birth</Text>
                <View style={styles.action}>
                  <TextInput
                    placeholder="Date"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setDob(val)}
                    value={dob + ""}
                    maxLength={20}
                  />
                  <TouchableOpacity onPress={showDatePicker}>
                    <Animatable.View
                      animation="bounceIn"
                    >
                      <Feather
                        name="calendar"
                        color="#FE6666"
                        size={25}
                      />
                    </Animatable.View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date" 
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>
                

                <Text style={[styles.text_footer, { marginTop:20 }]}>Permanent Address</Text>
                <View style={styles.action}>
                  <FontAwesome
                    name="address-book-o"
                    color="#FE6666"
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
                    color="#FE6666"
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
                    color="#FE6666"
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
                    color="#FE6666"
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
                <Checkbox.Item
                  status={checked ? 'checked' : 'unchecked'}
                  color="#FE6666"
                  uncheckedColor="#bdc4ca"
                  label="Same As Permanent Address"
                  onPress={() => {
                    setChecked(!checked);
                    console.log(checked);
                    if(!checked){ handlePostalAddress(); }
                    else{ clearPostalAddress(); }
                    
                  }}
                />
          
                <View style={styles.action}>
                  <FontAwesome
                    name="address-book-o"
                    color="#FE6666"
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
                    color="#FE6666"
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
                    color="#FE6666"
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
                    color="#FE6666"
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

                <Text style={[styles.text_footer, { marginTop:25 }]}>Upload Documents</Text>
                
                  {
                    documentData && documentData.map((item, index) => {
                      return(
                        <View style={[styles.cardlist]} key={item.proofId} >
                        <Text style={[styles.carditem, { width: '100%'}]}>{item.proofName}
                        {
                          item.proofPath != '' && 
                          (
                            <Avatar
                              size={40}
                              source={{
                                uri: item.proofPath
                              }}
                              icon={{name: 'file', color: '#FE6666', type: 'font-awesome'}}
                              activeOpacity={0.7}
                            />
                          ) 
                          
                        }
                          <TouchableOpacity 
                            style={{paddingTop: 10}}
                            onPress={ () => openDocumentFile(item.proofId)}
                          >             
                            <Animatable.View
                              animation="bounceIn"
                              >
                              <Feather
                                name="image"
                                color="#FE6666"
                                size={25}
                              />
                            </Animatable.View>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={{paddingTop: 10}}
                            onPress={ () => cancelDocumentFile(item.proofId) }  
                          >
                            <Animatable.View
                              animation="bounceIn"
                            >
                              <Feather
                                name="x-square"
                                color="#FE6666"
                                size={25}
                              />
                            </Animatable.View>
                          </TouchableOpacity>
                        
                        </Text>
                        </View> 
                      )
                    })
                  }
                  
                <View style={{ marginTop: 50 }}></View>

                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={passRequesthandler}
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
            
              <View style={{ marginTop: 10 }}></View>
        
            </Animatable.View>
          </View>
        </ScrollView>
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
      fontSize: 16,
      fontWeight: 'bold'
  },
  action: {
      flexDirection: 'row',
      marginTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
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
  },
  cardlist: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10
  },
  carditem: {
    backgroundColor: '#eeeff1',
    paddingLeft: 20,
    paddingBottom: 20,
    fontSize:16,
   
  } 

});

