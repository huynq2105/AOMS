import React, { useState, useEffect } from "react";
import { TouchableOpacity,Image,StyleSheet } from "react-native";
import { COLORS,FONTS,SIZES } from '../constants/theme';
import Text from '../constants/Text'

const TextIconButton = ({
    containerStyle,
    label,
    labelStyle,
    icon,
    iconStyle,
    iconPostion,
    onPress
}) =>{
    return(
        <TouchableOpacity
            style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                paddingHorizontal:SIZES.radius,
                ...containerStyle
            }}
            onPress={onPress}
            
        >
            {iconPostion=="LEFT" && 
            <Image
                source={icon}
                style={{
                    ...styles.image,
                    ...iconStyle
                }}
            />}
            <Text style={{...labelStyle,flex:1}} body4>{label}</Text>
            {iconPostion=="RIGHT" && 
            <Image
                source={icon}
                style={{
                    ...styles.image,
                    ...iconStyle
                }}
            />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image:{
        marginLeft:5,
        width:20,
        height:20,
        tintColor:COLORS.black
    }
})

export default TextIconButton;