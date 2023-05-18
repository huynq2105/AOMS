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
import { FORMAT_TIME } from '../../../../utils/DateHelpers';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import CheckComponent from '../../../../components/Checkbox';
import {
  getPoDoByVehicle,
  getTruckById,
  closeTruck,
  removeAllGroupByMawb,
  UpdatePiecesLoaded,
  AddPoDoToTruck,
  getDoByNumber,
  createPo,
} from '../../../../api/OutboundAPI';
import {ADD_TRUCK_FORMAT_TIME} from '../../../../utils/DateHelpers';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EditPoModal from '../TruckDetail/EditPoModal';
const ScanDOScreen = ({navigation, route, startLoading, stopLoading}) => {
  const truck = route?.params?.truck ?? {};
  
  const today = moment();
  const [truckDetail, setTruckDetail] = useState(null);
  const [piecesPO, setpiecesPO] = useState(0);
  const [disableButton,setDisablebutton] = useState(true);
  const [listPo, setListPo] = useState([]);
  const [totalPieces, setTotalPieces] = useState(0);
  const [check, setCheck] = useState(false);
  const textInputRef = useRef();
  const [searchText, setSearchText] = useState('');
  const loadPoDoByVehicle = () => {
    getPoDoByVehicle({maxResultCount:1000, VehicleIsn: truck.id})
      .then(({items, totalCount}) => {
        items.forEach((item, index) => {
          const result = [];
          let piece = 0;
          items.forEach((item, index) => {
            piece += item.piecesLoaded;
            const po = {
              vehicleDetailId: item.vehicleDetailId,
              id: item.doId,
              time: item.time,
              checkPo: false,
              poNumber: item.poNumber,
              piecesLoaded: item.piecesLoaded,
              pieces: item.pieces,
            };
            result.push(po);
          });
          setTotalPieces(piece);
          setListPo(result);
        });
      })
      .catch(e => console.log(e));
  };
  const handleAddSo = () => {
 
    if(searchText.length===0){
      Alert.alert('DO ko được rỗng')
      return;
    }
    const DoValue = searchText.length > 10 ? searchText.substring(0,10) : searchText
    startLoading('AddDo');
    //get DO
    getDoByNumber({DomgrDono: DoValue})
      .then(({items, totalCount}) => {
        if (totalCount > 0) {
          //ton tai DO
          scanDO(items[0].mawbId, items[0].id);
          stopLoading('AddDo');
        } else {
          var DoPo = {
            domgrDono: DoValue,
            domgrPieces: 1,
          };
          createPo(DoPo).then(data => {
            scanDO(data.mawbId, data.id);
          });
        }
      })
      .catch(e => {
       console.log(e)
      })
      .finally(() => {
        stopLoading('AddDo');
      });
  };
  function GetDateNowUCT() {
    var Now = new Date();
    var day = Now.getDate();
    var month = Now.getMonth();
    var year = Now.getFullYear();
    var hour = Now.getHours();
    var minutes = Now.getMinutes();
    return new Date(Date.UTC(year, month, day, hour, minutes));
  }
  useFocusEffect(
    useCallback(() => {
      loadPoDoByVehicle();
    }, []),
  );
  const removeSoFromTruck = () => {
    let listLabId = '';
    listPo.forEach((item, index) => {
      if (item.checkPo) {
        listLabId += item.id + ',';
      }
    });
    removeAllGroupByMawb(
      listLabId.substring(0, listLabId.length - 1),
      truck.id,
    ).then(() => {
      loadPoDoByVehicle();
    });
  };
  const handleCheckItem = (e, item) => {
    const newState = listPo.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, checkPo: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setListPo(newState);
    if (newState.every(item => item.checkPo === true)) {
      setCheck(true);
    }
    if (newState.every(item => item.checkPo === false)) {
      setDisablebutton(true);
    }
    if (newState.some(item => item.checkPo === false)) {
      setCheck(false);
    }
    if (newState.some(item => item.checkPo === true)) {
      setDisablebutton(false);
    }
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
        title="Scan DO"
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
  const ToggleCheckSearch = e => {
    setCheck(e);
    if(e){
      setDisablebutton(false)
    }else {
      setDisablebutton(true)
    }
    const newState = listPo.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, checkPo: e};
    });
    setListPo(newState);
  };
  const [modalVisibleEditPO, setModalVisibleEditPO] = useState(false);
  const handleCloseTruck = () => {
    getTruckById(truck.id)
      .then(data => {
        const truckPut = {
          ...data,
          vhclLoadingVehicleClosed: true,
          vhclLoadingVehicleClosedDate: GetDateNowUCT(),
          vhclLoadingVehicleClosedTime: ADD_TRUCK_FORMAT_TIME(today),
        };
        closeTruck(truckPut, truck.id).then(() => {
          navigation.navigate('TruckDetail',{truck:{...truck,status:'Closed'}})
        });
      })
      .catch(e => {
        console.log(e)
      });
  };
  const handleConfirm = () => {
    Alert.alert('Đóng xe', 'Bạn có chắc chắn đóng xe ' + truck.vehicRegNo, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleCloseTruck()},
    ]);
  };
  function scanDO(labId, doId) {
    var listItem = [];
    var item = {
      labId: labId ?? 0,
      doId: doId,
      pieces: 1,
    };
    listItem.push(item);
    const dataToAdd = {
      vehicleIsn: truck ? truck.id : 0,
      listItem: listItem,
    };
    startLoading('ScanDO');
    AddPoDoToTruck(dataToAdd)
      .then(() => {
        loadPoDoByVehicle();
        setSearchText('')
        setTimeout(() => {
          textInputRef.current.focus();
        }, 100);
        stopLoading('ScanDO')
      })
      .catch(e => {
        console.log(e)
      }).finally(()=>{
        stopLoading('ScanDO')
      });
  }
  const closeModalEditPO = () => {
    setModalVisibleEditPO(false);
  };
  const applyFuncEditPO = value => {
    UpdatePiecesLoaded(vedhicleEditing, value)
      .then(() => {
        closeModalEditPO();
      })
      .catch(e => console.log(e));
  };
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
           // marginTop: SIZES.base,
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
              ref={textInputRef}
              value={searchText}
              placeholder={'Scan'}
              placeholderTextColor={COLORS.primaryALS}
              onSubmitEditing={handleAddSo}
              onChangeText={text => {
                setSearchText(text);
              }}
            />
            <View></View>
            {/*  {appendComponent} */}
          </View>
        </View>
        <View
                style={{
                  marginTop: SIZES.radius,
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
                    justifyContent:'center',
                    alignItems:'center'
                  }}>
                  <Text>DO No</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    justifyContent:'center',
                    alignItems:'center'
                  }}>
                  <Text>Time PDA</Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    justifyContent:'center',
                    alignItems:'center'
                  }}>
                  <Text> Loaded</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}><Text>Edit</Text></View>
              </View>
        <FlatList
          data={listPo}
          ListFooterComponent={()=><View
            style={{
              height:1,
              marginBottom:40,
              backgroundColor:COLORS.gray
            }}
            ></View>}
           // ListHeaderComponent=null
          ItemSeparatorComponent={() => (
            <LineDivider
              lineStyle={{
                height: 1,
                backgroundColor: COLORS.gray,
               // marginTop: SIZES.base,
               // marginBottom: SIZES.base,
              }}
            />
          )}
          keyExtractor={item => `Po-${item?.id}`}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: item?.checkPo
                  ? COLORS.transparentprimaryALS
                  : null,
              }}>
              <View
                style={{
                  flex: 1,
                  paddingVertical:SIZES.radius
                }}>
                <CheckComponent
                  check={item?.checkPo}
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
                  flex: 3,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.gray,
                  justifyContent:'center',
                  alignItems:'center'
                  //backgroundColor:COLORS.green,
                }}>
                <Text h3 primaryALS>
                  {item?.poNumber}
                </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.gray,
                  justifyContent:'center',
                  alignItems:'center'
                  // backgroundColor:COLORS.lightGreen
                }}>
                <Text h3 primaryALS>
                  {FORMAT_TIME(item?.date)}
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderLeftWidth:1,
                  borderLeftColor:COLORS.gray,
                  justifyContent:'center',
                  alignItems:'center'
                  // backgroundColor:COLORS.lightGreen
                }}>
                <Text h2 primaryALS>
                  {item?.piecesLoaded}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent:'center',
                  alignItems:'center',
                  //paddingHorizontal: SIZES.radius,
                 // paddingVertical: SIZES.base,
                  flex: 1,
                  //backgroundColor:COLORS.lightGreen
                }}
                onPress={() => handleEditPO(item)}>
                <Icon
                  name="edit"
                  size={24}
                  style={{
                    color: COLORS.green,
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
            // backgroundColor:COLORS.green,
            justifyContent: 'space-between',
          }}>
          <TextButton
            label="Remove"
            buttonContainerStyle={{
              // flex:1,
              width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor:disableButton? COLORS.lightGray1: COLORS.gray,
            }}
            disabled={disableButton}
            onPress={removeSoFromTruck}
          />
          <TextButton
            label="Close"
            buttonContainerStyle={{
              backgroundColor: COLORS.red,
              width: 120,
              height: 40,
              borderRadius: SIZES.base,
            }}
            onPress={handleConfirm}
          />
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      {renderHeader()}
      <View
        style={{
          marginTop: 50,
          flex: 1,
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
            Total:{totalPieces}pcs
          </Text>
       
          <View
            style={{
              marginLeft: SIZES.base,
              backgroundColor:
                truck?.status === 'Ready to load'
                  ? COLORS.orange
                  : truck?.status === 'Closed'
                  ? COLORS.red
                  : COLORS.green,
              padding: SIZES.base,
              //padding: 3,pa
              borderRadius: 5,
            }}>
            <Text white>{truck.status}</Text>
          </View>
        </View>
        <Text h3 primaryALS style={{marginLeft: SIZES.base}}>
            {truck?.warehousePickup}
          </Text>
        {renderLoad()}
      </View>
      <EditPoModal
        modalVisible={modalVisibleEditPO}
        applyFunc={applyFuncEditPO}
        handleOffModal={closeModalEditPO}
        pieces={piecesPO}
      />
    </SafeAreaView>
  );
};

export default connectToRedux({
  component: ScanDOScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
