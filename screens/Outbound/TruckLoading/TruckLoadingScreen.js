/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import {getTruckLoading} from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT, DMY_TIME, FORMAT_TIME} from '../../../utils/DateHelpers';
import {SafeAreaView} from 'react-native-safe-area-context';
const TruckLoadingScreen = ({navigation}) => {
  const [filterDate, setFilterDate] = useState({
    show: false,
    val: new Date(),
  });
  const today = moment();
  const [params, setParams] = useState({
    status: 'Loading',  
  });
  const changeFilterDate = date => {
    console.log(date);
    setFilterDate({show: false, val: date ? date : filterDate.val});
    setParams({...params, LoadingArrivalDate: DMY_FORMAT(date)});
  };
  
  const handleNavigate = truck => {
    navigation.navigate('AwbByTruckLoading', {
      truck: truck,
      screenParent: 'FactoryPickup',
    });
  };
  const handleApplyFunc = (data) =>{

  }
  function renderHeader() {
    return (
      <Header
        containerStyle={{
          height: 60,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
          //backgroundColor: COLORS.green,
          flex: 1,
          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              //backgroundColor:COLORS.red,
              // alignItems:'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        }
        rightComponent={
          <View
            style={{
              width: 35,
              height: 35,
            }}
          />
        }
        title="Truck Loading"
        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: SIZES.base,
          // marginHorizontal:SIZES.base
        }}>
        <DataRenderResult
        applyFunc={handleApplyFunc}
          navigation={navigation}
          params={params}
          renderFooter={
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.secondaryALS,
              }}
            />
          }
          renderHeader={
            <View
              style={{
                flexDirection: 'row',
                borderTopColor: COLORS.secondaryALS,
                borderTopWidth: 1,
              }}>
              <View
                style={{
                  flex: 1,
                }}></View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Truck No</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                   //paddingHorizontal: SIZES.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text body3>W.H</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Time</Text>
              </View>
              <View
                style={{
                  flex: 5,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // marginRight
                }}>
                <Text
                  style={{
                    marginRight: SIZES.padding,
                  }}>
                  Status
                </Text>
              </View>
            </View>
          }
          fetchFn={getTruckLoading}
          render={(truck, index) => (
            <TouchableOpacity
              style={{
                // paddingVertical: SIZES.radius,
                // paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
                flexDirection: 'row',
                justifyContent: 'center',
                // alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
              <View
                style={{
                  flex: 1,
                  //borderLeftWidth: 1,
                  //borderLeftColor: COLORS.secondaryALS,
                  alignItems: 'center',
                  //  paddingHorizontal: SIZES.radius,
                 justifyContent: 'center',
                }}>
                <Text>{index + 1}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.radius,
                }}>
                <Text primaryALS>{truck.truckNo}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  alignItems: 'center',
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text> {truck.unloadingWarehouse}</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text> {FORMAT_TIME(truck.loadingArrivalDate)}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 5,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      //flex: 1,
                      color:
                        truck?.status === 'Ready to load'
                          ? COLORS.gray
                          : truck?.status === 'Closed'
                          ? COLORS.red
                          : COLORS.green,
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
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 80 : 60,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {/* <Text h3 primaryALS>
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
        </TouchableOpacity> */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    //padding: 16,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 35,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TruckLoadingScreen;
