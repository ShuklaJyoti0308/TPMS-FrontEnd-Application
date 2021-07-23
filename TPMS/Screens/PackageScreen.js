import RazorpayCheckout from 'react-native-razorpay';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert  
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';
import ViewEnrolledPkgScreen from './ViewEnrolledPkgScreen';

const Tab = createMaterialTopTabNavigator();

const PackageScreen = () => {
  return (
    <Tab.Navigator
    tabBarOptions={{
      labelStyle: { fontSize: 14 },
      style: { borderColor: '#ACC4E0',borderBottomWidth:1 },
      activeTintColor: '#000000',
      indicatorStyle: { borderColor: '#ACC4E0',borderBottomWidth:1}
    }}
  >
      <Tab.Screen name="View Packages" component={ViewPackages} />
      <Tab.Screen name="Buy Package" component={BuyPackages} />
      <Tab.Screen name="Enrolled Package" component={ViewEnrolledPackage} />
    </Tab.Navigator>
  );
  
};

export default PackageScreen;

function ViewEnrolledPackage(){
  return <ViewEnrolledPkgScreen />
}

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
        showAlert('error', 'Failed to get member types.');
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
              <View style={styles.button} key={item.memberTypeId}>  
                <TouchableOpacity
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
              <View style={styles.button}  key={item.id}>  
                <TouchableOpacity
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
            <View key={item.id}>
                <View style={{ backgroundColor:'#ff8000', padding:10, width:'50%',borderRadius:100,position:'relative',left:80,top:35 }} key={item.id}>
                    <Text style={styles.Tmodetext}>{item.transportMode}</Text>
                </View>
              <View style={styles.rect} key={item.id}>
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
                  <Text style={{ textAlign: 'center', fontSize: 16 }}>Subscription</Text>
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
  const [memberTypeId,setMemberTypeId] = useState(0);
  const [memberId,setMemberId] = useState(0);
  const [passNo, setPassNo] = useState('');

  const [passId, setPassId] = useState(0);
  const [enrolledPkgId,setEnrolledPkgId] = useState(0);
  const [amount,setAmount] = useState(0);
  const [todayDate, setTodayDate] = useState('');

  const [packageData, setPackageData] = useState([]);
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');


  useEffect(async () => {

    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    let userId = await AsyncStorage.getItem('id');
    userId = parseInt(userId);
    packageEligibility(userId, token);
    getMemberTypeId(userId, token);

      
    var date = new Date() //Current Date
    let fDate=date.getDate() + "-" + parseInt(date.getMonth()+1) + "-" + date.getFullYear();
    var currentDate = moment().format('YYYY-MM-DD');
    setTodayDate(currentDate);
    
  },[refreshing]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  },[]);

   const getMemberTypeId = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/member/' + userId,{ headers })
      .then((response) => {
        if(response.status == 200) {
          setMemberTypeId(response.data[0].memberTypeId); 
        }
      })
  }

  const packageEligibility = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/passes/userId/' + userId,{ headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if(response.status == 200) {
          setMemberId(response.data[0].memberId);
          setPassId(response.data[0].passId);
          //console.log("Pass Exist : ",response.data);
        
          displayTransportMode(token);

        }
        else {
          showAlert('Information', 'You are not eligible to buy any package. You should have to request for pass before buy any package.');
        }  
        
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showAlert('Information', 'You are not eligible to buy any package. You should have to request for pass before buy any package.');
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
        console.log("trans :",data);
      })
      .catch((error) => {
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
            showAlert('Information', 'There is no any package available for selected transport mode');
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

    const paymentStart = (amount,selectedPkgId) => {
      const headers = { 'Authorization': 'Bearer ' + token }
      // console.log("passid : ",passId);
      // console.log("enroll pkg :",enrolledPkgId);

      setAmount(amount);
      setEnrolledPkgId(selectedPkgId);

      axios.get(baseurl + '/enrolled-packages/' + passId, {headers})
      .then((response) => {
        console.log("Enroll pkg :",response.data);
        if(response.status==200)
        {
          
          console.log("current date:",todayDate);
          console.log("End Date:",response.data[0].end);
           if(response.data[0].end > todayDate)
           {
             showAlert('Information', 'Sorry , You can not apply for this package as there is still active package for this pass.'); 
           }
           else if(response.data[0].end<todayDate) 
           {
              //update isActive to 0 when package is expire
              const reqData = {
                isActive: 0,
                passId: passId
              };
              axios.put(baseurl + '/enrolled-packages/isActive', reqData, {headers})
                .then((response) => {
                  console.log("after update :",response.data);
                  console.log(response.status);
                  if(response.status == 200)
                  {
                    rechargePackage(amount,selectedPkgId);   
                  }
                })
              }
        } 
        else {
          showAlert('Warning', 'Network error'); 
        } 
      })
      .catch(error => {
        rechargePackage(amount,selectedPkgId);   
      })
      
    };

    const rechargePackage = (amount,selectedPkgId) => {
      console.log("passid : ",passId);
      console.log("enroll pkg id :",selectedPkgId);
      console.log("amount :",amount);
      const headers = { 'Authorization': 'Bearer ' + token }
      if(amount=='' || amount==null){
        showAlert('Amount is required');
        return;
      }
      const reqData = {
        amount: amount,
        info:'order_request'
      };
      axios.post(baseurl + '/create-order', reqData, {headers})
        .then((response) => {
          console.log(response.data.status);
          if(response.status == 200)
          {
            var options = {
              description: 'Credits towards travel',
              image: 'https://png.pngtree.com/png-clipart/20190902/original/pngtree-2-5d-gradient-background-track-red-retro-tram-material-png-image_4384275.jpg',
              currency: 'INR',
              key: 'rzp_test_7qGLAEB07PuLai',
              amount: response.data.amount,
              name: 'TPMS',
              order_id: response.data.id,
              prefill: {
                email: '',
                contact: '',
                name: ''
              },
              theme: {color: '#FF6103'}
            }
            RazorpayCheckout.open(options).then((data) => {
              console.log(data.razorpay_payment_id)
              console.log(data.razorpay_order_id)
              console.log(data.razorpay_signature)
           
              // handle success
              showAlert('Success','Payment Successful !!');
              const requestData = {
                amount: amount,
                passId:passId,
                packageId:selectedPkgId,
                isActive:1
              };
              const headers = { 'Authorization': 'Bearer ' + token }
              axios.post(baseurl + '/enrolled-packages', requestData, {headers})
              .then((response) => {
                if(response.status == 201)
                {
                  showAlert('Success','Your Package has been enrolled successfully.');
                }
                else{
                  showAlert('Failure','Your package enrollment failed, Try again after sometimes...');
                }
              }).catch((error) => {
                console.log(error.response);
              })
              
            }).catch((error) => {
              // handle failure
              alert(`Error: ${error.code} | ${error.description}`);
              showAlert('Failed','Oops payment transaction failed !! Try Again...');
            });
          }
       })
      
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
            data && data.map((item, index)=> (
              <View style={styles.button}  key={item.id}>  
                <TouchableOpacity
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
            
            <View style={styles.rect} key={item.id}>
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
                    onPress={ () => paymentStart( (item.price-((item.price*item.discountPercentage)/100)), item.id ) }
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
    marginLeft:20
  },
  textBuy: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'#000000'
  }
});





