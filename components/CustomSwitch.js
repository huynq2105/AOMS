import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, TextInput,StyleSheet,TouchableNativeFeedback } from "react-native";
import { COLORS,SIZES } from "../constants/theme";
import Text from '../constants/Text'

const CustomSwitch = ({ value, onChange, customContainerStyle,label = true }) => {
    return (
        <TouchableNativeFeedback
            onPress={() => onChange(!value)}
        >
            <View style={{
                flexDirection:'row'
            }}>
                <View
                    style={
                        value ? styles.customSwichOn : styles.customSwichOff
                    }
                >
                    <View
                        style={{
                            ...styles.dot,
                            backgroundColor: value ? COLORS.white : COLORS.primaryALS
                        }}
                    ></View>
                </View>
                {label && <Text
                    style={{
                        marginLeft: SIZES.base
                    }}
                    body4 gray
                >Save Me</Text>}
            </View>

        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    customSwichOn: {
        width: 40,
        height: 20,
        borderRadius: 10,
        paddingRight: 2,
        backgroundColor: COLORS.primaryALS,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    customSwichOff: {
        width: 40,
        height: 20,
        borderRadius: 10,
        paddingLeft: 2,
        justifyContent: "center",
   //     alignItems: 'flex-start',
        backgroundColor: COLORS.gray
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6
    }
})
export default CustomSwitch;
