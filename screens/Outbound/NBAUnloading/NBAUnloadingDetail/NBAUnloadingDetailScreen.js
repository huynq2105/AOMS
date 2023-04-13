import React, {useState, useEffect, useRef, useCallback} from 'react';
import {withDelay, withTiming, useSharedValue} from 'react-native-reanimated';
import moment from 'moment';
import {StyleSheet, View, ScrollView, TouchableOpacity, Alert, Pressable, Image,Platform, TextInput} from 'react-native';
import { getPoDoByVihicle } from '../../../../api/OutboundAPI';
import Header from '../../../../components/Header';
import {COLORS, SIZES} from '../../../../constants/theme';
import {startOfDay} from '../../../../utils/DateHelpers';
import icons from '../../../../constants/icons';
import Text from '../../../../constants/Text'
import LineDivider from '../../../../components/LineDivider';
import FilterModalDateTime from '../../../../components/FilterModalDateTime';
import { dateWithSec } from '../../../../utils/DateHelpers';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import Icon  from 'react-native-vector-icons/MaterialIcons'
import TextButton from '../../../../components/TextButton';
import DataList from '../../../../components/DataList/DataList';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import api from '../../../../api/API'
import apiUpload from '../../../../api/ApiUpload'
import DatePicker from 'react-native-date-picker'

const selectKey = {
    arrive: 1,
    unload: 2,
    complete: 3,
  };
  const defaultImage = require('../../../../assets/images/thumb.png');
  const selectData = {
    assignee: [
      {id: selectKey.arrive, label: 'Arrive cargo terminal'},
      {id: selectKey.unload, label: 'Start unloading'},
      {id: selectKey.complete, label: 'Complete'},
    ],
  };
  
  const PICKER_MODE = {
    date: 'date',
    time: 'time',
  };
  
  const config = {
    folderName: 'aoms_mobile_deliver',
    folderId: '',
  };
  
