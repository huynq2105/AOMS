import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, TextInput } from "react-native";
import { COLORS,SIZES } from "../constants/theme";
import Text from '../constants/Text'

const FormInput = ({
    label,
    keyboardType,
    autoCompleteType,
    errMsg,
    prepandComponent,
    appendComponent,
    secureTextEntry,
    onChange,
    placeHolder,
    inputStyle,
    autoCapitalize,
    containerStyle,
    inputValue = '',
    onFocus,
    inputContainerStyle,
    hidenLabel = true,
    ediable = true
  }) => {
    return (
      <View
        style={{
          ...containerStyle,
        }}
      >
        {/* label & errMsg */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
           // backgroundColor:COLORS.red
          }}
        >
          <Text white body4>
            {label}
          </Text>
          <Text red body4>
            {errMsg}
          </Text>
        </View>
        {/* TextInput */}
        <View
          style={{
            flexDirection: "row",
            height: 40,
           // marginTop: SIZES.base,
            //paddingHorizontal: SIZES.padding,
            borderRadius: SIZES.radius,
            borderBottomColor: COLORS.white,
            borderBottomWidth:2,
            //backgroundColor:COLORS.green,
            ...inputContainerStyle
          }}
        >
          {prepandComponent}
          <TextInput
            style={{
              flex: 1,
              ...inputStyle,
            }}
            editable={ediable}
            onFocus={onFocus}
            value={inputValue}
            keyboardType={keyboardType}
            placeholder={placeHolder}
            placeholderTextColor={COLORS.gray}
            autoCompleteType={autoCompleteType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            onChangeText={(text) => {
              onChange(text);
            }}
          />
              {appendComponent}
        </View>
    
        {/* Prepand */}
      </View>
    );
  };
  export default FormInput;