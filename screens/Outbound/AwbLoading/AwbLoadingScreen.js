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
import {getAwbLoading} from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT, DMY_TIME, FORMAT_TIME} from '../../../utils/DateHelpers';
import {SafeAreaView} from 'react-native-safe-area-context';
const AwbLoadingScreen = ({navigation, route}) => {
  const {truck} = route.params;

  const today = moment();
  const [params, setParams] = useState({
  });

  const handleNavigate = awb => {
    navigation.navigate('AwbCheckout', {
      awb: awb,
    });
  };
  const handleApplyFunc = data => {};
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
        title="Awbs Loading"
        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: SIZES.base + 60,
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
                  flex: 4,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Mawb</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  //paddingHorizontal: SIZES.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text body3>Pieces</Text>
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
                <Text>Dest</Text>
              </View>
              <View
                style={{
                  flex: 2,
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
                  FWD
                </Text>
              </View>
            </View>
          }
          fetchFn={getAwbLoading}
          render={(awb, index) => (
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
              onPress={() => handleNavigate(awb)}>
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
                  flex: 4,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.radius,
                  alignItems:'center'
                }}>
                <Text primaryALS>{awb.mawbNo}</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  alignItems: 'center',
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                
                }}>
                <Text> {awb.pieces}</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  alignItems: 'center',
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text> {awb.dest}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    // marginLeft: SIZES.base,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // padding: 5,
                    //  borderRadius: 5,
                    //justifyContent: 'center',
                    //alignItems: 'center',
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
                    {awb.remarks}
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

export default AwbLoadingScreen;