const NBAUnloadingDetailScreen = ({route, navigation, loading, startLoading, stopLoading}) => {
  const truck = route?.params?.truck ?? {};
    const [truckDetail, setTruckDetail] = useState({
        vhclLoadingArrivalDate: truck.vhclLoadingArrivalDate,
        vhclRemarks: '',
      });
      const [status, setStatus] = useState(selectKey.arrive);
      const [files, setFiles] = useState([]);
      const [filterDate, setFilterDate] = useState({
        show: false,
        mode: PICKER_MODE.date,
        val: new Date()
      });
      const [fullImage, setFullImage] = useState(null);
      const [img,setImg] = useState(null)
      useEffect(() => {
        loadFolderConfig().then(dt => null);
        loadData();
      }, []);
      const loadFolderConfig = async () => {
        let result = await api.get(
          '/api/file-management/directory-descriptor',
          {params: {Filter: config.folderName}}
        );
        let data = result?.data;
        if (!data || !data?.items || !Array.isArray(data?.items) || data?.items?.length < 1) {
          result = await api.post(
            '/api/file-management/directory-descriptor',
            {"parentId": null, "name": config.folderName}
          );
          let data = result?.data;
          if (!data || !data?.id) {
            Alert.alert('Lỗi', 'Không thể tạo thư mục lưu file!');
            navigation.goBack();
            return;
          }
          config.folderId = data.id;
        } else {
          let item = null;
          for (let i = 0; i < data?.items?.length; i++) {
            let tmp = data?.items[i];
            if (tmp?.name === config.folderName) {
              item = tmp;
              break;
            }
          }
          if (!item) {
            Alert.alert('Lỗi', 'Không tìm thấy thư mục lưu file!');
            navigation.goBack();
            return;
          }
          config.folderId = item.id;
        }
        await loadDeliverImg();
    
      }
      const loadDeliverImg = () => {
        api.get(
          '/api/master-data-module/vehicles-registrations/GetListVhrFileByVhrId',
          {params: {vehiclesRegistrationId: truck.id}}
        ).then(({data}) => setFiles(data?.items ?? []));
      }
      const loadData = function () {
        if (loading) return;
        startLoading({key: 'deliverDetail'});
        api.get(
          '/api/master-data-module/vehicles-registrations/' + truck.id
        ).then(({data}) => {
          if (!data || data.id !== truck.id) {
            Alert.alert('Lỗi', 'Không thể lấy dữ liệu!');
            navigation.goBack();
            return;
          }
          let status = selectKey.arrive;
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
          setFilterDate({val: fltDate.toDate() || new Date()});
          setTruckDetail(data);
        }).catch(e => {
          console.log('DLVD84', e);
          Alert.alert('Lỗi', e.toString());
        }).finally(function () {
          stopLoading({key: 'deliverDetail'});
        });
      }
      const handleConfirm = async () => {
        if (loading) return;
        const isoDate = moment(filterDate.val).format('YYYY-MM-DDTHH:mm:ss.000Z');
        const isoTime = moment(filterDate.val).format('HHmm');
        if (status === selectKey.arrive) {
          truckDetail['vhclUnloadingArrivalDate'] = isoDate;
          truckDetail['vhclUnloadingArrivalTime'] = isoTime;
        } else if (status === selectKey.unload) {
          truckDetail['vhclUnloadingActivationDate'] = isoDate;
          truckDetail['vhclUnloadingActivationTime'] = isoTime;
        } else if (status === selectKey.complete) {
          truckDetail['vhclVehicleComplete'] = true;
          truckDetail['vhclCompletedDate'] = isoDate;
          truckDetail['vhclCompletedTime'] = isoTime;
          try {
            await api.post('/api/master-data-module/vhld-vehicledetails/update-qty-weight/' + truck.id)
          } catch (e) {
            Toast.show({
              text: e.toString(),
              buttonText: 'x',
              duration: 10000,
              type: 'danger',
              textStyle: {textAlign: 'center'}, swipeDisabled: true
            });
          }
        }
        startLoading({key: 'deliverDetail'});
        api.put(
          '/api/master-data-module/vehicles-registrations/' + truck.id, truckDetail
        ).then(({data}) => {
          navigation.goBack();
          return data;
        }).finally(function () {
          stopLoading({key: 'deliverDetail'});
        });
      };
      const options = {
        title: 'Select Image',
        customButtons: [
          {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
        ],
        storageOptions: {skipBackup: true, path: 'images'},
        maxWidth: 768, maxHeight: 1024,
      };
      const onCameraResult = (response) => {
        if (response.didCancel) {
          console.log('Cancel image picker')
         /*  Toast.show({
            text: 'Cancel image picker',
            buttonText: 'x',
            duration: 10000,
            type: 'danger',
            textStyle: {textAlign: 'center'}, swipeDisabled: true
          }); */
        } else if (response.errorCode) {
          console.log(response.errorCode)
         /*  Toast.show({
            text: response.errorMessage,
            buttonText: 'x',
            duration: 10000,
            type: 'danger',
            textStyle: {textAlign: 'center'}, swipeDisabled: true
          }); */
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          if (loading) return;
          console.log('Upload Start!');
          startLoading({key: 'deliverDetail'});
          if (Array.isArray(response.assets) && response.assets.length > 0) {
            let firstAssets = response.assets[0];
            setImg(firstAssets?.uri);
            let addFile = {
              uri: firstAssets?.uri,
              name: firstAssets?.fileName?.replace('rn_image_picker_lib_temp', 'deliver_dt'),
              type: firstAssets?.type,
            };
            let form = new FormData();
            form.append('File', addFile);
            api.post(
              '/api/file-management/file-descriptor/upload',
              form,
              { headers: { 'Content-Type': 'multipart/form-data'},params: {directoryId: config.folderId, Name: addFile.name}}
            
            )
              .then(({data}) => {
                api.post(
                  '/api/master-data-module/vehicles-registrations/InsertVhrFile',
                  {
                    vehiclesRegistrationId: truck.id, fileId: data?.id, directoryId: config.folderId
                  }
                )
                  .then(({data}) => null)
                  .finally(() => loadDeliverImg());
              })
              .catch(e => console.log(e))
              .finally(() => {
                stopLoading({key: 'deliverDetail'});
              });
          }
        }
    
      }
    
      const takePhoto = () => {
        launchCamera(options, onCameraResult);
      }
    
      const uploadPhoto = () => {
        launchImageLibrary(options, onCameraResult);
      }
    
      const changeFilterDate = (date) => {
        if (filterDate.mode == PICKER_MODE.date && filterDate.val) {
          date.setHours(filterDate.val.getHours());
          date.setMinutes(filterDate.val.getMinutes());
        }
        setFilterDate({show: false, val: date ? date : filterDate.val});
      }
    
      const genImageSource = (id) => {
        return api.defaults.baseURL + '/api/file-descriptor/view/' + id;
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
              //marginTop: Platform.OS == 'ios' ? 30 : 10,
            }}
            title="Deails"
            rightComponent={
              <View
                style={{
                  width: 35,
                  height: 35,
                }}></View>
            }
            leftComponent={
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
      
   
    return (
<View style={styles.container}>
{renderHeader()}
      <View
        style={{
          height: Platform.OS == 'ios' ? 90 : 60,
        }}></View>
        <Pressable style={[styles.fullImageArea, {zIndex: fullImage ? 999 : -999}]}
                 onPress={() => setFullImage(null)}>
        {fullImage ? (
          <Image source={{uri: fullImage}}
                 defaultSource={defaultImage}
                 style={{flex: 1, resizeMode: 'contain',}}/>
        ) : null}
      </Pressable>
      <View>
      <Text style={styles.infoLabelTxt}>Transit at:</Text>
      <Text style={[styles.itemStatus, styles.roundBg]}>
                  {moment(truck.vhclLoadingArrivalDate).format('DD/MM/YYYY HH:mm')}
                </Text>
      </View>
      <View>
      <Text style={{fontWeight: 'bold'}}>Remark:</Text>
              <TextInput rowSpan={5} bordered placeholder="Typing..." value={truckDetail.vhclRemarks}
                        onChangeText={(val) => setTruckDetail({...truckDetail, vhclRemarks: val})}
              />
              <View style={{marginVertical: 8, flexDirection: 'row', justifyContent: 'space-around'}}>
                <Pressable style={styles.photoBtn} onPress={takePhoto} disabled={loading}>
                  <Icon style={{fontSize: 30, paddingRight: 8}} type='FontAwesome5' name='camera'/>
                  <Text>Take photo</Text>
                </Pressable>
                <Pressable style={styles.photoBtn} onPress={uploadPhoto} disabled={loading}>
                  <Icon style={{fontSize: 30, paddingRight: 8}} type='FontAwesome5' name='image'/>
                  <Text>Upload photo</Text>
                </Pressable>
              </View>
      </View>
      <View>
                <ScrollView horizontal={true} style={{marginVertical: 8}}>
                  {files?.map((it, id) => (
                    <Pressable
                      onPress={() => setFullImage(genImageSource(it?.fileId))}
                      key={id.toString()}>
                      <Image source={{uri: genImageSource(it?.fileId)}}
                             defaultSource={defaultImage}
                             style={styles.thumbImage}/>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View style={{marginVertical: 8, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity warning style={{flex: 1, justifyContent: 'center'}} onPress={handleConfirm} disabled={loading}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Image source={{uri:img}} style={{
                  width:40,
                  height:40
                }} />
              </View>
    </View>
    ) 
};

const styles = StyleSheet.create({
  container: {
    flex: 1, paddingTop: 10
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginVertical: 6, marginHorizontal: 4
  },
  licenseLabel: {flex: 1, textAlign: 'center', fontWeight: 'bold'},
  infoArea: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  itemStatus: {
    color: '#ffffff', borderRadius: 6, paddingHorizontal: 3, paddingVertical: 3, textAlign: 'center',
    textAlignVertical: 'center'
  },
  infoLabel: {
    flex: 3, justifyContent: 'flex-end'
  },
  infoLabelTxt: {textAlign: 'right',},
  infoBody: {flex: 9},
  roundBg: {backgroundColor: '#9e9e9e'},
  roundBtnBg: {backgroundColor: '#f0ad4e'},
  photoBtn: {justifyContent: 'center', flexDirection: 'row', alignItems: 'center'},
  photoCount: {
    position: 'absolute', zIndex: 99, right: 0, height: '100%', display: 'flex',
    backgroundColor: '#ffffff66', justifyContent: 'center', paddingHorizontal: 10,
  },
  photoCountTxt: {color: '#5cb85c', fontWeight: 'bold', fontSize: 26},
  thumbImage: {height: 200, width: 200, flex: 1, marginHorizontal: 4, borderRadius: 20},
  fullImageArea: {position: 'absolute', backgroundColor: '#ffffffcc', width: '100%', height: '100%'},
});
export default connectToRedux({
    component: NBAUnloadingDetailScreen,
    stateProps: state => ({
      loading: createLoadingSelector()(state),
    }),
    dispatchProps: {
      startLoading: LoadingActions.start,
      stopLoading: LoadingActions.stop,
    },
  });
  