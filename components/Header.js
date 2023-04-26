import React from 'react';
import {View, Text} from 'react-native';
import {FONTS, COLORS, SIZES} from '../constants/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
const Header = ({containerStyle, title, leftComponent, rightComponent}) => {
  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
        borderBottomWidth: 1,
        //flex:1,
        borderBottomColor: COLORS.lightGray1,
        //  borderBottomRightRadius:SIZES.radius*2,
          backgroundColor:COLORS.primaryALS,
        ...containerStyle,
      }}>
      {/* left */} 
      {leftComponent}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          //backgroundColor: COLORS.red,
          height: 60,
        }}>
        <Text
          style={{
            ...FONTS.h3,
            fontSize: 18,
            fontFamily: 'Roboto-Bold',
            color: COLORS.white,
            //marginTop:SIZES.padding
          }}>
          {title}
        </Text>
      </View>
      {/*  right */} 
      {rightComponent}
    </SafeAreaView>
  );
};
export default Header;
