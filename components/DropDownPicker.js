import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {COLORS, SIZES} from '../constants/theme';
import icons from '../constants/icons';
import Text from '../constants/Text';

const DropDownPicker = ({containerStyle,selectedItem,onPress}) =>{
    return(
        <TouchableOpacity
            style={{
                flexDirection:'row',
                height:SIZES.height > 800 ? 55 : 45,
                paddingHorizontal:SIZES.radius,
                borderRadius:SIZES.radius,
                alignItems:'center',
                backgroundColor:COLORS.lightGray1,
                ...containerStyle
            }}
            onPress={onPress}
        >
            <View
                style={{
                    flex:1,
                    flexDirection:'row',
                    alignItems:'center'
                }}
            >
                {!selectedItem && <Text body3 gray>Select an Item</Text>}
                {!selectedItem && <Text body3 gray>{selectedItem}</Text>}
            </View>
            <Image source={icons.down} style={{
                width:20,
                height:20
            }} />
        </TouchableOpacity>
    )
}
export default DropDownPicker;