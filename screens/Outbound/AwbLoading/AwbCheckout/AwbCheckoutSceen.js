/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import Header from '../../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../../constants/icons';
import moment from 'moment';
import {
  getListDetailTruck,
  getListPalletByMawbInTruck,
  updatePalletLocation,
  getListPalletToMove,
} from '../../../../api/OutboundAPI';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../../components/IconButton';
import {DMY_FORMAT, DMY_TIME, FORMAT_TIME} from '../../../../utils/DateHelpers';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useToast} from 'react-native-toast-notifications';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
const AwbCheckoutScreen = ({navigation, route, startLoading, stopLoading}) => {
  const {awb, truck} = route.params;
  const toast = useToast();
  console.log('Van don============', awb);
  const [pallets, setPallets] = useState([]);
  const [totalPallets, setTotalPallets] = useState(0);
  const [totalCheckout, setTotalCheckout] = useState(0);
  const [pltText, setPltText] = useState();
  const textPltRef = useRef();
  const today = moment();
  const [params, setParams] = useState({
    MawbId: awb.mawbId,
  });

  const loadData = useCallback(() => {
    startLoading('Load data');
    getListPalletToMove(params)
      .then(({items, totalCount: total}) => {
        stopLoading('Load data');
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const result = [];
        setTotalPallets(total);
        items.forEach((item, index) => {
          if (item.location != '') {
            result.push(item);
          }
        });
        setPallets(result);
        setTotalCheckout(total - result.length);
      })
      .catch(e => {
        console.log(e);
        stopLoading('Load data');
      });
  }, []);
  useEffect(() => {
    loadData();
  }, []);
  console.log('danh sach Data', pallets);
  const handleNavigate = truck => {
    navigation.navigate('TruckDetail', {
      truck: truck,
      screenParent: 'FactoryPickup',
    });
  };
  const handleApplyFunc = data => {};
  const handleCheckout = () => {
    const scanHistory = [];
    const payLoad = {pallet: pltText, location: ''};
    updatePalletLocation(payLoad)
      .then(data => {
        toast.show('Move Pallet thành công! ', {
          type: 'success',
          placement: 'top',
          swipeEnabled: true,
          style: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.green,
          },
          duration: 2000,
          animationType: 'slide-in',
        });
        setPltText('');
        loadData();
      })
      .catch(e => console.log(e));
  };
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
        title="Awbs By Truck"
        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderCheckOut() {
    return (
      <View
        style={{
          marginTop: 70,
          backgroundColor: COLORS.lightGray1,
        }}>
        {/* AWB and Quantity */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.green,
            }}>
            <Text h2 white>
              {awb.mawbNo}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.secondaryALS,
            }}>
            <Text h2>
              {totalPallets} {'>>'} {totalCheckout}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: SIZES.base,
            marginHorizontal: SIZES.padding,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text body2>Plt</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 60,
              flex: 5,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray2,
              alignItems: 'center',
              paddingHorizontal: SIZES.radius,
              borderWidth: 1,
              borderColor: COLORS.black,
            }}>
            <Image
              source={icons.barcode}
              style={{
                width: 23,
                height: 23,
              }}
            />
            <TextInput
              style={{
                flex: 1,
              }}
              ref={textPltRef}
              value={pltText}
              placeholder={'Pallet'}
              onSubmitEditing={handleCheckout}
              placeholderTextColor={COLORS.primaryALS}
              onChangeText={text => {
                setPltText(text);
              }}
            />
            {/*  {appendComponent} */}
          </View>
        </View>
      </View>
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
        <FlatList
          ListFooterComponent={
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.secondaryALS,
              }}
            />
          }
          data={pallets}
          keyExtractor={item => item.palletNo}
          ListHeaderComponent={
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
                <Text>DO No</Text>
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
                <Text body3>Plt No</Text>
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
                  Location
                </Text>
              </View>
            </View>
          }
          renderItem={({item: awb, index}) => (
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
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.radius,
                }}>
                <Text primaryALS>{awb.doNo}</Text>
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
                <Text> {awb.palletNo}</Text>
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
                    {awb.location}
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
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderCheckOut()}
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
export default connectToRedux({
  component: AwbCheckoutScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
