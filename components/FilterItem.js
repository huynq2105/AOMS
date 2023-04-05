import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {COLORS, SIZES} from '../constants/theme';
import icons from '../constants/icons';
import Text from '../constants/Text';

const FilterItem = ({isSelected, onPress, icon, name,hasIcon=false}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        borderWidth: 2,
        borderRadius: SIZES.radius,
        borderColor: isSelected ? COLORS.secondaryALS : COLORS.lightGray2,
      }}
      onPress={onPress}>
      {/* Card Image */}
      {hasIcon &&     <View
        style={{
          width: 40,
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderRadius: SIZES.radius,
          borderColor: COLORS.lightGray2,
        }}>
        <Image
          source={icon}
          resizeMode="center"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.primaryALS,
          }}
        />
      </View>}
  
      {/* Name */}
      <Text
        style={{
          flex: 1,
          marginLeft: SIZES.radius,
        }}
        body4>
        {name}
      </Text>
      {/* Radio Button */}
      <Image
        source={isSelected ? icons.check_on : icons.check_off}
        style={{
          width: 25,
          height: 25,
          tintColor: COLORS.secondaryALS,
        }}
      />
    </TouchableOpacity>
  );
};

export default FilterItem;
