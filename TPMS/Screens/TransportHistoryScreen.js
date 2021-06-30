import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

const TransportHistoryScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button
        title="Transport History"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default TransportHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
 
});


