import React,{useState} from 'react'
import { View } from 'react-native'
import {COLORS} from '../constants/theme'

const LineDivider = ({lineStyle}) =>{
    return(
        <View
            style={{
                height:2,
                width:'100%',
                backgroundColor:COLORS.darkBlue,
                ...lineStyle
            }}
        />
    )
}
export default LineDivider