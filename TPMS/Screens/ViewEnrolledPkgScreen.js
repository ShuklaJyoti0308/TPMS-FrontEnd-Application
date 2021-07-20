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

import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseurl} from '../config';
import axios from 'axios';



const ViewEnrolledPkgScreen = ({navigation}) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    const [memberId,setMemberId] = useState(0);
    const [passId, setPassId] = useState(0);
    const [enrolledPkgData, setEnrolledPkgData] = useState([]);
    
    useEffect(async () => {

        const token = await AsyncStorage.getItem('jwtToken');
        setToken(token);
        let userId = await AsyncStorage.getItem('id');
        userId = parseInt(userId);
        getPassId(userId, token);
        
      },[refreshing]);

    const showAlert = (title, message) => {
        Alert.alert(title, message, [
          {text: 'Okay'}
        ]);
      }
    
      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
      },[]);

      const getPassId = (userId, token) => {
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
              setPassId(response.data[0].passId);
              setMemberId(response.data[0].memberId);
              console.log(response.data);
              getPackageDetails();
            }
            else {
              showAlert('Information', 'Sorry there is no any package enrolled on pass number ' + passId + '.');
            }  
            
          })
          .catch((error) => {
            setLoading(false);
            setRefreshing(false);
            showAlert('Information', 'You are not eligible to view enrolled package. You should have to request for pass.');
          });  
      }

      const getPackageDetails = () => {
       const headers = { 'Authorization': 'Bearer ' + token };
        axios.get(baseurl + '/enrolled-package/' + passId ,{ headers })
          .then((response) => {
            setLoading(false);
            setRefreshing(false);
            if(response.status == 200) {
                console.log(response.data);
                setEnrolledPkgData(response.data[0]);
            }
            else {
              showAlert('Information', 'Sorry there is no any package enrolled on pass number' + passId + '.');
            }  
            console.log("pkg:",enrolledPkgData);
          })
          .catch((error) => {
            setLoading(false);
            setRefreshing(false);
         
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
            <View style={styles.userInfoSection}>
                <View style={styles.row}>
                <Icon name="bus-multiple" color="#FE6666" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16, fontWeight:'bold' }}>Transport Mode</Text>
                <Text style={{ color: "#000000", marginLeft: 65, fontSize: 16 }}>{enrolledPkgData.transportMode}</Text>
              </View>
              <View style={styles.row}>
                <Icon name="card-text-outline" color="#FE6666" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16, fontWeight:'bold' }}>Package Name</Text>
                <Text style={{ color: "#000000", marginLeft: 70, fontSize: 16 }}>{enrolledPkgData.name}</Text>      
              </View>
              <View style={styles.row}>
                <Icon name="timer" color="#FE6666" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16, fontWeight:'bold' }}>Start Date </Text>
                <Text style={{ color: "#000000", marginLeft: 100, fontSize: 16 }}>{enrolledPkgData.start}</Text>
              </View>
              <View style={styles.row}>
                <Icon name="timer-off" color="#FE6666" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16, fontWeight:'bold' }}>Expire Date </Text>
                <Text style={{ color: "#000000", marginLeft: 90, fontSize: 16 }}>{enrolledPkgData.end}</Text>
              </View>
              <View style={styles.row}>
                <Icon name="currency-inr" color="#FE6666" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16, fontWeight:'bold' }}>Available Balance</Text>
                <Text style={{ color: "#000000", marginLeft: 50, fontSize: 16 }}>{enrolledPkgData.amount}</Text>
              </View>
             
            </View>
           
            
          </ScrollView>
        </SafeAreaView>
      );
};

export default ViewEnrolledPkgScreen;

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


