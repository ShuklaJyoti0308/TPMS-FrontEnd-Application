import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  ScrollView, 
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert  
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';


const Tab = createMaterialTopTabNavigator();

function ViewPackages(){
  const [data, setData] = useState([]);
  const [memberTypeData, setMemberTypeData] = useState([]);
  const [memberTypeId,setMemberTypeId] = useState(0);

  const [packageData, setPackageData] = useState([]);
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    // let userId = await AsyncStorage.getItem('id');
    // userId = parseInt(userId);
    displayTransportMode(token);
    displayMemberType(token);
    
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
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        }
        else {
          showAlert('error', 'Network Error.');
        }
        console.log("trans :",data);
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Failed to get transport mode.');
      })
  }
  const displayMemberType = (token) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/member-types', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setMemberTypeData(response.data);
        }
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Failed to get pac.');
      })
  }

  const getPackageByTransportMode = (name) => {
    const headers = {'Authorization': 'Bearer ' + token};
    axios.get(baseurl + '/member-packages/memberId/' + memberTypeId, { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          console.log("package data : ", response.data);
          //setPackageData(response.data);
          let dt=response.data
          const filteredPkgData = dt.filter(function (item){
            return item.transportMode==name;
          });
          console.log("After filter",filteredPkgData);
          if(filteredPkgData=='')
          {
            showAlert('Information', 'There is no any packages for selected transport mode');
          }
          else{
            setPackageData(filteredPkgData);
          }
        }  
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Failed to get package of selected transport mode');
      })
    };
  const getPackageByMemberType = (memberTypeId) => {
    setMemberTypeId(memberTypeId);
    console.log("member type :", memberTypeId);
  }

  return (
    
    <ScrollView keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
    {/* <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} /> */}
    <View style={styles.container}>
      <StatusBar  backgroundColor="#FE6666" barStyle="light-content" />  
        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
        {loading == true && (<ActivityIndicator size="large" color="#bdc4ca" />)}

        <View style={styles.btnContainer}>
          {
            memberTypeData && memberTypeData.map((item, index)=> (
              <View style={styles.button}>  
                <TouchableOpacity
                  key={item.memberTypeId}
                  onPress={ () => getPackageByMemberType(item.memberTypeId) }
                  style={styles.memberType}
                  >
                  <Text style={[styles.mTypetext, {
                    color: '#000000'
                  }]}>{item.memberTypeName}</Text>
                </TouchableOpacity>  
              </View> 
            ))
          }
        </View>
        <View
          style={{
            marginTop:20,
            borderBottomColor: '#C5DAF0',
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.btnContainer}>
          {
            data && data.map((item, index)=> (
              <View style={styles.button}>  
                <TouchableOpacity
                  key={item.id}
                  onPress={ () => getPackageByTransportMode(item.name) }
                  style={styles.mode}
                  >
                  <Text style={styles.modetext}>{item.name}</Text>
                </TouchableOpacity>  
              </View> 
            ))
          }
        </View>


        {
          packageData && packageData.map((item, index) => (
            <View>
            <View style={{ backgroundColor:'#ff8000', padding:10, width:'50%',borderRadius:100,position:'relative',left:80,top:35 }}>
                <Text style={styles.Tmodetext}>{item.transportMode}</Text>
            </View>
            <View style={styles.rect}>
              <View style={{ backgroundColor:'#EBF5FA', padding:15, borderTopLeftRadius:10,borderTopRightRadius:10 }}>
                <Text style={styles.package}>{item.name}</Text>
              </View>
              
                <View style={{display: "flex", flexDirection: 'row', }}>
                  <View style={styles.pkgPrice}>
                    <View style={{display: "flex", flexDirection: 'row'}}>
                      <Icon name="currency-inr" color="#000000" size={25} />
                      <Text style={styles.amount}>{item.price}</Text>
                    </View>  
                    <Text style={{fontSize: 14,marginLeft:8,fontWeight:'bold' }}>{item.discountPercentage} % off</Text>
                  </View>
            
                  <View style={styles.pkgValidity}>
                    <Text style={styles.day}>{item.validity} Days</Text>
                    <Text style={{fontSize: 15 }}>Validity</Text>
                  </View>
                  
                </View>
                <View style={{ height: 30, marginBottom: 10}}>
                  <Text style={{textAlign: 'center', fontSize: 16 }}>Subscription</Text>
                  <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{item.subscriptionType}</Text>
                </View> 
            </View> 
          </View>

          ))
        }

        
        </Animatable.View>
      </View>
    </ScrollView>
  );

}

