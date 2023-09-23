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
import api from '../../../../api/API';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import CheckComponent from '../../../../components/Checkbox';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import {
  getPickupAwbDetail,
  updateStatusHawb,
  getListHawbUnloading,
  getTruckById
} from '../../../../api/InboundAPI';
import {
  DELIVER_FORMAT_TIME,
  ADD_TRUCK_FORMAT_TIME,
} from '../../../../utils/DateHelpers';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DMY_FORMAT, DMY_TIME} from '../../../../utils/DateHelpers';
const getStatusButtonSave = function (status) {
  if (status === 0) {
    return 'Arrived To Warehouse';
  } else if (status === 1) {
    return 'Start unloading';
  } else if (status === 2) {
    return 'Complete';
  } else if (status === 3) {
    return 'Complete';
  } else return 'Complete';
};
const selectKey = {
  intransit: 0,
  arrive: 1,
  unload: 2,
  complete: 3,
};
const TruckUnloadingDetailScreen = ({
  navigation,
  route,
  loading,
  startLoading,
  stopLoading,
}) => {
  const truck = route?.params?.truck ?? {};
  const today = moment();
  const [listHawb, setListHawb] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);
  const textInputRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [serialNo, setSerialNo] = useState('');
  const[truckData,setTruckData] = useState();
  const [listMawb, setListMawb] = useState([]);
  const [filterListMawb, setFilterListMawb] = useState([]);
  const [totalPieces, setTotalPieces] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const applyFuc = value => {
    closeModal();
    let listLagisId = '';
    listHawb.forEach((item, index) => {
      if (item.checkHawb) {
        listLagisId += item.lagiId + ',';
      }
    });
    if (listLagisId.length > 2) {
      updateStatusHawb(
        listLagisId.substring(0, listLagisId.length - 1),
        value,
        DMY_TIME(today),
      ).then(() => {
        loadHawb();
      });
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const loadHawb = () => {
    getPickupAwbDetail({KundId: awb.kundId, FlightDate: fligtDate})
      .then(({items, totalCount}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        items.forEach((item, index) => {
          const result = [];

          items.forEach((item, index) => {
            const hawb = {
              ...item,
              checkHawb: false,
            };
            result.push(hawb);
          });
          setListHawb(result);
        });
      })
      .catch(e => console.log(e));
  };
  const params = {VehicleIsn: truck.id};
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );
  // console.log('Truck Detail=================================',truckData)
  const [truckDetail, setTruckDetail] = useState({
    vhclLoadingArrivalDate: truck.vhclLoadingArrivalDate,
    vhclRemarks: '',
  });
  const [status, setStatus] = useState(0);
  const loadTruckDetail = () => {
    console.log('loadTruckDetail==========================',truck.id)
    startLoading('Load data');
    getListHawbUnloading({VehicleIsn: truck.id})
      .then(({items, totalCount}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        console.log('loadTruckDetail items==========================',items)
        const result = [];
        let piece = 0;
        let weight = 0;
        items.forEach((item, index) => {
          piece += item.piecesLoaded;
          weight += item.weightLoaded;
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
        setTotalWeight(weight)
        stopLoading('Load data');
      })
      .catch(e => {
        console.log(e);
        stopLoading('Load data');
      });
  };
  const loadData = function () {
    if (loading) return;
    startLoading({key: 'deliverDetail'});
    api
      .get('/api/master-data-module/vehicles-registrations/' + truck.id)
      .then(({data}) => {
        if (!data || data.id !== truck.id) {
          Alert.alert('Lỗi', 'Không thể lấy dữ liệu!');
          navigation.goBack();
          return;
        }
        setTruckData(data)
        let status = selectKey.intransit;
        if (data.vhclVehicleComplete) status = selectKey.complete;
        else if (data.vhclUnloadingActivationDate) status = selectKey.unload;
        else if (data.vhclUnloadingArrivalDate) status = selectKey.arrive;
        // else if (data.vhclLoadingLeftDate) status = 'In Transit';

        let fltDate = new Date();
        if (status === selectKey.arrive) {
          fltDate = moment(data?.vhclUnloadingArrivalDate ?? fltDate);
        } else if (status === selectKey.unload) {
          fltDate = moment(data?.vhclUnloadingActivationDate ?? fltDate);
        } else if (status === selectKey.complete) {
          fltDate = moment(data?.vhclCompletedDate ?? fltDate);
        }

        setStatus(status);
        //setFilterDate({val: fltDate.toDate() || new Date()});
        setTruckDetail(data);
        loadTruckDetail();
        getTruckById(truck.id).then(data => {
          setSerialNo(data.vhclSealNumber);
        });
      })
      .catch(e => {
        console.log('DLVD84', e);
      })
      .finally(function () {
        stopLoading({key: 'deliverDetail'});
      });
  };
  function renderDetail() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.radius,
        }}>
        <View>
          <Text body3>Total Awb: {listMawb.length}</Text>
          <Text body3>Total Pieces: {totalPieces}</Text>
          <Text body3>Total GW Loaded: {totalWeight}</Text>
          <Text body3>Seal Number: {serialNo}</Text>
        </View>
      </View>
    );
  }
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
  const handleConfirm = async () => {
    if (loading) return;
    const isoDate = moment(today).format('YYYY-MM-DDTHH:mm:ss.000Z');
    const isoTime = moment(today).format('HHmm');
    if (status === selectKey.intransit) {
      truckDetail['vhclUnloadingArrivalDate'] = isoDate;
      truckDetail['vhclUnloadingArrivalTime'] = isoTime;
    } else if (status === selectKey.arrive) {
      truckDetail['vhclUnloadingActivationDate'] = isoDate;
      truckDetail['vhclUnloadingActivationTime'] = isoTime;
    } else if (status === selectKey.unload) {
      truckDetail['vhclVehicleComplete'] = true;
      truckDetail['vhclCompletedDate'] = isoDate;
      truckDetail['vhclCompletedTime'] = isoTime;
      /* try {
            await api.post(
              '/api/master-data-module/vhld-vehicledetails/update-qty-weight/' +
                truck.id,
            );
          } catch (e) {
            Toast.show({
              text: e.toString(),
              buttonText: 'x',
              duration: 10000,
              type: 'danger',
              textStyle: {textAlign: 'center'},
              swipeDisabled: true,
            });
          } */
    }
    startLoading({key: 'deliverDetail'});
    api
      .put(
        '/api/master-data-module/vehicles-registrations/' + truck.id,
        truckDetail,
      )
      .then(({data}) => {
        navigation.goBack();
        return data;
      })
      .finally(function () {
        stopLoading({key: 'deliverDetail'});
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
        title="Pickup Awb Detail"
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
         // marginTop: 30,
          // backgroundColor:COLORS.green,
          // width:400
        }}>
        <FlatList
          keyExtractor={item => `lagi-${item?.lagiId}`}
          ListFooterComponent={
            <LineDivider
              lineStyle={{backgroundColor: COLORS.secondaryALS, height: 2}}
            />
          }
          data={filterListMawb}
          renderItem={({item,index}) => (
            <TouchableOpacity
              style={{
                paddingVertical: SIZES.radius,
                paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
                flexDirection: 'row',
                // alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  source={item.awb}
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
                  // flexDirection: 'row',
                  flex: 1,
                  //alignItems: 'center',
                }}>
                <Text body3 primaryALS>
                  {item.mawb} / {item.hawb}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 5,
                  }}>
                  <Image
                    source={icons.awb_unload}
                    style={{width: 25, height: 25, marginRight: SIZES.base}}
                  />
                  <Text
                    body3
                    style={{
                      flex: 1,
                    }}>
                    {item.piecesLoaded}/{item.pieces}
                  </Text>
                </View>
              </View>
              <View>
                {item.piecesLoaded === item.pieces && (
                  <Image
                    source={icons.correct}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: COLORS.blue,
                    }}
                  />
                )}
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
            source={icons.truckLeft}
            style={{
              width: 40,
              height: 40,
              //tintColor: COLORS.primaryALS,
            }}
          />
          <Text
            body3
            primaryALS
            style={{flex: 1, marginLeft: SIZES.base, fontSize: 19}}>
            {truck?.vehicRegNo}
          </Text>
          <View
            style={{
              marginLeft: SIZES.base,
              backgroundColor:
              truck?.status ==='Ready to load'? COLORS.gray 
              : truck?.status==='Closed'?COLORS.gray
              : truck?.status==='Transit To Warehouse'?COLORS.gray
              : truck?.status==='Loading'?COLORS.gray
              : truck?.status==='Arrived WareHouse'?COLORS.yellow
              : truck?.status==='Unloading'?COLORS.yellow
              : truck?.status==='TRANSIT TO FACTORY'?COLORS.yellow
              : truck?.status==='ARRIVED FACTORY'?COLORS.yellow
              : COLORS.green,
              padding: SIZES.base,
              //padding: 3,pa
              borderRadius: 5,
            }}>
            <Text white>{truck.status}</Text>
          </View>
        </View>
        {/* render Search */}
      </View>
      {/* <View
        style={{
          margin: SIZES.base,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightGray1,
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
        </View>
      </View> */}
         
      {renderDetail()}
      {renderPoDo()}
      {truck?.status !== 'Completed' && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 20,
            right: 20,
            flexDirection: 'row',
            justifyContent: 'center',

            alignItems: 'center',
          }}>
          <TouchableOpacity
            warning
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: SIZES.radius,
              paddingVertical: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.green,
            }}
            onPress={handleConfirm}
            disabled={loading}>
            <Text white h3>
              {getStatusButtonSave(status)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default connectToRedux({
  component: TruckUnloadingDetailScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
