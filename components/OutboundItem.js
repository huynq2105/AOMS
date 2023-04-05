import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { COLORS,SIZES } from "../constants/theme";
import icons from "../constants/icons";
import Text from "../constants/Text";
import images from "../constants/images";
const OutboundItem = ({customContainerStyle,onPress,title}) =>{
  
    return(
        <TouchableOpacity
            style={{
                width:'45%',
                padding: SIZES.base,
                alignItems:'center',
                marginBottom:SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightGray2,
                borderColor:COLORS.secondaryALS,
                ...customContainerStyle
            }}
            onPress={onPress}
        >
              <View
                style={{
                    marginTop:SIZES.base

                }}
            >
             <Text h3  primaryALS>{title}  </Text>
            </View>
            <Image source={images.logoALS}
            style={{
              width:80,
              height:40,
              tintColor: COLORS.primaryALS,
            }}
          /> 
 
           
          
        </TouchableOpacity>
    )
}

export default OutboundItem