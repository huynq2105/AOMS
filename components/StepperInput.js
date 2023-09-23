import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { COLORS,SIZES } from "../constants/theme";
import icons from "../constants/icons";
import Text from '../constants/Text'
import IconButton from "./IconButton";

const StepperInput = ({
    containerStyle,
    value = 1,
    onAdd,
    onMinus
})=>{
    return(
        <View
            style={{
                flexDirection:'row',
                height:60,
                width:100,
                backgroundColor:COLORS.lightGray2,
                ...containerStyle
            }}
        >
            <IconButton 
                containerStyle={{
                    width:50,
                    alignItems: 'center',
                    justifyContent:'center'
                }}
                icons={icons.minus}
                iconStyle={{
                    height:20,
                    width:20,
                    tintColor: COLORS.gray
                }}
                onPress={onMinus}
            />
            <View
                style={{
                    flex:1,
                    alignItems:'center',
                    justifyContent:'center'
                }}
            >
                <Text body3>{value}</Text>
            </View>
              <IconButton 
            
                containerStyle={{
                    width:50,
                    alignItems: 'center',
                    justifyContent:'center'
                }}
                icons={icons.plus}
                iconStyle={{
                    height:20,
                    width:20,
                    tintColor: COLORS.gray
                }}
                onPress={onAdd}
            />
        </View>
    )
}

export default StepperInput;