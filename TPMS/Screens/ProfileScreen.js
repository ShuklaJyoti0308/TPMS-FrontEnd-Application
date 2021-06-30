import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

const ProfileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
     <Button
        title="Go to Home Screen"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
 
});


