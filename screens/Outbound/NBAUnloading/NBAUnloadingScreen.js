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
import { getDeliver } from '../../../api/OutboundAPI';
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

import DataList from '../../../components/DataList/DataList';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import DatePicker from 'react-native-date-picker'
import utils from '../../../utils/Utils'

const params ={LoadingArrivalDate:'31/03/2023'};
const NBAUnloadingScreen = ({navigation}) => {
  const [filterDate, setFilterDate] = useState({
    show: false,
    val: new Date()
  });

  const handleNavigate = track =>{
    navigation.navigate('NBAUnloadingDetail', {truck: track});
   /*  navigation.navigate('NBAUnloadingDetail',{
      id:track.id,
      vehicRegNo:track.vehicRegNo,
      status:track.status,
    }) */
  }
  const changeFilterDate = (date) => {
    setFilterDate({show: false, val: date ? date : filterDate.val});
    // loadData();
  }

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
      
      function renderContent() {
        return (
          <View
            style={{
              flex: 1,
            }}>
              <DataRenderResult
                navigation={navigation}
                params={params}
                fetchFn={getDeliver}
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
                    >{utils.getTruckStatus(truck.status).des}</Text>
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
          {
          filterDate.show && (
            <DatePicker
              modal
              mode='date'
              open={filterDate.show}
              date={filterDate.val}
              onConfirm={changeFilterDate}
              onCancel={() => setFilterDate({...filterDate, show: false})}
              minimumDate={new Date(2000, 1, 1)}
              maximumDate={new Date()}
              locale={"en"}
            />
          )
        }
           <TouchableOpacity style={{
            width:40,
            height:40,
            backgroundColor:COLORS.red,
            marginTop:50
           }} onPress={() => setFilterDate({...filterDate, show: true})}>
          <View style={styles.dateArea}>
          <Image source={icons.calendar} style={{
            width:20,
            height:20,
            tintColor:COLORS.primary
            
          }} />
            <Text style={{paddingHorizontal: 4}}>
              {moment(filterDate?.val ?? now).format('DD/MM/YYYY')}
            </Text>
          </View>
        </TouchableOpacity>
          {renderContent()}
    </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    }
})

export default NBAUnloadingScreen;