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
  getListHawbUnloading
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
import { DMY_FORMAT,DMY_TIME } from '../../../../utils/DateHelpers';
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
    const [listHawb,setListHawb] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [check, setCheck] = useState(false);
    const textInputRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const applyFuc = (value)=>{
        closeModal();
        let listLagisId = '';
        listHawb.forEach((item, index) => {
          if (item.checkHawb) {
            listLagisId += item.lagiId + ',';
          }
          
        });
        if(listLagisId.length > 2){
          updateStatusHawb(listLagisId.substring(0, listLagisId.length - 1),value,DMY_TIME(today)).then(()=>{
            loadHawb()
          })
        }
        
       
    }
    const closeModal = () => {
        setModalVisible(false);
      };
    const loadHawb = () => {
        getPickupAwbDetail({KundId: awb.kundId,FlightDate:fligtDate})
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
                   checkHawb:false
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
            loadData()
        }, []),
      );
      const [truckDetail, setTruckDetail] = useState({
        vhclLoadingArrivalDate: truck.vhclLoadingArrivalDate,
        vhclRemarks: '',
      });
      const [status, setStatus] = useState(0);
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
          })
          .catch(e => {
            console.log('DLVD84', e);
          })
          .finally(function () {
            stopLoading({key: 'deliverDetail'});
          });
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
          marginTop: 30,
          // backgroundColor:COLORS.green,
          // width:400
        }}>
        <DataRenderResult
          navigation={navigation}
          params={params}
          fetchFn={getListHawbUnloading}
          renderFooter={<LineDivider lineStyle={{backgroundColor:COLORS.secondaryALS,height:2}} />}
          render={truck => (
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
                        flexDirection:'row'
                    }}
                >
                     <Image
                  source={icons.truck}
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
               
                <Text primaryALS>{truck.mawb}/{truck.hawb}</Text>
                <View
                style={{
                  flexDirection: 'row',
                  flex: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                  }}>
                  {truck.piecesLoaded}/{truck.pieces}
                </Text>
              </View>
              </View>
             <View>
                {truck.piecesLoaded ===truck.pieces &&<Image source={icons.correct} style={{
                    width:20,
                    height:20,
                    tintColor:COLORS.blue
                }} /> } 
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
    
    
          {renderPoDo()}
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
          <Text white h3>{getStatusButtonSave(status)}</Text>
        </TouchableOpacity>
      </View>
        </View>
      
  );

};
const styles = StyleSheet.create({
    container: {
        flex:1
    }
})
export default connectToRedux({
  component: TruckUnloadingDetailScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
