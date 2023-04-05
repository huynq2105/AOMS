import React from 'react';
import {View, Text} from 'react-native';
import {FONTS, COLORS} from '../constants/theme';
const Header = ({containerStyle, title, leftComponent, rightComponent}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray1,
        //  borderBottomRightRadius:SIZES.radius*2,
        //  backgroundColor:COLORS.red,
        ...containerStyle,
      }}>
      {/* left */}
      {leftComponent}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h3,
            fontSize: 18,
            fontFamily: 'Roboto-Bold',
            color: COLORS.white,
          }}>
          {title}
        </Text>
      </View>
      {/*  right */}
      {rightComponent}
    </View>
  );
};
export default Header;
