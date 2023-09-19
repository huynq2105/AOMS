/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import CheckComponent from '../../../../components/Checkbox';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import {
getTruckDetail,
getSumVehicleDetail,
getTruckById,
removeManyHawb,
closeTruck,
getAwbList,
getListHawbUnloading
} from '../../../../api/InboundAPI';
import {
  ADD_TRUCK_FORMAT_TIME,
  FORMAT_TIME,
} from '../../../../utils/DateHelpers';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useToast} from 'react-native-toast-notifications';
import AddSealModal from './AddSealModal';
const TruckLoadingDetailScreen = ({navigation, route, startLoading, stopLoading}) => {
  const truck = route?.params?.truck ?? {};
  const screenParent = route?.params?.screenParent;
  const toast = useToast();
  const [statusTruck,setStatusTruck] = useState(truck?.status)
  const today = moment();
  const [truckDetail, setTruckDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEditPO, setModalVisibleEditPO] = useState(false);
  const [piecesPO, setpiecesPO] = useState(0);
  const [totalMawb, setTotalMawb] = useState(0);
  const [vedhicleEditing, setVehicleEditing] = useState(0);
  const [disableButtonRemove, setDisablebuttonRemove] = useState(true);
  const textInputRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);
  const [serialNo, setSerialNo] = useState('');
  const params = {VehicleIsn: truck.id};
  const [listMawb, setListMawb] = useState([]);
  const [filterListMawb, setFilterListMawb] = useState([]);
