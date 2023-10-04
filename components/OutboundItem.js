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
        width: '45%',
        padding: SIZES.base,
        height: 160,
        alignItems: 'center',
        marginBottom: SIZES.base,
        borderRadius: SIZES.radius,
       // backgroundColor: COLORS.white,
        borderWidth:1,
        //...styles.shadow,
        borderColor:COLORS.gray,
        ...customContainerStyle,
      }}
      onPress={onPress}>
      <Image
        source={image}
        style={{
          width: 80,
          height: 80,
          tintColor: COLORS.primaryALS,
        }}
      />
      <View
        style={{
          justifyContent:'center',
          alignItems:'center',
          marginTop:SIZES.padding
        }}>
        <Text body4 black style={{
            fontWeight:'600',
            fontSize:15,
            textTransform: 'uppercase'
        }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
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
