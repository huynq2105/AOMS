import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import icons from '../../constants/icons';
import moment from 'moment';
import Icon  from 'react-native-vector-icons/MaterialIcons'
const today = new Date();
const DatePicker = ({selectedDate, onSelectToday, onBackNext,onOpenCalendar=()=>{}}) => {
  const currentDate = moment();
  const onBackDate = () => {
    onBackNext('back');
  };
  const onNextDate = () => {
    onBackNext('next');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        //paddingLeft: 15,
        paddingVertical: 15,
       // flex: 5,
        paddingHorizontal: SIZES.padding,
        //backgroundColor: COLORS.red,
      }}>
      {/*       <TouchableOpacity
        style={{
            paddingLeft:15,
            marginRight:SIZES.padding
        }}
        onPress={onSelectToday}
      >
        <Text
          style={{
            color: COLORS.primaryALS,
            textAlign: 'center',
            fontSize: 12,
          }}>
          Today
        </Text>
        <Text
          style={{
            fontSize: 10,
          }}>
          {currentDate.format('DD MMM').toUpperCase()}
        </Text>
      </TouchableOpacity> */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        {/* <TouchableOpacity onPress={onBackDate}>
          <Image
            source={icons.back}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.orange,
            }}
          />
        </TouchableOpacity> */}
        <View
          style={{
            flex: 1,
            //backgroundColor:COLORS.white,
            justifyContent: 'center',
            alignItems: 'center',
             flexDirection:'row'
          }}>
         {/*  <Text
            style={{
              color: COLORS.darkGray2,
              textAlign: 'center',
              fontSize: 12,
            }}>
            {selectedDate == today.getDate()
              ? 'Today'
              : selectedDate.format('ddd').toUpperCase()}
          </Text> */}
          <View
            style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center'
            }}
          >
              <TouchableOpacity
              onPress={onOpenCalendar}
                style={{
                  marginRight:SIZES.base
                }}
              >
            <Image
            source={icons.calendar}
            style={{
              tintColor: COLORS.primaryALS,
              width: 20,
              height: 20,
            }}
            // tintColor={isActiveIcon ? COLORS.green : COLORS.gray}
          />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                fontWeight:"600",
                color: COLORS.primaryALS,
              }}>
              {selectedDate.format('DD MMM YYYY').toUpperCase()}
            </Text>
          
          </View>
        </View>
{/* 
        <TouchableOpacity onPress={onNextDate}>
          <Image
            source={icons.right_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.orange,
            }}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default DatePicker;
