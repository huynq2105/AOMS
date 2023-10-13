import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import {getTruckUnloading} from '../../../api/InboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT} from '../../../utils/DateHelpers';

const TruckUnloadingScreen = ({navigation}) => {
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
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
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
          marginTop: SIZES.padding,
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

              //  alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
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
                  <Text body3 primaryALS>{truck.vehicRegNo}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 5,
                  }}>
                  <View
                    style={{
                      marginLeft: SIZES.base,
                      backgroundColor:
                        truck?.status === 'Ready to load'
                          ? COLORS.gray
                          : truck?.status === 'Closed'
                          ? COLORS.gray
                          : truck?.status === 'Transit To Warehouse'
                          ? COLORS.gray
                          : truck?.status === 'Loading'
                          ? COLORS.gray
                          : truck?.status == 'Arrived Warehouse'
                          ? COLORS.yellow
                          : truck?.status === 'Unloading'
                          ? COLORS.yellow
                          : truck?.status === 'TRANSIT TO FACTORY'
                          ? COLORS.yellow
                          : truck?.status === 'ARRIVED FACTORY'
                          ? COLORS.yellow
                          : COLORS.green,
                      flex: 1,
                      padding: 5,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                      }}>
                      {truck.status}
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
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop:SIZES.base
                }}>
                <Text body3 gray>
                  Terminal:{' '}
                  <Text body3 black>
                    {truck?.shedWarehouse}
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection:'row'
                  }}
                >
                  <Image source={icons.location} style={{
                    width:20,
                    height:20,
                    tintColor:COLORS.secondaryALS,
                    marginRight:SIZES.base
                  }} />

                
                  <Text body3 black>
                    {truck?.warehouse}
                  </Text>
           

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
          marginTop: 70,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text body3 primaryALS>
          Pickup Date
        </Text>
        <View
          style={{
            height: 40,
            width: 100,
            borderWidth: 1,
            borderColor: COLORS.green,
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
  },
});

export default TruckUnloadingScreen;
