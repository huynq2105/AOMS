import React, {useRef, useState, useEffect} from 'react';
import {View, ImageBackground, Image, Animated,StatusBar, Keyboard,KeyboardAvoidingView,ScrollView,SafeAreaView, StyleSheet} from 'react-native';
import images from '../../constants/images'
import { SIZES,COLORS } from '../../constants/theme';
import Text from '../../constants/Text'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const AuthLayout = ({title, subTitle, titleContailner, children}) => {
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardStatus('Keyboard Shown');
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardStatus('Keyboard Hidden');
      });
  
      showSubscription.remove();
      return () => {
        hideSubscription.remove();
      };
    }, []);
    return (
      <SafeAreaView
        style={{
          flex: 1,
          //backgroundColor:COLORS.red
          //paddingTop: SIZES.padding,
        }}>
        <KeyboardAwareScrollView
        //behavior='padding'
          //keyboardDismissMode="on-drag"
          contentContainerStyle={{
            flex: 1,
            //paddingHorizontal: SIZES.padding,
          }}>
          <ImageBackground
        source={images.bg_login}
        resizeMode="cover"
        style={{
          flex: 1,
          paddingHorizontal:SIZES.padding
          //justifyContent: 'center',
        }}>
            <View
            style={{
                flex:1,
                //backgroundColor:COLORS.green,
                justifyContent:'center',
                alignItems:'center'
            }}
            >
   {/* Logo */}
             <Image
              source={images.bg_img}
              resizeMode="contain"
              style={{
                width: 50,
                height: 50, 
                marginTop:SIZES.padding
                 //backgroundColor:COLORS.green
              }}
            />
            {/* Title */}
            <Text h2 white style={{
              marginTop:10
            }}>{title}</Text>
             <Text white body3>{subTitle}</Text> 
            {/* Subtitle */}
            </View>
         
            <View
            style={{
                flex:3,
               // backgroundColor:COLORS.lightOrange
            }}
          >
             {children}
          </View>
          </ImageBackground>
       
         
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({})
  export default AuthLayout;