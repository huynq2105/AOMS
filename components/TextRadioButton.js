import React,{useState,useEffect} from 'react';
import {
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import { COLORS,FONTS,SIZE } from '../constants/theme';
import Text from '../constants/Text'
import icons from '../constants/icons';
const TextRadioButton = ({customContainerStyle,onPress,label,labelStyle,iconStyle,isSelected})=>{
    return(
        <TouchableOpacity
        onPress={onPress}
        style={{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            ...customContainerStyle
        }}
    
    >
         <Image source={isSelected? icons.check_on : icons.check_off} 
            style={{
                width:20,
                height:20,
                ...iconStyle
            }}
        />
    <Text style={{
            ...labelStyle,
            marginLeft:5,
        }}>{label}</Text>
       
     
    </TouchableOpacity>
    )
   
}
export default TextRadioButton;