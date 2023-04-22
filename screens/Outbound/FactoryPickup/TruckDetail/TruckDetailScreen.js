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
  getPoDoByVehicle,
  getSumPoDoVehicleDetail,
  getTruckById,
  closeTruck,
  removeAllGroupByMawb,
  UpdatePiecesLoaded,
} from '../../../../api/OutboundAPI';
import {
  DELIVER_FORMAT_TIME,
  ADD_TRUCK_FORMAT_TIME,
} from '../../../../utils/DateHelpers';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import AddSealModal from './AddSealModal';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EditPoModal from './EditPoModal';
const TruckDetailScreen = ({navigation, route, startLoading, stopLoading}) => {
  const truck = route?.params?.truck ?? {};
  const today = moment();
  const [truckDetail, setTruckDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEditPO, setModalVisibleEditPO] = useState(false);
  const [piecesPO,setpiecesPO] = useState(0);
  const [vedhicleEditing,setVehicleEditing] = useState(0)
  const [disableButtonRemove,setDisablebuttonRemove] = useState(true);
  const textInputRef = useRef();
  const [searchSelected, setSearchSelected] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);
  const [checkSearch, setCheckSearch] = useState(false);
  const [serialNo,setSerialNo] = useState('')
  const params = {VehicleIsn: truck.id};
  const [listPo, setListPo] = useState([]);
  const [filterListPo,setFilterListPo]=useState([])

  const loadPoDoByVehicle = () => {
    getPoDoByVehicle({VehicleIsn: truck.id})
      .then(({items, totalCount}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        items.forEach((item, index) => {
          const result = [];
          items.forEach((item, index) => {
            const po = {
              vehicleDetailId: item.vehicleDetailId,
              id: item.doId,
              checkPo: false,
              time:item.time,
              poNumber: item.poNumber,
              piecesLoaded: item.piecesLoaded,
              pieces: item.pieces,
            };
            result.push(po);
          });
          setListPo(result);
          setFilterListPo(result)
        });
      })
      .catch(e => console.log(e));
  };
  useFocusEffect(
    useCallback(() => {
      getSumPoDoVehicleDetail({vehicleIsn: truck.id})
        .then(data => {
          if (!data) {
            Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
            return;
          }
          setTruckDetail(data);
          getTruckById(truck.id).then((data)=>{
            console.log('Truck Data',data)
            setSerialNo(data.vhclSealNumber)
          })
          loadPoDoByVehicle();
        })
        .catch(e => Alert.alert(e));
    }, []),
  );
  function GetDateNowUCT() {
    var Now = new Date();
    var day = Now.getDate();
    var month = Now.getMonth();
    var year = Now.getFullYear();
    var hour = Now.getHours();
    var minutes = Now.getMinutes();
    return new Date(Date.UTC(year, month, day, hour, minutes))
}
  const removeSoFromTruck = () => {
    let listLabId = '';
    filterListPo.forEach((item, index) => {
      if (item.checkPo) {
        listLabId += item.id + ',';
      }
    });
    removeAllGroupByMawb(listLabId.substring(0, listLabId.length - 1),truck.id).then((data) => {
     
      loadPoDoByVehicle();
    }).catch((e)=> Alert.alert('Lỗi', 'Liên hệ với quản trị viên',e));
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
          vhclSealNumber: value,
          vhclLoadingLeftDate: GetDateNowUCT(),
          vhclLoadingLeftTime: ADD_TRUCK_FORMAT_TIME(today),
        };
        closeTruck(truckPut, truck.id).then((data) => {
        /*   if (!data || !data?.id) {
            Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
            return;
          } */
          closeModal();
        }).catch((e)=>{
          closeModal();
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên',e);
        });
      })
      .catch(e => {Alert.alert('Lỗi', 'Liên hệ với quản trị viên')});
  };
  const applyFuncEditPO = value => {
    UpdatePiecesLoaded(vedhicleEditing,value).then((data)=>{
      loadPoDoByVehicle();
      closeModalEditPO();
    }).catch(e=>console.log(e))

  };
  const onChangeTextHandle = text => {
    console.log(text)
    setSearchText(text);
    if (text) {
      //making a case insensitive regular expression to get similar value from the film json
      const regex = new RegExp(`${text.trim()}`, 'i');
      //setting the filtered film array according the query from the input
      setFilterListPo(listPo.filter((po) => po.poNumber.search(regex) >= 0));
    } else {
      //if the query is null then return blank
      setFilterListPo(listPo);
    }
  };
  const handleConfirm = () => {
    Alert.alert('Đóng xe', 'Bạn có chắc chắn đóng xe' + truck.vehicRegNo, [
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
    if(e){
      setDisablebuttonRemove(false)
    }else {
      setDisablebuttonRemove(true)
    }
    const newState = filterListPo.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, checkPo: e};
    });
    setFilterListPo(newState);
  };
  const handleEditPO = (item) =>{
    setModalVisibleEditPO(true)
    setpiecesPO(item.piecesLoaded);
    setVehicleEditing(item.vehicleDetailId);

  }
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
      .catch(e => {Alert.alert('Lỗi', 'Liên hệ với quản trị viên')});
  };
  const handleUncloseTruck = () =>{
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
        console.log(truckPut);
        closeTruck(truckPut, truck.id).then(() => {
          navigation.goBack();
        });
      })
      .catch(e => {Alert.alert('Lỗi', 'Liên hệ với quản trị viên')});
  }
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
          marginTop: 30,
          // backgroundColor:COLORS.green,
          // width:400
        }}>
        <DataRenderResult
          navigation={navigation}
          params={params}
          fetchFn={getPoDoByVehicle}
          renderFooter={<LineDivider lineStyle={{backgroundColor:COLORS.secondaryALS,height:2}} />}
          render={truck => (
            <TouchableOpacity
              style={{
                paddingVertical: SIZES.radius,
                paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
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
                  source={icons.awb}
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: SIZES.base,
                    tintColor: COLORS.primaryALS,
                  }}
                />
                <Text primaryALS>{truck.poNumber}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 5,
                }}>
                  <Text
                    style={{
                      flex:1
                    }}
                  >
                    {truck.time}
                  </Text>
                <Text
                  style={{
                    //flex: 1,
                    marginLeft:SIZES.radius
                  }}>
                  {truck.piecesLoaded}
                </Text>
              </View>
            </TouchableOpacity>
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
          paddingHorizontal:SIZES.radius
        }}>
        <View>
          <Text>Total PODO: {truckDetail?.countPO}</Text>
          <Text>Total Pieces: {truckDetail?.countPcsLoaded}</Text>
          <Text>Total GW Loaded: {truckDetail?.countWeight}</Text>
          <Text>Serial No: {serialNo}</Text>
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
          data={filterListPo}
          ListHeaderComponent={<View
            style={{
              marginTop:SIZES.padding
            }}
            ></View>}
            ItemSeparatorComponent={()=><LineDivider lineStyle={{height:1,
              backgroundColor:COLORS.gray,
              marginTop:SIZES.base,
              marginBottom:SIZES.base
            }}/>}
          keyExtractor={item => `Po-${item?.id}`}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor:item?.checkPo ? COLORS.transparentprimaryALS: null
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
              <View
                style={{
                  flexDirection:'row',
                  marginLeft:SIZES.radius,
                  justifyContent:'center',
                  alignItems:'center',
                  flex:1,
                  //backgroundColor:COLORS.green,
                  paddingRight:SIZES.padding
                }}
              >
                <Text h2 primaryALS>{item?.poNumber}</Text>
                <View
                  style={{
                    flex:1,
                    backgroundColor:COLORS.red
                  }}
                ></View>
                <Text h2 primaryALS>{item?.piecesLoaded}/{item?.pieces}</Text>
              </View>
              <TouchableOpacity
                onPress={()=>handleEditPO(item)}
              >
                <Icon name='edit' size={24} style={{
                  color:COLORS.green
                }} />
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
              paddingHorizontal:SIZES.radius
            }}
            onPress={() => navigation.navigate('ScanDO', {truck})}
          />
          <TextButton
            label="Add from SO"
            buttonContainerStyle={{
              // flex:1,
            //  width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal:SIZES.radius
            }}
            onPress={() => navigation.navigate('AddPoDo', {truck})}
          />
         
          <TextButton
            label="Remove"
            buttonContainerStyle={{
              // flex:1,
           //   width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor:disableButtonRemove? COLORS.lightGray1: COLORS.gray,
              paddingHorizontal:SIZES.radius
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
              paddingHorizontal:SIZES.radius
            }}
            onPress={handleConfirm}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View
        style={{
          marginTop: 80,
          //backgroundColor: COLORS.green,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.base,
            justifyContent:'center',
            alignItems:'center'
          }}>
          <Image
            source={icons.truck}
            style={{
              width: 40,
              height: 40,
              tintColor: COLORS.primaryALS,
            }}
          />
          <Text h2 primaryALS style={{flex: 1,marginLeft:SIZES.base}}>
            {truck?.vehicRegNo}
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
                  padding:SIZES.base,
              //padding: 3,pa
              borderRadius: 5,
            
            }}>
            <Text white
              >
              {truck.status}
            </Text>
          </View>
        </View>
      </View>

      {(truck?.status === 'Completed' || truck?.status === 'Closed'|| truck?.status === 'In Transit'|| truck?.status === 'Unloading' ) && renderDetail()}
      {(truck?.status === 'Completed' || truck?.status === 'Closed'|| truck?.status === 'In Transit'|| truck?.status === 'Unloading') && renderPoDo()}
      {(truck?.status === 'Loading' || truck?.status === 'Ready to load') &&
        renderLoad()}
      {truck?.status === 'Closed' && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            justifyContent:'space-around',
            flexDirection:'row'
          }}>
          <TextButton
            buttonContainerStyle={{
              height: 45,
              borderRadius:SIZES.base,
              paddingHorizontal:SIZES.radius
            }}
            label="Add Seal"
            onPress={() => {
              setModalVisible(true);
            }}
          />
            <TextButton
            buttonContainerStyle={{
              height: 45,
              backgroundColor:COLORS.red,
              borderRadius:SIZES.radius,
              paddingHorizontal:SIZES.radius
            }}
            label="Unclosed"
            onPress={() => {
              handleUncloseTruck(true);
            }}
          />
        </View>
      )}
      <AddSealModal
        modalVisible={modalVisible}
        applyFunc={applyFunc}
        handleOffModal={closeModal}
      />
      <EditPoModal
        modalVisible={modalVisibleEditPO}
        applyFunc={applyFuncEditPO}
        handleOffModal={closeModalEditPO}
        pieces={piecesPO}
         />
    </View>
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
