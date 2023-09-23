import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import {getPickupAwbs} from '../../../api/InboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT} from '../../../utils/DateHelpers';
import LineDivider from '../../../components/LineDivider';

const PickupAwbScreen = ({navigation}) => {
  const [filterDateFrom, setFilterDateFrom] = useState({
    show: false,
    val: new Date(),
  });
  const [filterDateTo, setFilterDateTo] = useState({
    show: false,
    val: new Date(),
  });

  const today = moment();
  const [params, setParams] = useState({
    FlightDateFrom: DMY_FORMAT(filterDateFrom.val),
    FlightDateTo: DMY_FORMAT(filterDateTo.val),
  });
  const changeFilterDateFrom = date => {
    setFilterDateFrom({show: false, val: date ? date : filterDateFrom.val});
    setParams({...params, FlightDateFrom: DMY_FORMAT(date)});
  };
  const changeFilterDateTo = date => {
    setFilterDateTo({show: false, val: date ? date : filterDateTo.val});
    setParams({...params, FlightDateTo: DMY_FORMAT(date)});
  };
  const handleNavigate = truck => {
    navigation.navigate('PickupAwbDetail', {awb: truck,filterDateFrom:DMY_FORMAT(filterDateFrom.val),filterDateTo:DMY_FORMAT(filterDateTo.val)});
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
        title="Pick up AWB"
        rightComponent={
          <View
            style={{
              width: 35,
              height: 35,
            }}></View>
        }
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              justifyContent: 'center',
            }}
            onPress={() => navigation.openDrawer()}>
            <Image
              source={icons.menu}
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        }

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderFlightDate() {
    return (
      <View
        style={{
          margin: SIZES.padding,
          //justifyContent:'center',
          marginTop: 70,
          //backgroundColor:COLORS.yellow,
          // alignItems:"center"
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text h3 primaryALS>
            Flight Date
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
         //   borderBottomWidth: 1,
           // borderBottomColor: COLORS.secondaryALS,
            //paddingBottom: SIZES.radius,
            //backgroundColor:COLORS.green,
            marginTop: SIZES.radius,
          }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: SIZES.base,
            }}
            onPress={() => setFilterDateFrom({...filterDateFrom, show: true})}>
            <Text body3 gray>
              {DMY_FORMAT(filterDateFrom.val)}
            </Text>
          </TouchableOpacity>
          <View>
            <Text>--</Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: SIZES.base,
            }}
            onPress={() => setFilterDateTo({...filterDateTo, show: true})}>
            <Text body3 gray>
              {DMY_FORMAT(filterDateTo.val)}
            </Text>
          </TouchableOpacity>
        </View>
        {filterDateFrom.show && (
          <DatePicker
            modal
            mode="date"
            open={filterDateFrom.show}
            date={filterDateFrom.val}
            onConfirm={changeFilterDateFrom}
            onCancel={() => setFilterDateFrom({...filterDateFrom, show: false})}
            minimumDate={new Date(2000, 1, 1)}
            maximumDate={new Date()}
            locale={'vi'}
          />
        )}
        {filterDateTo.show && (
          <DatePicker
            modal
            mode="date"
            open={filterDateTo.show}
            date={filterDateTo.val}
            onConfirm={changeFilterDateTo}
            onCancel={() => setFilterDateTo({...filterDateTo, show: false})}
            minimumDate={new Date(2000, 1, 1)}
            maximumDate={new Date()}
            locale={'vi'}
          />
        )}
      </View>
    );
  }
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
          //backgroundColor:COLORS.green,
          marginTop: -SIZES.base,
        }}>
        <DataRenderResult
          navigation={navigation}
          params={params}
          fetchFn={getPickupAwbs}
          renderFooter={<LineDivider lineStyle={{backgroundColor:COLORS.secondaryALS,height:1}} />}
          render={truck => (
            <TouchableOpacity
              style={{
                paddingVertical: SIZES.radius,
                paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
                flexDirection: 'row',
                // alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
              <View
                style={{
                  flexDirection: 'row',
                  //flex: 3,
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.awb}
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: SIZES.base,
                    tintColor: COLORS.primaryALS,
                  }}
                />
              </View>

              <View
                style={{
                  marginLeft: SIZES.base,
                  //backgroundColor:truck?.status ==='Ready to load'? COLORS.orange : truck?.status==='Closed'?COLORS.red: COLORS.green,
                  flex:1,
                  padding: 5,
                  // borderRadius:5,
                  // justifyContent:'center',
                  // alignItems:'center'
                }}>
                <Text body3 primaryALS>{truck.agentName}</Text>
                <Text body3 primaryALS>
                  HAWB Pickup/Plan:{truck.hawbPickup} / {truck.hawbPlan}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.right_arrow}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.primaryALS,
                    marginLeft: SIZES.radius,
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
      {renderFlightDate()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PickupAwbScreen;
