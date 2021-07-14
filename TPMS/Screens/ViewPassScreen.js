import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, RefreshControl,  ActivityIndicator, Alert, AppRegistry } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseurl } from '../config';
import QRCode from 'react-native-qrcode-svg';

const ViewPassScreen = ({navigation}) => {

  const [userId, setUserId] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [passApproval, setPassApproval] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [passData, setPassData] = useState([]);

  useEffect(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setToken(token);
    let userId = await AsyncStorage.getItem('id');
    userId = parseInt(userId);
    setUserId(userId);
    displayPassStatus(userId, token);
  },[refreshing]);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {text: 'Okay'}
    ]);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  },[]);

  const displayPassStatus = (userId, token) => {
    if(userId == 0)
    {
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/member/' + userId,{ headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        console.log("Pass status res : ", response.data);
        if(response.status == 200) {
          console.log("status code:",response.data[0].status)
          let memberid=response.data[0].memberId;
          if(response.data[0].status == 1){
            setPassApproval(true);

            axios.get(baseurl + '/passes/member/' + memberid,{ headers })
            .then((response) => {
              console.log("Pass data : ", response.data);
              if(response.status == 200) {
                  setPassData(response.data[0]);
              }
              else
              {
                showAlert('error', 'Network Error.');
              }  
            })
            .catch((error) => {
                showAlert('error', 'Failed to get pass details.');
            });
          }
          else{
            setPassApproval(false);
            setRequestData(response.data[0]); 
          }
             
        }  
        else
        {
          showAlert('error', 'Network Error.');
        }  
        
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showAlert('error', 'Failed to get pass status.');
      });
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
      keyboardShouldPersistTaps='handled'
      refreshControl={
        <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
        />
        }
      >
     {loading == true && (<ActivityIndicator size="large" color="#bdc4ca" />)} 

      {
        (passApproval==false) ? 
        (
          <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="card-account-details" color="#FE6666" size={25} />
            <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>Request Id</Text>
            <Text style={{ color: "#000000", marginLeft: 70, fontSize: 16 }}>{requestData.memberId}</Text>      
          </View>
          <View style={styles.row}>
            <Icon name="calendar-clock" color="#FE6666" size={25} />
            <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>Request Date</Text>
            <Text style={{ color: "#000000", marginLeft: 50, fontSize: 16 }}>{requestData.requestDate}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="format-list-checks" color="#FE6666" size={25} />
            <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>Pass Status</Text>
            {
              (requestData.status==2) ? 
                (<Text style={{ color: "#000000", marginLeft: 60, fontSize: 16 }}>Disapproved</Text>) 
              : 
                (<Text style={{ color: "#000000", marginLeft: 60, fontSize: 16 }}>Not Approved</Text>)
            }
            
          </View>
          <View style={styles.row}>
            <Icon name="tooltip-edit" color="#FE6666" size={25} />
            <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>Edit</Text>
          </View>
         
        </View>
        ) : 
        (
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Icon name="card-account-details" color="#FE6666" size={25} />
              <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>PASS No</Text>
              <Text style={{ color: "#000000", marginLeft: 100, fontSize: 16 }}>{passData.serialNo}</Text>      
            </View>
            <View style={styles.row}>
              <Icon name="account-plus" color="#FE6666" size={25} />
              <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>HOLDER NAME</Text>
              <Text style={{ color: "#000000", marginLeft: 50, fontSize: 16 }}>{passData.firstName} {passData.lastName}</Text>      
            </View>
            <View style={styles.row}>
              <Icon name="calendar-clock" color="#FE6666" size={25} />
              <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>VALID THRU </Text>
              <Text style={{ color: "#000000", marginLeft: 70, fontSize: 16 }}>{passData.expiry}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="qrcode-scan" color="#FE6666" size={25} />
              <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16, paddingRight:100}}>SCAN QR</Text>
              <QRCode 
                size={100}
                value={passData.expiry}
                bgColor='#000000'
                fgColor="#fff"
                marginLeft={80}
              />
            </View>
          </View>
        )
      }
        
      </ScrollView>
    </SafeAreaView>
  );
};

AppRegistry.registerComponent('TPMS', () => ViewPassScreen);

export default ViewPassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  userInfoSection: {
    padding: 10,
    marginTop: 10,
    
  },
  row: {
    flexDirection: 'row',
    padding:10,
    marginBottom: 10,
    backgroundColor:'#e5e8ea'
  },
});


