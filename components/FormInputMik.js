import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, TextInput } from "react-native";
import { COLORS,SIZES } from "../constants/theme";
import Text from '../constants/Text'

const FormInputMik = ({
    label,
    keyboardType,
    autoCompleteType,
    errMsg,
    prepandComponent,
    appendComponent,
    secureTextEntry,
    onChangeText,
    placeHolder,
    inputStyle,
    autoCapitalize,
    containerStyle,
    inputValue = '',
    onFocus,
    inputContainerStyle,
    ediable = true,
    onBlur,
    onSubmitEditing,
    returnKeyType,
    inputRef
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
          }}
        >
          <Text gray body4>
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
            height: 55,
            backgroundColor: 55,
            marginTop: SIZES.base,
            paddingHorizontal: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor:COLORS.lightGray2,
            ...inputContainerStyle
          }}
        >
          {prepandComponent}
          <TextInput
            style={{
              flex: 1,
              ...inputStyle,
            }}
            ref={inputRef}
            editable={ediable}
            onFocus={onFocus}
            value={inputValue}
            keyboardType={keyboardType}
            placeholder={placeHolder}
            placeholderTextColor={COLORS.gray}
            autoCompleteType={autoCompleteType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            onSubmitEditing={onSubmitEditing}
            onBlur={onBlur}
            returnKeyType={returnKeyType}
            onChangeText={onChangeText}
          />
              {appendComponent}
        </View>
    
        {/* Prepand */}
      </View>
    );
  };
  export default FormInputMik;