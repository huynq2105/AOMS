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
          backgroundColor: COLORS.white,
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
          <View
          style={{      
            alignItems:'center'
          }}
           >
            {/* Logo */}
            <Image
              source={images.logoALS_full}
              resizeMode="contain"
              style={{
                width: 150,
                height: 100,
                 //backgroundColor:COLORS.green
              }}
            />
            {/* Title */}
          {/*   <Text h2 style={{
              marginTop:-20
            }}>{title}</Text> */}
            {/* <Text body3>{subTitle}</Text> */}
            {/* Subtitle */}
          </View>
          {children}
       
         
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({})
  export default AuthLayout;