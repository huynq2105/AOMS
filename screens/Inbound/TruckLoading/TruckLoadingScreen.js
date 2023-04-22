import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Image,Alert} from 'react-native';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import { getTruckUnloading,getTruckloading } from '../../../api/InboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT} from '../../../utils/DateHelpers';

const TruckLoadingScreen = ({navigation}) => {
  const [filterDate, setFilterDate] = useState({
    show: false,
    val: new Date(),
  });
  const today = moment();
  const [params, setParams] = useState({
    LoadingArrivalDate: DMY_FORMAT(filterDate.val),
    CustomerId: 0,
    TruckType: 'TRANSIT',
    Type: 'IMPORT',
  });
  const changeFilterDate = date => {
    setFilterDate({show: false, val: date ? date : filterDate.val});
    setParams({...params, LoadingArrivalDate: DMY_FORMAT(date)});
  };
  const handleNavigate = truck => {
    navigation.navigate('TruckUnloadingDetail', {truck: truck});
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
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              justifyContent:'center'
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
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
          marginTop:SIZES.padding
        }}>
        <DataRenderResult
          navigation={navigation}
          params={params}
          fetchFn={getTruckUnloading}
          render={truck => (
            <TouchableOpacity
              style={{
                paddingVertical: SIZES.radius,
                paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 3,
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.truck}
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: SIZES.base,
                    tintColor: COLORS.primaryALS,
                  }}
                />
                <Text primaryALS>{truck.vehicRegNo}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 5

                }}>
                <View
                  style={{
                    marginLeft:SIZES.base,
                    backgroundColor:truck?.status ==='Ready to load'? COLORS.orange : truck?.status==='Closed'?COLORS.red: truck?.status==='In Transit'?COLORS.gray: COLORS.green,
                    flex:1,
                    padding:5,
                    borderRadius:5,
                    justifyContent:'center',
                    alignItems:'center'
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                    }}>
                    {truck.status}
                  </Text>
                </View>
                <View
                style={{
                  justifyContent:'center'
                }}>
                <Image
                  source={icons.right_arrow}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.primaryALS,
                    marginLeft:SIZES.radius
                  }}
                />
                </View>
              
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
          marginTop: 60,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text h3 primaryALS>
          Pickup Date
        </Text>
        <View
          style={{
            height: 40,
            width: 100,
            borderWidth: 1,
            borderColor: COLORS.gray,
            marginLeft: SIZES.base,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{DMY_FORMAT(filterDate.val)}</Text>
        </View>
        <TouchableOpacity
          style={{
            marginLeft: SIZES.base,
          }}
          onPress={() => setFilterDate({...filterDate, show: true})}>
          <Image
            source={icons.calendar}
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.green,
            }}
          />
        </TouchableOpacity>
      </View>
      {filterDate.show && (
        <DatePicker
          modal
          mode="date"
          open={filterDate.show}
          date={filterDate.val}
          onConfirm={changeFilterDate}
          onCancel={() => setFilterDate({...filterDate, show: false})}
          minimumDate={new Date(2000, 1, 1)}
          maximumDate={new Date()}
          locale={'vi'}
        />
      )}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    }
})

export default TruckLoadingScreen;