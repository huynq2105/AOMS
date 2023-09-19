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
import { updateSeal,getSealByTruckId } from '../../../../api/MasterAPI';
import {
  getPoDoByVehicle,
  getSumPoDoVehicleDetail,
  getTruckById,
  closeTruck,
  removeAllGroupByMawb,
  UpdatePiecesLoaded,
  getVihicleById,
} from '../../../../api/OutboundAPI';
import {
  ADD_TRUCK_FORMAT_TIME,
  FORMAT_TIME,
} from '../../../../utils/DateHelpers';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import AddSealModal from './AddSealModal';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EditPoModal from './EditPoModal';
import {useToast} from 'react-native-toast-notifications';

const TruckDetailScreen = ({navigation, route, startLoading, stopLoading}) => {
  const truck = route?.params?.truck ?? {};
  const screenParent = route?.params?.screenParent;
  const toast = useToast();
  const today = moment();
  const [truckDetail, setTruckDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEditPO, setModalVisibleEditPO] = useState(false);
  const [piecesPO, setpiecesPO] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);
  const [vedhicleEditing, setVehicleEditing] = useState(0);
  const [disableButtonRemove, setDisablebuttonRemove] = useState(true);
  const textInputRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);
  const [serialNo, setSerialNo] = useState('');
  const params = {VehicleIsn: truck.id};
  const [listPo, setListPo] = useState([]);
  const [filterListPo, setFilterListPo] = useState([]);
  const [numberOfDoor,setNumberOfDoor] = useState(0)
  const loadPoDoByVehicle = () => {
    startLoading('Load data');
    getPoDoByVehicle({maxResultCount:1000,skipCount:0, VehicleIsn: truck.id})
      .then(({items, totalCount}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const result = [];
        let piece = 0;
        items.forEach((item, index) => {
          piece += item.piecesLoaded;
          const po = {
            vehicleDetailId: item.vehicleDetailId,
            id: item.doId,
            checkPo: false,
            time: item.time,
            date: item.date,
            poNumber: item.poNumber,
            piecesLoaded: item.piecesLoaded,
            pieces: item.pieces,
          };
          result.push(po);
        });
        setListPo(result);
        setFilterListPo(result);
        setTotalPieces(piece);
        stopLoading('Load data');
      })
      .catch(e => {
        console.log(e);
        stopLoading('Load data');
      });
  };
 const handleApplyFunc = (data,total) =>{
  let pieces = 0;
  data.forEach((item,index)=>{
    pieces += item.piecesLoaded
  })
  setTotalPieces(pieces);
 }
 useFocusEffect(
  useCallback(() => {
    getSumPoDoVehicleDetail({vehicleIsn: truck.id})
      .then(data => {
        if (!data) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        setTruckDetail(data);
        if((truck?.status != 'Loading' && truck?.status != 'Ready to load')){
          getTruckById(truck.id).then(data => {
            // setSerialNo(data.vhclSealNumber);
             getVihicleById(truck.vehicleId).then(data=>{
              console.log('Danh sach Seal của xe===================================================',data.numberOfDoors)
               if(data.numberOfDoors){
                 setNumberOfDoor(data.numberOfDoors)
               }else{
                 setNumberOfDoor(1)
               }
               getSealByTruckId({VehicleRegId:truck.id}).then(({items,totalCount})=>{
                   let sealNo = '';
                   items.forEach((item,index)=>{
                     sealNo += item.vhslSealNumber + "-";
                   })
                   if(sealNo){
                     setSerialNo(sealNo.substring(0, sealNo.length - 1))
                   }
               })
             })
           });
        }
        
        if((truck?.status === 'Loading' || truck?.status === 'Ready to load')){
          loadPoDoByVehicle();
        }
        
      })
      .catch(e => {
        console.log('DLV73', e);
        Alert.alert('Lỗi', e.toString());
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
  const removeSoFromTruck = () => {
    let listLabId = '';
    filterListPo.forEach((item, index) => {
      if (item.checkPo) {
        listLabId += item.id + ',';
      }
    });
    removeAllGroupByMawb(listLabId.substring(0, listLabId.length - 1), truck.id)
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
        loadPoDoByVehicle();
      })
      .catch(e => Alert.alert('Lỗi', 'Liên hệ với quản trị viên', e));
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const closeModalEditPO = () => {
    setModalVisibleEditPO(false);
  };
  const applyFunc = value => {
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
        closeTruck(truckPut, truck.id)
          .then(data => {
            const listSeal = [];
            value.split('-').forEach((item,index)=>{
              listSeal.push({'value':item})
            })
            const SealPut = {vhslVehicleRegIsn:truck.id,listSeal:listSeal}
            console.log('SealPut================',SealPut)
            updateSeal(SealPut).then((data)=>{
              setSerialNo(value);
              toast.show('Cập nhật Seal thành công! ', {
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
            });
            closeModal();
          })
          .catch(e => {
            closeModal();
            Alert.alert('Lỗi', 'Liên hệ với quản trị viên', e);
          });
      })
      .catch(e => {
        Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
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
      setFilterListPo(listPo.filter(po => po.poNumber.search(regex) >= 0));
    } else {
      //if the query is null then return blank
      setFilterListPo(listPo);
    }
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
  const handleCheckItem = (e, item) => {
    const newState = filterListPo.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, checkPo: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setFilterListPo(newState);
    if (newState.every(item => item.checkPo === true)) {
      setCheck(true);
    }
    if (newState.every(item => item.checkPo === false)) {
      setDisablebuttonRemove(true);
    }
    if (newState.some(item => item.checkPo === false)) {
      setCheck(false);
    }
    if (newState.some(item => item.checkPo === true)) {
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
    const newState = filterListPo.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, checkPo: e};
    });
    setFilterListPo(newState);
  };
  const handleEditPO = item => {
    setModalVisibleEditPO(true);
    setpiecesPO(item.piecesLoaded);
    setVehicleEditing(item.vehicleDetailId);
  };
  const handleCloseTruck = () => {
    getTruckById(truck.id)
      .then(data => {
        if (!data || !data?.id) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const truckPut = {
          ...data,
          vhclLoadingVehicleClosed: true,
          vhclLoadingVehicleClosedDate: GetDateNowUCT(),
          vhclLoadingVehicleClosedTime: ADD_TRUCK_FORMAT_TIME(today),
        };
        closeTruck(truckPut, truck.id).then(() => {
          navigation.goBack();
        });
      })
      .catch(e => {
        Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
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
        Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
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
  function renderPoDo() {
    return (
      <View
        style={{
          flex: 1,
         // marginTop: 10,
          // backgroundColor:COLORS.green,
          // width:400
        }}>
          <View
              style={{
                //marginTop: 5,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems:'center',
                //  borderRightWidth:1

                }}><Text>STT</Text></View>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>DO No</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Time PDA</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text> Loaded</Text>
              </View>
            </View>
        <DataRenderResult
        applyFunc={handleApplyFunc}
          navigation={navigation}
          params={params}
          fetchFn={getPoDoByVehicle}
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
          
          renderFooter={
            <LineDivider
              lineStyle={{backgroundColor: COLORS.secondaryALS, height: 2}}
            />
          }
          render={(truck,index) => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  paddingVertical: SIZES.radius,
                  justifyContent:'center',
                  alignItems:'center',
                  borderRightWidth: 1,
                  borderRightColor: COLORS.gray,
                }}>
               <Text>{index + 1}</Text>
              </View>

              <View
                style={{
                  flex: 3,

                  justifyContent: 'center',
                  alignItems: 'center',
                  //backgroundColor:COLORS.green,
                }}>
                <Text h3 primaryALS>
                  {truck.poNumber}
                </Text>
              </View>
              <View
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
              </View>
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
                  {truck.piecesLoaded}
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
          marginTop: 5,
          paddingHorizontal: SIZES.radius,
          flexDirection:'row',
          justifyContent:'space-around'
        }}>
       
          <Text h3>W.H: <Text red h3>    {truck?.warehousePickup}</Text></Text>
          {/* <Text h3>Pieces: <Text red h3>{truckDetail?.countPcsLoaded}</Text></Text> */}
          <Text h3>Serial No: <Text red h3>{serialNo}</Text></Text>
        
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
            //marginTop: SIZES.base,
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
          data={filterListPo}
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
                <Text>DO No</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Time PDA</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text> Loaded</Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text>Edit</Text>
              </View>
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
                  paddingVertical: SIZES.radius,
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
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  //backgroundColor:COLORS.green,
                }}>
                <Text h3 primaryALS>
                  {item?.poNumber}
                </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:COLORS.lightGreen
                }}>
                <Text h3 primaryALS>
                  {FORMAT_TIME(item?.date)}
                </Text>
              </View>
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
                  {item?.piecesLoaded}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  justifyContent: 'center',
                  alignItems: 'center',
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
            justifyContent: 'space-between',
          }}>
          <TextButton
            label="Scan DO"
            buttonContainerStyle={{
              // flex:1,
              // width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal: SIZES.radius,
            }}
            onPress={() => navigation.navigate('ScanDO', {truck})}
          />
          {/* <TextButton
            label="Add from SO"
            buttonContainerStyle={{
              // flex:1,
              //  width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal: SIZES.radius,
            }}
            onPress={() => navigation.navigate('AddPoDo', {truck})}
          /> */}

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
            onPress={removeSoFromTruck}
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
            onPress={handleConfirm}
          />
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: Platform.OS === 'android' ? 80 : 40,
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
        <View>
      {/*   <Text h3 primaryALS style={{marginLeft: SIZES.base}}>
        
          </Text> */}
        </View>
     
      </View>

      {(truck?.status === 'Completed' ||
        truck?.status === 'Closed' ||
        truck?.status === 'In Transit' ||
        truck?.status === 'Unloading') &&
        renderDetail()}
      {(truck?.status === 'Completed' ||
        truck?.status === 'Closed' ||
        truck?.status === 'In Transit' ||
        truck?.status === 'Unloading') &&
        renderPoDo()}
      {(truck?.status === 'Loading' || truck?.status === 'Ready to load') &&
        renderLoad()}
      {truck?.status === 'Closed' && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}>
          {!serialNo && <TextButton
            buttonContainerStyle={{
              height: 45,
              borderRadius: SIZES.base,
              paddingHorizontal: SIZES.radius,
            }}
            label="Add Seal"
            onPress={() => {
              setModalVisible(true);
            }}
          />}
          {screenParent !== 'AddSeal' && (
            <TextButton
              buttonContainerStyle={{
                height: 45,
                backgroundColor: COLORS.red,
                borderRadius: SIZES.radius,
                paddingHorizontal: SIZES.radius,
              }}
              label="Unclosed"
              onPress={() => {
                handleUncloseTruck(true);
              }}
            />
          )}
        </View>
      )}
      <AddSealModal
        modalVisible={modalVisible}
        applyFunc={applyFunc}
        handleOffModal={closeModal}
        numberOfDoor={numberOfDoor}
        truck={truck}
      />
      <EditPoModal
        modalVisible={modalVisibleEditPO}
        applyFunc={applyFuncEditPO}
        handleOffModal={closeModalEditPO}
        pieces={piecesPO}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default connectToRedux({
  component: TruckDetailScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
