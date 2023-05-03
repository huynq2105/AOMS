import React from 'react';
import {View, Text} from 'react-native';
import {FONTS, COLORS} from '../constants/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
const Header = ({containerStyle, title, leftComponent, rightComponent}) => {
  return (
    <SafeAreaView
      // eslint-disable-next-line react-native/no-inline-styles
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
        backgroundColor: COLORS.primaryALS,
        ...containerStyle,
      }}>
      {/* left */}
      {leftComponent}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
        }}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
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
    </SafeAreaView>
  );
};
export default Header;