const [totalPieces,setTotalPieces] = useState(0)
  const loadTruckDetail = () => {
    startLoading('Load data');
    getTruckDetail({VehicleIsn: truck.id})
      .then(({items, totalCount}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const result = [];
        let piece = 0;
        items.forEach((item, index) => {
          piece += item.piecesLoaded;
          const awb = {
            vehicleRegID: item.vehicleRegID,
            lagiId: item.lagiId,
            checkAwb: false,
            flightDate: item.flightDate,
            hawb: item.hawb,
            mawb: item.mawb,
            flightNo: item.flightNo,
            piecesLoaded: item.piecesLoaded,
            pieces: item.pieces,
          };
          result.push(awb);
        });
        setListMawb(result);
        setFilterListMawb(result);
        setTotalPieces(piece);
        stopLoading('Load data');
      })
      .catch(e => {
        console.log(e);
        stopLoading('Load data');
      });
  };
  useFocusEffect(
    useCallback(() => {
      getSumVehicleDetail({vehicleIsn: truck.id})
      .then(data => {
        setTruckDetail(data);
        getTruckById(truck.id).then(data => {
          setSerialNo(data.vhclSealNumber);
        });
        loadTruckDetail();
      })
      .catch(e => {
        console.log('DLV73', e);
      });
    }, []),
  );
  function GetDateNowUCT() {
    var Now = new Date();
    var day = Now.getDate();
    var month = Now.getMonth();
    var year = Now.getFullYear();
    var hour = Now.getHours();
    var minutes = Now.getMinutes();
    return new Date(Date.UTC(year, month, day, hour, minutes));
  }
  const removeAwbFromTruck = () => {
    let listObjectIsn = '';
    filterListMawb.forEach((item, index) => {
      if (item.checkAwb) {
        listObjectIsn += item.lagiId + ',';
      }
    });
    listObjectIsn = listObjectIsn.substring(0, listObjectIsn.length - 1);
    removeManyHawb(listObjectIsn, truck.id)
      .then(data => {
        toast.show('Remove DO thành công! ', {
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
        loadTruckDetail();
      })
      .catch(e => Alert.alert('Lỗi', 'Liên hệ với quản trị viên', e));
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const closeModalEditPO = () => {
    setModalVisibleEditPO(false);
  };
  const applyFunc = (vhclSealNumber,qlaNumber) => {
    getTruckById(truck.id)
      .then(data => {
        if (!data || !data?.id) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const truckPut = {
          ...data,
          vhclSealNumber: vhclSealNumber,
          vhclRacNumber:qlaNumber,
          vhclLoadingVehicleClosed:true,
          vhclLoadingVehicleClosedDate: GetDateNowUCT(),
          vhclLoadingVehicleClosedTime: ADD_TRUCK_FORMAT_TIME(today),
        };
        closeTruck(truckPut, truck.id)
          .then(data => {
            /*   if (!data || !data?.id) {
            Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
            return;
          } */
         setStatusTruck('Closed')
            closeModal();
          })
          .catch(e => {
            closeModal();
           console.log(e)
          });
      })
      .catch(e => {
        console.log(e)
      });
  };
  const applyFuncEditPO = value => {
    UpdatePiecesLoaded(vedhicleEditing, value)
      .then(data => {
        loadPoDoByVehicle();
        closeModalEditPO();
      })
      .catch(e => console.log(e));
  };
  const onChangeTextHandle = text => {
    setSearchText(text);
    if (text) {
      //making a case insensitive regular expression to get similar value from the film json
      const regex = new RegExp(`${text.trim()}`, 'i');
      //setting the filtered film array according the query from the input
      setFilterListMawb(listMawb.filter(po => po.poNumber.search(regex) >= 0));
    } else {
      //if the query is null then return blank
      setFilterListMawb(listMawb);
    }
  };
  const handleConfirm = () => {
    Alert.alert('Đóng xe', 'Bạn có chắc chắn? ' + truck.vehicRegNo, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleTransitTruck()},
    ]);
  };
  const handleCheckItem = (e, item) => {
    const newState = filterListMawb.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.lagiId === item.lagiId) {
        return {...obj, checkAwb: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setFilterListMawb(newState);
    if (newState.every(item => item.checkAwb === true)) {
      setCheck(true);
    }
    if (newState.every(item => item.checkAwb === false)) {
      setDisablebuttonRemove(true);
    }
    if (newState.some(item => item.checkAwb === false)) {
      setCheck(false);
    }
    if (newState.some(item => item.checkAwb === true)) {
      setDisablebuttonRemove(false);
    }
  };
  const ToggleCheckSearch = e => {
    setCheck(e);
    if (e) {
      setDisablebuttonRemove(false);
    } else {
      setDisablebuttonRemove(true);
    }
    const newState = filterListMawb.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, checkAwb: e};
    });
    setFilterListMawb(newState);
  };
  const handleEditPO = item => {
    setModalVisibleEditPO(true);
    setpiecesPO(item.piecesLoaded);
    setVehicleEditing(item.vehicleDetailId);
  };
  const handleTransitTruck = () => {
    getTruckById(truck.id)
      .then(data => {
        if (!data || !data?.id) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const truckPut = {
          ...data,
          vhclLoadingLeftDate: GetDateNowUCT(),
          vhclLoadingLeftTime: ADD_TRUCK_FORMAT_TIME(today),
        };
        closeTruck(truckPut, truck.id).then(() => {
          navigation.goBack();
        });
      })
      .catch(e => {
        console.log(e)
      });
  };
  const handleUncloseTruck = () => {
    getTruckById(truck.id)
      .then(data => {
        if (!data || !data?.id) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const truckPut = {
          ...data,
          vhclLoadingVehicleClosed: false,
        };
        closeTruck(truckPut, truck.id).then(() => {
          navigation.goBack();
        });
      })
      .catch(e => {
        console.log(e)
      });
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
          marginBottom: 80,
          justifyContent: 'center',
          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        title="Truck Detail"
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
            }}></View>
        }

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderAwb() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 30,
          // backgroundColor:COLORS.green,
          // width:400
        }}>
        <DataRenderResult
          navigation={navigation}
          params={params}
          fetchFn={getListHawbUnloading}
          renderSeparator={() => (
            <LineDivider
              lineStyle={{
                height: 1,
                backgroundColor: COLORS.gray,
                // marginTop:SIZES.base,
                // marginBottom:SIZES.base
              }}
            />
          )}
          renderHeader={
            <View
              style={{
                marginTop: SIZES.padding,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}></View>
              <View
                style={{
                  flex: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Awb</Text>
              </View>
           {/*    <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Time PDA</Text>
              </View> */}
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text> Loaded</Text>
              </View>
            </View>
          }
          renderFooter={
            <LineDivider
              lineStyle={{backgroundColor: COLORS.secondaryALS, height: 2}}
            />
          }
          render={truck => (
            <View
              style={{
                flexDirection: 'row',
                marginVertical:SIZES.base
              }}>
              <View
                style={{
                  flex: 1,
                  paddingVertical: SIZES.radius,
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
                  flex: 5,

                  justifyContent: 'center',
                  alignItems: 'center',
                  //backgroundColor:COLORS.green,
                }}>
                <Text body3 primaryALS>
                  {truck.mawb}/{truck.hawb}
                </Text>
                <View
                style={{
                  flexDirection:'row',
                  justifyContent:'center',
                  alignItems:'center'
                }}
                  >
                    <Image
                      source={icons.flightDepart}
                      style={{
                        width:20,
                        height:20,
                        marginRight:SIZES.base
                      }}
                      
                    />
                    <Text body3>{truck.flightNo}</Text>
                  </View>
              </View>
             {/*  <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:COLORS.lightGreen
                }}>
                <Text h3 primaryALS>
                  {FORMAT_TIME(truck.date)}
                </Text>
              </View> */}
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:COLORS.lightGreen
                }}>
                <Text h2 primaryALS>
                  {truck.piecesLoaded}/{truck.pieces}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
  function renderDetail() {
    return (
      <View
        style={{
          marginTop: 40,
          paddingHorizontal: SIZES.radius,
        }}>
        <View>
          <Text h3>Total Awb: {truckDetail?.awb}</Text>
          <Text h3>Total Pieces: {truckDetail?.piciesLoaded}</Text>
          <Text h3>Total GW Loaded: {truckDetail?.weightLoaded}</Text>
          <Text h3>Serial No: {serialNo}</Text>
        </View>
      </View>
    );
  }
  function renderLoad() {
    return (
      <View
        style={{
          flex: 1,
          padding: SIZES.base,
          marginBottom: SIZES.base,
          //marginVertical:SIZES.radius
        }}>
        <View
          style={{
            marginTop: SIZES.base,
            marginHorizontal: SIZES.padding,
            flexDirection: 'row',

            // backgroundColor: COLORS.red,
          }}>
          <CheckComponent
            check={check}
            size={24}
            color={COLORS.lightGray1}
            onPress={e => {
              ToggleCheckSearch(e);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              height: 40,
              flex: 1,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray2,
              alignItems: 'center',
              paddingHorizontal: SIZES.radius,
              borderWidth: 1,
              borderColor: COLORS.black,
            }}>
            <Image
              source={icons.search}
              style={{
                width: 23,
                height: 23,
              }}
            />
            <TextInput
              style={{
                flex: 1,
              }}
              ref={textInputRef}
              value={searchText}
              placeholder={'Search'}
              placeholderTextColor={COLORS.primaryALS}
              onChangeText={text => {
                onChangeTextHandle(text);
              }}
            />
            <View></View>
            {/*  {appendComponent} */}
          </View>
        </View>
        <FlatList
          data={filterListMawb}
          ListHeaderComponent={
            <View
              style={{
                marginTop: SIZES.padding,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}></View>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>AWB</Text>
              </View>
             {/*  <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Time PDA</Text>
              </View> */}
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text> Loaded</Text>
              </View>
             {/*  <View
                style={{
                  flex: 1,
                }}>
                <Text>Edit</Text>
              </View> */}
            </View>
          }
          ListFooterComponent={
            <View
              style={{
                //marginTop:SIZES.padding,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                marginBottom: 40,
              }}
            />
          }
          ItemSeparatorComponent={() => (
            <LineDivider
              lineStyle={{
                height: 1,
                backgroundColor: COLORS.gray,
                // marginTop:SIZES.base,
                // marginBottom:SIZES.base
              }}
            />
          )}
          keyExtractor={item => `lagi-${item?.lagiId}`}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: item?.checkAwb
                  ? COLORS.transparentprimaryALS
                  : null,
              }}>
              <View
                style={{
                  flex: 1,
                  paddingVertical: SIZES.radius,
                }}>
                <CheckComponent
                  check={item?.checkAwb}
                  size={24}
                  color={COLORS.lightGray1}
                  onPress={e => {
                    handleCheckItem(e, item);
                    //handleSeachByHawb(e)
                  }}
                />
              </View>

              <View
                style={{
                  flex: 7,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  //backgroundColor:COLORS.green,
                }}>
                <Text body2 primaryALS>
                  {item?.mawb}/{item?.hawb}
                </Text>
                <View
                  style={{
                    flexDirection:'row'
                  }}
                >
                  <Image
                    source={icons.flightDepart}
                    style={{
                      width:30,
                      height:30,
                      tintColor:COLORS.primaryALS,
                      marginRight:SIZES.base
                    }}
                  />
                <Text body2 primaryALS>
                  {item?.flightNo}
                </Text>
                </View>
              </View>
          {/*     <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:COLORS.lightGreen
                }}>
                <Text h3 primaryALS>
                  {FORMAT_TIME(item?.date)}
                </Text>
              </View> */}
              <View
                style={{
                  flex: 2,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:COLORS.lightGreen
                }}>
                {/*   <Text></Text> */}
                <Text h2 primaryALS>
                  {item?.piecesLoaded}/{item.pieces}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection:'row',
                  justifyContent:'center',
                  alignItems:'center'
                }}
                onPress={()=>navigation.navigate('Irregularity',{awb:item})}
              >
                <Image source={icons.right_arrow}
                  style={{
                    width:25,
                    height:25
                  }}
                />
              </TouchableOpacity>
              
            </View>
          )}
        />
        <View
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextButton
            label="Add"
            buttonContainerStyle={{
              // flex:1,
              // width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal: SIZES.radius,
            }}
            onPress={() => navigation.navigate('AddAwbToTruck', {truck})}
          />
          

          <TextButton
            label="Remove"
            buttonContainerStyle={{
              // flex:1,
              //   width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: disableButtonRemove
                ? COLORS.lightGray1
                : COLORS.gray,
              paddingHorizontal: SIZES.radius,
            }}
            disabled={disableButtonRemove}
            onPress={removeAwbFromTruck}
          />
          <TextButton
            label="Irregularity"
            buttonContainerStyle={{
              // flex:1,
              //  width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal: SIZES.radius,
            }}
            disabled={true}
            onPress={() => navigation.navigate('Irregularity', {})}
          />
          <TextButton
            label="Close"
            buttonContainerStyle={{
              backgroundColor: COLORS.red,
              //    width: 120,
              height: 40,
              borderRadius: SIZES.base,
              paddingHorizontal: SIZES.radius,
            }}
            onPress={()=>{setModalVisible(true)}}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: 80,
          //backgroundColor: COLORS.green,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.base,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.truck}
            style={{
              width: 40,
              height: 40,
              tintColor: COLORS.primaryALS,
            }}
          />
          <Text h3 primaryALS style={{flex: 2, marginLeft: SIZES.base}}>
            {truck?.vehicRegNo}
          </Text>
          <Text body3 primaryALS style={{flex: 2, marginLeft: SIZES.base}}>
         {/*    Total:{totalPieces}pcs */}
          </Text>
          <Text h3 primaryALS style={{flex: 1, marginLeft: SIZES.base}}>
            {truck?.warehousePickup}
          </Text>
          <View
            style={{
              marginLeft: SIZES.base,
              backgroundColor:
              statusTruck === 'Ready to load'
                  ? COLORS.orange
                  : statusTruck === 'Closed'
                  ? COLORS.red
                  : COLORS.green,
              padding: SIZES.base,
              //padding: 3,pa
              borderRadius: 5,
            }}>
            <Text white>{statusTruck}</Text>
          </View>
        </View>
      </View>

      {(statusTruck === 'Completed' ||
        statusTruck === 'Closed' ||
        statusTruck === 'In Transit' ||
        statusTruck === 'Unloading') &&
        renderDetail()} 
      {(statusTruck === 'Completed' ||
        statusTruck === 'Closed' ||
        statusTruck === 'In Transit' ||
        statusTruck === 'Unloading') &&
        renderAwb()}
      {(statusTruck === 'Loading' || statusTruck === 'Ready to load') &&
        renderLoad()}
      {statusTruck === 'Closed' && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}>
          <TextButton
            buttonContainerStyle={{
              height: 45,
              borderRadius: SIZES.base,
              paddingHorizontal: SIZES.radius,
            }}
            label="Transit To Warehouse"
            onPress={() => {
              handleConfirm()
            }}
          />
       
        </View>
      )}
      <AddSealModal
        modalVisible={modalVisible}
        applyFunc={applyFunc}
        handleOffModal={closeModal}
        truck={truck}
        totalAwb={filterListMawb.length}
      />
     {/*  <EditPoModal
        modalVisible={modalVisibleEditPO}
        applyFunc={applyFuncEditPO}
        handleOffModal={closeModalEditPO}
        pieces={piecesPO}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default connectToRedux({
  component: TruckLoadingDetailScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
