import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

const PackageScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Package Screen</Text>
      <Button
        title="Package Screen"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default PackageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


