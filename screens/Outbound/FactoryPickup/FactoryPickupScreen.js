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
import {getTruckFactoryPickup} from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT, DMY_TIME, FORMAT_TIME} from '../../../utils/DateHelpers';
import {SafeAreaView} from 'react-native-safe-area-context';
const FactoryPickupScreen = ({navigation}) => {
  const [filterDate, setFilterDate] = useState({
    show: false,
    val: new Date(),
  });
  
  const today = moment();
  const [params, setParams] = useState({
    LoadingArrivalDate: DMY_FORMAT(filterDate.val),
    CustomerId: 0,
    TruckType: 'PICK UP',
    Type: 'EXPORT',
  });
  function renderStatus(status){
    console.log('da chay vao status',status)
    if(status==='Ready to load'|| status==='Loading' || status ==='Closed'){
      return(
        <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:COLORS.gray,
            height:24,
            flex:1
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
            flex:1
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
          flex:1
        }}
      >
        <Text body3 white>Completed</Text>
      </View>
      )
    
    }
  }
  const changeFilterDate = date => {
    console.log(date);
    setFilterDate({show: false, val: date ? date : filterDate.val});
    setParams({...params, LoadingArrivalDate: DMY_FORMAT(date)});
  };
  const handleNavigate = truck => {
    navigation.navigate('TruckDetail', {
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
        title="Truck Pickup"
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
           marginHorizontal:SIZES.base
        }}>
        <DataRenderResult
        applyFunc={handleApplyFunc}
          navigation={navigation}
          params={params}
          renderFooter={
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
              }}
            />
          }
          renderHeader={
            <View
              style={{
                flexDirection: 'row',
                borderTopColor: COLORS.gray,
                borderTopWidth: 1,
              }}>
              <View
                style={{
                  flex: 1,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  backgroundColor:COLORS.lightGray1
                }}></View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:COLORS.lightGray1
                }}>
                <Text h3>TRUCK</Text>
              </View>
              
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:COLORS.lightGray1
                }}>
                <Text h3>TIME</Text>
              </View>
              <View
                style={{
                  flex: 5,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  borderRightWidth: 1,
                  borderRightColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:COLORS.lightGray1
                  // marginRight
                }}>
                <Text h3
                  style={{
                    marginRight: SIZES.padding,
                  }}>
                  STATUS
                </Text>
              </View>
            </View>
          }
          fetchFn={getTruckFactoryPickup}
          render={(truck, index) => (
            <TouchableOpacity
              style={{
                // paddingVertical: SIZES.radius,
                // paddingHorizontal: SIZES.base,
                backgroundColor:index%2 == 1? COLORS.lightGray1 : null,
                borderTopWidth: 1,
                borderColor: COLORS.gray,
                flexDirection: 'row',
                justifyContent: 'center',
                // alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
              <View
                style={{
                  flex: 1,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
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
                  // borderLeftWidth: 1,
                  // borderLeftColor: COLORS.gray,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.radius,
                }}>
                <Text h3 primaryALS>{truck.vehicRegNo}</Text>
                {/* <Text body3> {truck.warehousePickup}</Text> */}
          {truck?.warehousePickup && <Text body4 gray>WH: <Text body3 lightGray>{truck.warehousePickup}</Text></Text>} 
              </View>
              
              <View
                style={{
                  flex: 2,
                  // borderLeftWidth: 1,
                  // borderLeftColor: COLORS.gray,
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text body3> {FORMAT_TIME(truck.loadingArrivalDate)}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 5,
                   borderRightWidth: 1,
                   alignItems:'center',
                   borderRightColor: COLORS.gray,
                }}>
                {renderStatus(truck.status)}
                <View
                  style={{
                    justifyContent: 'center',
                    marginRight:SIZES.base
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
        <Text body3 primaryALS style={{
          fontSize:17
        }}>
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
          <Text body3>{DMY_FORMAT(filterDate.val)}</Text>
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
      <View
        style={{
          position: 'absolute',

          bottom: 20,
          right: 20,
        }}>
        <IconButton
          icons={icons.plus}
          iconStyle={{
            tintColor: COLORS.white,
          }}
          containerStyle={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.green,
          }}
          onPress={() =>
            Platform.OS === 'ios'
              ? navigation.navigate('AddTruckIos')
              : navigation.navigate('AddTruckAnd')
          }
        />
      </View>
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

export default FactoryPickupScreen;
