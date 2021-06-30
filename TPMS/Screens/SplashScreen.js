import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    Button
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({navigation}) => {
    
    return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duration={30000}
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="stretch"
        />
      </View>

      <Animatable.View 
        style={styles.footer}
        animation="fadeInUpBig"
      >
        <Text style={styles.title}>All Journeys have secret destinations of which the Traveler is unaware !</Text>
        <Text style={styles.text}>Sign In with account</Text>
        <View style={styles.button}>
          <Button
          title="Get Started"
          onPress={() => navigation.navigate("LoginScreen")}
          color="#FE6666"
          />
        </View>
      </Animatable.View>

    </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.20;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FE6666'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo,
      borderRadius: 30
  },
  title: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  }
  // signIn: {
  //     width: 150,
  //     height: 40,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     borderRadius: 50,
  //     flexDirection: 'row'
  // }
});