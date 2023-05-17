import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Image,Alert} from 'react-native';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import {getTruckFactoryPickup} from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT,FORMAT_TIME} from '../../../utils/DateHelpers';
const TruckSealScreen = ({navigation}) => {
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
    Status:'Closed'
  });
  const changeFilterDate = date => {
    setFilterDate({show: false, val: date ? date : filterDate.val});
    setParams({...params, LoadingArrivalDate: DMY_FORMAT(date)});
  };
  const handleNavigate = truck => {
    navigation.navigate('TruckDetail', {truck: truck,screenParent:'AddSeal'});
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
        title="Add Seal"
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
        }}>
        <DataRenderResult
          navigation={navigation}
          params={params}
          renderFooter={<View
            style={{
              borderBottomWidth:1,
              borderBottomColor:COLORS.secondaryALS
            }}
            ></View>}
          renderHeader={
            <View
              style={{
                flexDirection: 'row',
                borderTopColor:COLORS.secondaryALS,
                borderTopWidth:1
              }}>
                {/* <View
                style={{
                  flex: 1,
                }}>
              </View> */}
              <View
                style={{
                  flex: 3,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                  paddingHorizontal:5,
                  paddingVertical:SIZES.base,
                  justifyContent:"center",
                  alignItems:'center',
                }}>
                <Text primaryALS>Truck No</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                 // paddingHorizontal:SIZES.radius,
                  justifyContent:"center",
                  alignItems:'center',
                }}>
                <Text primaryALS>W.H</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                 // paddingHorizontal:SIZES.radius,
                  justifyContent:"center",
                  alignItems:'center',
                }}>
                <Text primaryALS>Time</Text>
              </View>
              <View
                style={{
                  flex: 4,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                  justifyContent:"center",
                  alignItems:'center',
                 // marginRight
                }}>
                <Text primaryALS
                  style={{
                    marginRight:SIZES.padding
                  }}
                >Status</Text>
              </View>
            </View>
          }
          fetchFn={getTruckFactoryPickup}
          render={truck => (
            <TouchableOpacity
              style={{
               // paddingVertical: SIZES.radius,
               // paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
                flexDirection: 'row',
                justifyContent:'center'
               // alignItems: 'center',
              }}
              onPress={() => handleNavigate(truck)}>
              {/* <View
                style={{
                  //flexDirection: 'row',
                  flex: 1,
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
              </View> */}
              <View
                style={{
                  flex: 3,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                  paddingHorizontal:5,
                  paddingVertical:SIZES.radius
                }}>
                <Text primaryALS>{truck.vehicRegNo}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                  //paddingHorizontal:SIZES.radius,
                  justifyContent:'center'
                }}>
                <Text> {truck.warehousePickup}</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                  //paddingHorizontal:SIZES.radius,
                  justifyContent:'center'
                }}>
                <Text> {FORMAT_TIME(truck.date)}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 4,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.secondaryALS,
                
                 
                }}>
                <View
                  style={{
                   // marginLeft: SIZES.base,
                    flex: 1,
                    justifyContent:'center',
                    alignItems:'center',
                   // padding: 5,
                  //  borderRadius: 5,
                    //justifyContent: 'center',
                    //alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      //flex: 1,
                      color: truck?.status === 'Ready to load'
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
    <View style={styles.container}>
      {renderHeader()}
      <View
        style={{
          marginTop: 80,
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
      <View
        style={{
          position: 'absolute',

          bottom: 20,
          right: 20,
        }}>
        <IconButton
          icons={icons.plus}
          iconStyle={{
            tintColor:COLORS.white
          }}
          containerStyle={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.green,
          }}
          onPress={() => navigation.navigate('AddTruck')}
        />
      </View>
    </View>
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

export default TruckSealScreen;
