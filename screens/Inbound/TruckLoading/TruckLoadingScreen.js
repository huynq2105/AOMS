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
import {getTruckLoading} from '../../../api/InboundAPI';
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
    LoadingArrivalDate: DMY_FORMAT(filterDate.val),
    CustomerId: 0,
    TruckType: 'TRANSIT',
    Type: 'IMPORT',
  });
  const changeFilterDate = date => {
    console.log(date);
    setFilterDate({show: false, val: date ? date : filterDate.val});
    setParams({...params, LoadingArrivalDate: DMY_FORMAT(date)});
  };
  const handleNavigate = truck => {
    navigation.navigate('TruckLoadingDetail', {
      truck: truck,
      screenParent: 'TruckLoading',
    });
  };
  function renderStatus(status){
    console.log('da chay vao status',status)
    if(status==='Ready to load'|| status==='Loading' || status ==='Closed'){
      return(
        <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:COLORS.gray,
            marginVertical:13,
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
            backgroundColor:COLORS.gray,
            marginVertical:13,
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
          marginVertical:13,
          flex:1
        }}
      >
        <Text body3 white>Completed</Text>
      </View>
      )
    
    }
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
          marginTop: SIZES.padding,
          // marginHorizontal:SIZES.base
        }}>
        <DataRenderResult
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
         
          fetchFn={getTruckLoading}
          render={(truck, index) => (
            <TouchableOpacity
              style={{
                // paddingVertical: SIZES.radius,
                // paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.gray,
              
                // alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    //backgroundColor:COLORS.green
                  }}
                >
                  <View
                style={{
                  flex: 1,
                  //borderLeftWidth: 1,
                  //borderLeftColor: COLORS.gray,
                  alignItems: 'center',
                  //  paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text primaryALS body3>{index + 1}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                
                  paddingVertical: SIZES.radius,
                
                  flexDirection:'row',
               
                  alignItems:'center'
                }}>
                <Image source={icons.truckLeft} style={{
                  width:30,
                  height:30,  
                  marginRight:4
                  //tintColor:COLORS.primaryALS
                }} />
                <Text primaryALS body3>{truck.vehicRegNo}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 5,
                 // borderLeftWidth: 1,
                 // borderLeftColor: COLORS.gray,
                }}>
                 {renderStatus(truck?.status)}
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
                  flexDirection:'row',
                  justifyContent:'space-around'
                }}
              >
                <Text body3 gray>Terminal: <Text body3 black>{truck?.shedWarehouse}</Text></Text>
                <Text body3 gray>WH: <Text body3 black>{truck?.warehouse}</Text></Text>
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
        <Text body2 primaryALS style={{
            fontSize:19
          }}>
          Transit Date
        </Text>
        <View
          style={{
            height: 40,
            width: 140,
            borderWidth: 1,
            borderColor: COLORS.primaryALS,
            marginLeft: SIZES.base,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text body2 style={{
            fontSize:19
          }}>{DMY_FORMAT(filterDate.val)}</Text>
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
              tintColor: COLORS.primaryALS,
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
            backgroundColor: COLORS.primaryALS,
          }}
          onPress={() =>
            Platform.OS === 'ios'
              ? navigation.navigate('AddTruckLoading')
              : navigation.navigate('AddTruckLoading')
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

export default TruckLoadingScreen;