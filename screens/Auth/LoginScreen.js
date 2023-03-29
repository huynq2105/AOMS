import React from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import images from '../../constants/images';
const LoginScreen = props => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.bg_login}
        resizeMode="stretch"
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <Text style={styles.text}>Inside</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    //backgroundColor: '#000000c0',
  },
});

export default LoginScreen;
