import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {COLORS, FONTS} from '../constants/theme';

const TextButton = ({
  label,
  buttonContainerStyle,
  onPress,
  disabled,
  labelStyle,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryALS,
        ...buttonContainerStyle,
      }}>
      <Text
        style={{
          color: COLORS.white,
          ...FONTS.body3,
          ...labelStyle,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
export default TextButton;
