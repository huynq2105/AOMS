import React from 'react';
import {TouchableOpacity,View} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import Text from '../constants/Text'
const TruckStatus = ({
  status,
  customContainerStyle
}) => {
    if(status==='Ready to load'|| status==='Loading' || status ==='Closed'){
        return(
          <View
            style={{
              justifyContent:'center',
              alignItems:'center',
              backgroundColor:COLORS.gray,
              height:24,
              paddingHorizontal:SIZES.base,
              ...customContainerStyle
            }}
          >
            <Text body3 white>{status}</Text>
          </View>
        )
      }
      if(status==='Transit To Warehose' || status==='Arrived To WareHouse' 
      || status ==='Arrived Warehouse' || status==='Unloading' || status==='Arrived Terminal' 
      || status==='TRANSIT TO FACTORY' || status==='ARRIVED FACTORY' || status === 'In Transit'){
        return(
          <View
            style={{
              justifyContent:'center',
              alignItems:'center',
              backgroundColor:COLORS.secondaryALS,
              height:24,
              ...customContainerStyle
            }}
          >
            <Text body3 white>{status}</Text>
          </View>
        )
      }
      else{
        return(
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:COLORS.green,
            height:24,
            ...customContainerStyle
          }}
        >
          <Text body3 white>Completed</Text>
        </View>
        )
      
      }
};
export default TruckStatus;
