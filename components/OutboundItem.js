import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../constants/theme';
import icons from '../constants/icons';
import Text from '../constants/Text';
import images from '../constants/images';
const OutboundItem = ({customContainerStyle, onPress, title, image}) => {
  return (
    <TouchableOpacity
      style={{
        width: '30%',
        padding: SIZES.base,
        height: 100,
        alignItems: 'center',
        marginBottom: SIZES.padding,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.white,
        ...styles.shadow,
        //borderColor:COLORS.secondaryALS,
        ...customContainerStyle,
      }}
      onPress={onPress}>
      <Image
        source={image}
        style={{
          width: 40,
          height: 40,
          tintColor: COLORS.primaryALS,
        }}
      />
      <View
        style={{
          justifyContent:'center',
          alignItems:'center',
          marginTop:SIZES.radius + 2
        }}>
        <Text body4 black style={{
            fontWeight:'600',
            fontSize:12
        }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
export default OutboundItem;
