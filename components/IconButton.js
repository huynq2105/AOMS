import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {COLORS} from '../constants/theme';

const IconButton = ({containerStyle, icons, iconStyle, onPress}) => {
  return (
    <TouchableOpacity style={{...containerStyle}} onPress={onPress}>
      <Image
        source={icons}
        style={{
          width: 30,
          height: 30,
          tintColor: COLORS.white,
          //tintColor:COLORS.white,
          ...iconStyle,
        }}
      />
    </TouchableOpacity>
  );
};
export default IconButton;
