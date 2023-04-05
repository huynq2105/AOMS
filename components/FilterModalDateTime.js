import Animated, {
    interpolate,
    useAnimatedStyle,
    withDelay,
    withTiming,
  } from 'react-native-reanimated';
  import React, {useState, useRef, useEffect} from 'react';
  import {
    View,
    Text,
  } from 'react-native';
  import TextButton from './TextButton';
  import { SIZES,FONTS,COLORS } from '../constants/theme';
  import CalendarPicker from 'react-native-calendar-picker';
  const FilterModalDateTime = ({filterModalSharedValue1, filterModalSharedValue2,onDateChangeFunc}) => {
    const [selected, setSelect] = useState('Import');
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const onDateChange = (date, type) => {
      //function to handle the date change
      onDateChangeFunc(date)
      filterModalSharedValue2.value = withTiming(SIZES.height, {
          duration: 500,
        });
        filterModalSharedValue1.value = withDelay(
          500,
          withTiming(SIZES.height, {
            duration: 100,
          }),
        );
      // if (type === 'END_DATE') {
      //   setSelectedEndDate(date);
      // } else {
      //   setSelectedEndDate(null);
      //   setSelectedStartDate(date);
      // }
    };
  
    const filterModalContainerAniamtedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          filterModalSharedValue1.value,
          [SIZES.height, 0],
          [0, 1],
        ),
        transform: [
          {
            translateY: filterModalSharedValue1.value,
          },
        ],
      };
    });
    const filterModalBackgroundAniamtedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          filterModalSharedValue2.value,
          [SIZES.height, 0],
          [0, 1],
        ),
      };
    });
    const filterModalContentAniamtedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          filterModalSharedValue2.value,
          [SIZES.height, 0],
          [0, 1],
        ),
        transform: [
          {
            translateY: filterModalSharedValue2.value,
          },
        ],
      };
    });
    function renderFooter() {
      return (
        <View
          style={{
            position: 'absolute',
            // flexDirection:'row',
            bottom: 30,
            left: SIZES.padding,
            right: SIZES.padding,
            height: 40,
            // backgroundColor:COLORS.green,
            marginTop: SIZES.padding,
            // marginBottom:30,
            paddingHorizontal: SIZES.padding,
          }}>
          {/* Apply */}
          <TextButton
            buttonContainerStyle={{
              flex: 1,
              borderRadius: SIZES.radius,
              marginLeft: SIZES.radius,
              borderColor: COLORS.secondaryALS,
              borderWidth: 1,
              backgroundColor: COLORS.secondaryALS,
            }}
            label="Apply"
            labelStyle={{
              color: COLORS.white,
              ...FONTS.h3,
            }}
            onPress={() => {
              filterModalSharedValue2.value = withTiming(SIZES.height, {
                duration: 500,
              });
              filterModalSharedValue1.value = withDelay(
                500,
                withTiming(SIZES.height, {
                  duration: 100,
                }),
              );
            }}
          />
        </View>
      );
    }
    return (
      //Main Container
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            height: SIZES.height,
            width: SIZES.width,
          },
          filterModalContainerAniamtedStyle,
        ]}>
        {/* Background Container */}
        <Animated.View
          style={[
            {
              flex: 1,
              height: SIZES.height,
              width: SIZES.width,
              backgroundColor: COLORS.transparentBlack7,
            },
            filterModalBackgroundAniamtedStyle,
          ]}>
          {/* Content Container */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                height: SIZES.height * 0.8,
                width: SIZES.width,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                backgroundColor: COLORS.white,
              },
              filterModalContentAniamtedStyle,
            ]}>
            {/* Header */}
            <View
              style={{
                marginTop: SIZES.padding,
                flexDirection: 'row',
                paddingHorizontal: SIZES.padding,
              }}>
              <View
                style={{
                  width: 60,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  ...FONTS.h3,
                }}>
                Filter
              </Text>
              <TextButton
                label="Cancel"
                buttonContainerStyle={{
                  width: 60,
                  backgroundColor: null,
                }}
                labelStyle={{
                  color: COLORS.black,
                  ...FONTS.body3,
                }}
                onPress={() => {
                  filterModalSharedValue2.value = withTiming(SIZES.height, {
                    duration: 500,
                  });
                  filterModalSharedValue1.value = withDelay(
                    500,
                    withTiming(SIZES.height, {
                      duration: 100,
                    }),
                  );
                }}
              />
            </View>
            {/* Content */}
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                //backgroundColor:COLORS.green,
                marginTop:SIZES.base
              }}>
                 <CalendarPicker
          startFromMonday={true}
          //allowRangeSelection={true}
          minDate={new Date(2018, 1, 1)}
          maxDate={new Date(2050, 6, 3)}
          weekdays={['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']}
          months={[
            'January',
            'Febraury',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ]}
          previousTitle="Previous"
          nextTitle="Next"
          todayBackgroundColor="#e6ffe6"
          selectedDayColor="#66ff33"
          selectedDayTextColor="#000000"
          scaleFactor={375}
          textStyle={{
            fontFamily: 'Cochin',
            color: '#000000',
          }}
          onDateChange={onDateChange}
        />
            </View>
  
            {/* Footer */}
           {/*  {renderFooter()} */}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  };
  export default FilterModalDateTime;
  