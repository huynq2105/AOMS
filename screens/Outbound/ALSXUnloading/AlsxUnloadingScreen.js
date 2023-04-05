import React, {useState, useEffect, useRef, useCallback} from 'react';
import {withDelay, withTiming, useSharedValue} from 'react-native-reanimated';
import moment from 'moment';
import {
  View,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { getTruckUnloadingOutbound } from '../../../api/OutboundAPI';
import Header from '../../../components/Header';
import {COLORS, SIZES} from '../../../constants/theme';
import {startOfDay} from '../../../utils/DateHelpers';
import icons from '../../../constants/icons';
import Text from '../../../constants/Text'
import LineDivider from '../../../components/LineDivider';
import FilterModalDateTime from '../../../components/FilterModalDateTime';
import { dateWithSec } from '../../../utils/DateHelpers';
import {connectToRedux} from '../../../utils/ReduxConnect';
import {createLoadingSelector} from '../../../stores/selectors/LoadingSelectors';
import LoadingAction from '../../../stores/actions/LoadingActions'
import TextButton from '../../../components/TextButton';
import DatePicker from '../../../components/DatePicker/DatePicker';
import DataList from '../../../components/DataList/DataList';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';

const AlsxUnloadingScreen = ({navigation}) => {
  const today = moment();
  const [dateForFiltering, setDateForFiltering] = useState(startOfDay);
  const [isVisibleCalendar, toggleCalendar] = useState(false);
  const [isActiveCalendar, setActiveCalendar] = useState(false);
  const [isActiveIcon, setIsActiveIcon] = useState(false);
  const filterModalDatePickerSharedValue1 = useSharedValue(SIZES.height);
  const filterModalDatePickerSharedValue2 = useSharedValue(SIZES.height);
  const [searchText, setSearchText] = useState('');
  const [showVertialDatePicker, setShowverticalDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const params ={LoadingArrivalDate:'31/03/2023',TruckType:'PICK UP',Type:'EXPORT',Keyword:''};
  const onToggleCalendar = () => {
    setIsActiveIcon(true);
    setShowverticalDatePicker(true);
    filterModalDatePickerSharedValue1.value = withTiming(0, {
      duration: 100,
    });
    filterModalDatePickerSharedValue2.value = withDelay(
      100,
      withTiming(0, {
        duration: 500,
      }),
    );
  };
  const onDateChangeHandle = date =>{

  }
  const handleNavigate = track =>{
    navigation.navigate('ALSXUnloadingDetail',{
      id:track.id,
      vehicRegNo:track.vehicRegNo,
      status:track.status,
    })
  }
  const onSelectTodayHandle = () => {
    setIsActiveIcon(false);
    setSelectedDate(today);
  };
  function renderHeader() {
    return (
      <Header
        // eslint-disable-next-line react-native/no-inline-styles
        containerStyle={{
          height: 60,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
          backgroundColor: COLORS.primaryALS,
          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        title="Truck Unloading"
        rightComponent={
          <View
            style={{
              width: 35,
              height: 35,
            }}></View>
        }
        leftComponent={
          <View
            style={{
              width: 35,
              height: 35,
            }}></View>
        }

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderDatePickerHolder() {
    return (
      <View
        style={{
          marginVertical: SIZES.base * 2,
          //height:60,
          alignItems: 'center',
          backgroundColor: COLORS.lightGreen,
          flexDirection: 'row',
        }}>
        <Text>Transit Date</Text>
        <DatePicker
          onOpenCalendar={onToggleCalendar}
          selectedDate={selectedDate}
          onSelectToday={onSelectTodayHandle}
          onBackNext={() => {}}
        />
      </View>
    );
  }
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
        }}>
          <DataRenderResult
            navigation={navigation}
            params={params}
            fetchFn={getTruckUnloadingOutbound}
            render={truck=>(
              <TouchableOpacity
                style={{
                  paddingVertical:SIZES.radius,
                  paddingHorizontal:SIZES.base,
                  borderTopWidth:1,
                  borderColor:COLORS.secondaryALS,
                  flexDirection:'row'
                }}
                onPress={()=>handleNavigate(truck)}
              >
                <View
                  style={{
                    flexDirection:'row',
                    flex:3
                  }}
                >
                  <Image source={icons.truck}
                  style={{
                    width:20,
                    height:20,
                    marginRight:SIZES.base,
                    tintColor:COLORS.primaryALS
                  }} />
                     <Text primaryALS>{truck.vehicRegNo}/{truck.id}</Text>
                </View>
                <View
                  style={{
                    flexDirection:"row",
                    flex:5
                    
                  }}
                >
                <Text
                  style={{
                    flex:1
                  }}
                >{truck.status}</Text>
                <Image source={icons.right_arrow}
                  style={{
                    width:20,
                    height:20,
                    tintColor:COLORS.primaryALS
                  }}
                />
                </View>
        
              </TouchableOpacity>
            )}
          />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View
        style={{
          height: Platform.OS == 'ios' ? 90 : 60,
        }}></View>
      {renderDatePickerHolder()}
      {renderContent()}
      <FilterModalDateTime
        filterModalSharedValue1={filterModalDatePickerSharedValue1}
        filterModalSharedValue2={filterModalDatePickerSharedValue2}
        onDateChangeFunc={onDateChangeHandle}
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AlsxUnloadingScreen;