function BuyPackages({navigation}){

  const [data, setData] = useState([]);
  const [memberTypeData, setMemberTypeData] = useState([]);
  const [memberTypeId,setMemberTypeId] = useState(0);
  const [memberId,setMemberId] = useState(0);
  const [passNo, setPassNo] = useState('');

  const [packageData, setPackageData] = useState([]);
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    let userId = await AsyncStorage.getItem('id');
    userId = parseInt(userId);
    displayTransportMode(token);
    packageEligibility(userId, token);
    
  },[refreshing]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  },[]);

  const packageEligibility = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/member/' + userId,{ headers })
      .then((response) => {
        
        if(response.status == 200) {
          if(response.data[0].status==1){
            setMemberTypeId(response.data[0].memberTypeId);
            setMemberId(response.data[0].memberId);
            console.log("Pass status : ",response.data[0].status);

            axios.get(baseurl + '/passes/member/' + memberId, { headers })
              .then((response) => {
                setLoading(false);
                setRefreshing(false);
                if(response.status == 200)
                {
                    console.log("Pass Detail : ", response.data);
                    setPassNo(response.data[0].serialNo)
                }
                else {
                  showAlert('error', 'Network Error.');
                }  
              })
              .catch((error) => {
                setLoading(false);
                setRefreshing(false);
                showAlert('Error','Failed to find pass number of logged in user');
              });  
          }
          else
          {
            showAlert('Information', 'You are not eligible to buy any package. You should have to request for pass.');
          }
        }
        else {
          showAlert('error', 'Network Error.');
        }  
        
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showAlert('Error','Failed to find member type of logged in user');
      });  
  }
  
  const displayTransportMode = (token) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/transport-modes', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        }
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch(error => {
        setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Failed to get transport mode.');
      })
  }


  const getPackageByTransportMode = (name) => {
    const headers = {'Authorization': 'Bearer ' + token};
    axios.get(baseurl + '/member-packages/memberId/' + memberTypeId, { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          console.log("package data : ", response.data);
          let dt=response.data
          const filteredPkgData = dt.filter(function (item){
            return item.transportMode==name;
          });
          console.log("After filter",filteredPkgData);
          if(filteredPkgData=='')
          {
            showAlert('Information', 'There is no any packages for selected transport mode');
          }
          else{
            setPackageData(filteredPkgData);
          }
        }  
        else {
          showAlert('error', 'Network Error.');
        }
      })
      .catch(error => {
        setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Failed to get package of selected transport mode');
      })
    };

  // const getPackageByMemberType = (memberTypeId) => {
  //   setMemberTypeId(memberTypeId);
  //   console.log("member type :", memberTypeId);
  // }


  return (
    
    <ScrollView keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
    {/* <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} /> */}
    <View style={styles.container}>
      <StatusBar  backgroundColor="#FE6666" barStyle="light-content" />  
        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
       
        {loading == true && (<ActivityIndicator size="large" color="#bdc4ca" />)}

        <View style={styles.btnContainer}>
          {
            data && data.map((item, index)=> (
              <View style={styles.button}>  
                <TouchableOpacity
                  key={item.id}
                  onPress={ () => getPackageByTransportMode(item.name) }
                  style={styles.mode}
                  >
                  <Text style={styles.modetext}>{item.name}</Text>
                </TouchableOpacity>  
              </View> 
            ))
          }
        </View>

        <View
          style={{
            marginTop:20,
            borderBottomColor: '#C5DAF0',
            borderBottomWidth: 1,
          }}
        />

        {
          packageData && packageData.map((item, index) => (
            
            <View style={styles.rect}>
              <View style={{ backgroundColor:'#EBF5FA', padding:15, borderTopLeftRadius:10,borderTopRightRadius:10 }}>
                <Text style={styles.package}>{item.name}</Text>
              </View>
              
                <View style={{display: "flex", flexDirection: 'row', }}>
                  <View style={styles.pkgPrice}>
                    <View style={{display: "flex", flexDirection: 'row'}}>
                      <Icon name="currency-inr" color="#000000" size={25} />
                      <Text style={styles.amount}>{item.price}</Text>
                    </View>  
                    <Text style={{fontSize: 14,marginLeft:8,fontWeight:'bold' }}>{item.discountPercentage} % off</Text>
                  </View>
            
                  <View style={styles.pkgValidity}>
                    <Text style={styles.day}>{item.validity} Days</Text>
                    <Text style={{fontSize: 15 }}>Validity</Text>
                  </View>
                  
                </View>

                <View style={{marginBottom: 10,display: "flex", flexDirection: 'row' }}>
                  <View style={{padding:8}}>
                    <Text style={{fontSize: 14}}>Transport Mode : {item.transportMode}</Text>
                    <Text style={{fontSize: 14 }}>Pass No. {passNo}</Text>
                  </View>  
                  <View>
                  <TouchableOpacity
                    //onPress={handleSignUp}
                    style={[styles.buy]}>
                  <Text style={[styles.textBuy]}>Pay <Icon name="currency-inr" color="#000000" size={18} />{item.price-((item.price*item.discountPercentage)/100)} </Text>
                  </TouchableOpacity>
                  </View>
                </View> 

            </View> 
      
          ))
        }
  
          
        </Animatable.View>
      </View>
    </ScrollView>
  );


}

const PackageScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="View Packages" component={ViewPackages} />
      <Tab.Screen name="Buy Package" component={BuyPackages} />
    </Tab.Navigator>
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
      paddingHorizontal: 10,
      paddingVertical: 10
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
    marginTop: 10,
    
  },
  button: {
    flex: 1
  },
  memberType: {
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#EBF2FA',
    marginTop: 10,
  },
  mTypetext: {
    fontWeight: 'bold',
    fontFamily: "roboto-regular",
    color: "#000000",
    fontSize: 14,
    textAlign: "center"
  },
  mode: {
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, 
    backgroundColor: '#ACC4E0',
    marginTop: 10,
  },
  modetext: {
    fontWeight: 'bold',
    fontFamily: "roboto-regular",
    color: "#000000",
    fontSize: 14,
    textAlign: "center"
  },
  rect: {
    width: '90%',
    height: 200,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius:10,
    borderColor: '#B7CADC',
    marginTop:30,
    marginLeft: 15,
   
  },
  Tmodetext:{
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  package: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center",
    fontWeight: 'bold'
  },

  pkgPrice: {
    height: 70,
    width: '30%',
    marginTop: 15,
    marginLeft: 10,
    // alignSelf: "flex-start"
    // flex: 4
  },
  amount: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    fontWeight: "bold"
  },
  pkgValidity: {
    //display: 'flex',
    //flexDirection: "row",
    marginTop: 10,
    marginLeft: 110,
  
  },
  day: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginRight: 10,
    fontWeight: "bold"
  },
  buy: {
    padding:15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ff8000',
    borderRadius:5,
    marginLeft:15
  },
  textBuy: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'#000000'
  }
});





