import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../constants/theme';
const ItemSeparator = ({customContainerStyle}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: COLORS.lightGray1,
        ...customContainerStyle,
      }}></View>
  );
};
export default ItemSeparator;
