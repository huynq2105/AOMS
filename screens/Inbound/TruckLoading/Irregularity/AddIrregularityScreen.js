/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Image,
  TextInput,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import CheckComponent from '../../../../components/Checkbox';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getCargoTerminalErtsCode, createIrr} from '../../../../api/InboundAPI';

import TextRadioButton from '../../../../components/TextRadioButton';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import api from '../../../../api/API';
import IconButton from '../../../../components/IconButton';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
//import EditPoModal from './EditPoModal';
import {useToast} from 'react-native-toast-notifications';
import dummyData from '../../../../constants/dummyData';
import {Formik} from 'formik';

import * as Yup from 'yup';
import {ScrollView} from 'react-native-gesture-handler';
const validations = {};

const config = {
  folderName: 'aoms_mobile_deliver',
  folderId: '',
};
const defaultImage = require('../../../../assets/images/thumb.png');
const AddIrregularityScreen = ({
  route,
  navigation,
  loading,
  startLoading,
  stopLoading,
}) => {
  const awb = route?.params?.awb ?? {};
  const [places, setPlaces] = useState([]);
  const [listIrr, setListIrr] = useState(dummyData.irrData);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    getCargoTerminalErtsCode({maxResultCount: 1000, skipCount: 0}).then(
      ({items, totalCount: total}) => {
        const loadPlaces = [];
        items.forEach((item, index) => {
          return loadPlaces.push({
            id: item.id,
            label: item.ertsShedCode,
            value: item.ertsShedCode,
          });
        });
        setPlaces(loadPlaces);
      },
    );
    loadFolderConfig();
  }, []);
  const loadFolderConfig = async () => {
    let result = await api.get('/api/file-management/directory-descriptor', {
      params: {Filter: config.folderName},
    });
    let data = result?.data;
    if (
      !data ||
      !data?.items ||
      !Array.isArray(data?.items) ||
      data?.items?.length < 1
    ) {
      result = await api.post('/api/file-management/directory-descriptor', {
        parentId: null,
        name: config.folderName,
      });
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
    //await loadDeliverImg();
  };
  const onSubmit = values => {
    const irrData = {
      place: values.place,
      weatherRain: values.weatherRain,
      irrPices: values.irrPices ? parseInt(values.irrPices) : 0,
      hawbId: awb.lagiId,
      type: '0',
      prefix: '',
      awb: awb.mawb,
      hawb: awb.hawb,
      isDeleted: false,
      irrMsca: listIrr.find(c => c.name === 'irrMsca').check,
      irrCrushed: listIrr.find(c => c.name === 'irrCrushed').check,
      irrTorn: listIrr.find(c => c.name === 'irrTorn').check,
      irrWet: listIrr.find(c => c.name === 'irrWet').check,
      irrBroken: listIrr.find(c => c.name === 'irrBroken').check,
      irrHoled: listIrr.find(c => c.name === 'irrHoled').check,
      irrFdca: listIrr.find(c => c.name === 'irrFdca').check,
      irrOpen: listIrr.find(c => c.name === 'irrOpen').check,
      irrWithoutLabel: listIrr.find(c => c.name === 'irrWithoutLabel').check,
      irrMissStrap: listIrr.find(c => c.name === 'irrMissStrap').check,
      irrMissSeal: listIrr.find(c => c.name === 'irrMissSeal').check,
      irrOther: listIrr.find(c => c.name === 'irrOther').check,
    };
    startLoading({key: 'addTruck'});
    createIrr(irrData)
      .then(() => {
        navigation.goBack();
      })
      .catch(e => {
        Alert.alert(e + '');
      })
      .finally(() => stopLoading({key: 'addTruck'}));
  };
  /*  const loadDeliverImg = () => {
      api
        .get(
          '/api/master-data-module/vehicles-registrations/GetListVhrFileByVhrId',
          {params: {vehiclesRegistrationId: truck.id}},
        )
        .then(({data}) => setFiles(data?.items ?? []));
    }; */
  const onCameraResult = response => {
    if (response.didCancel) {
      /*  Toast.show({
              text: 'Cancel image picker',
              buttonText: 'x',
              duration: 10000,
              type: 'danger',
              textStyle: {textAlign: 'center'}, swipeDisabled: true
            }); */
    } else if (response.errorCode) {
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
      startLoading({key: 'deliverDetail'});
      if (Array.isArray(response.assets) && response.assets.length > 0) {
        let firstAssets = response.assets[0];
        setImg(firstAssets?.uri);
        let addFile = {
          uri: firstAssets?.uri,
          name: firstAssets?.fileName?.replace(
            'rn_image_picker_lib_temp',
            'deliver_dt',
          ),
          type: firstAssets?.type,
        };
        let form = new FormData();
        form.append('File', addFile);
        api
          .post('/api/file-management/file-descriptor/upload', form, {
            headers: {'Content-Type': 'multipart/form-data'},
            params: {directoryId: config.folderId, Name: addFile.name},
          })
          .then(({data}) => {
            api
              .post(
                '/api/master-data-module/vehicles-registrations/InsertVhrFile',
                {
                  vehiclesRegistrationId: truck.id,
                  fileId: data?.id,
                  directoryId: config.folderId,
                },
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
  };

  const takePhoto = () => {
    launchCamera(options, onCameraResult);
  };

  const uploadPhoto = () => {
    launchImageLibrary(options, onCameraResult);
  };
  const genImageSource = id => {
    return api.defaults.baseURL + '/api/file-descriptor/view/' + id;
  };
  const handleCheckItem = (e, item) => {
    const newState = listIrr.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, check: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setListIrr(newState);
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
        title=" Add Irregularity"
        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderContent() {
    return (
      <Formik
        enableReinitialize
        validationSchema={Yup.object().shape({
          ...validations,
        })}
        validateOnMount={true}
        initialValues={{
          place: '',
          weatherRain: false,
          irrPices: '',
        }}
        onSubmit={values => onSubmit(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          setFieldValue,
        }) => (
          <ScrollView
            style={{
              marginTop: 40,
              flex: 1,
              //padding: 16,
              //backgroundColor: COLORS.green,
            }}>
            {/* genaral information */}
            <View
              style={{
                paddingHorizontal: SIZES.radius,
                paddingVertical: SIZES.radius,
                backgroundColor: COLORS.lightOrange3,
                borderTopWidth: 1,
                borderTopColor: COLORS.orange,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.orange,
              }}>
              <Text h2>Genaral Information</Text>
            </View>
            <View>
              <Text>Place</Text>
              <Picker
                mode="dropdown"
                style={{
                  zIndex: -2,
                }}
                selectedValue={values.place}
                onValueChange={(itemValue, itemIndex) =>
                  setFieldValue('place', itemValue)
                }>
                {places.map(it => (
                  <Picker.Item
                    key={it.id.toString()}
                    label={it.label}
                    value={it.value}
                  />
                ))}
              </Picker>
            </View>
            {/* Weather */}
            <View style={{}}>
              <Text>Weather</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextRadioButton
                  customContainerStyle={{
                    flex: 1,
                  }}
                  iconStyle={{
                    tintColor: COLORS.primaryALS,
                  }}
                  label="Không mưa"
                  isSelected={values.weatherRain === false ? true : false}
                  onPress={() => {
                    setFieldValue('weatherRain', false);
                  }}
                />
                <TextRadioButton
                  customContainerStyle={{
                    flex: 1,
                  }}
                  iconStyle={{
                    tintColor: COLORS.primaryALS,
                  }}
                  label="Có mưa"
                  isSelected={values.weatherRain === true ? true : false}
                  onPress={() => {
                    setFieldValue('weatherRain', true);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: SIZES.radius,
                paddingVertical: SIZES.radius,
                backgroundColor: COLORS.lightOrange3,
                borderTopWidth: 1,
                borderTopColor: COLORS.orange,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.orange,
              }}>
              <Text h2>Irregular</Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text>Pieces in Irregularity</Text>
                <TextInput
                  style={{
                    padding: 0,
                    //flex:1,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.gray,
                  }}
                  value={values.irrPices}
                  onChangeText={handleChange('irrPices')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: COLORS.lightGreen,
                // height:300
              }}>
              <FlatList
                data={listIrr}
                columnWrapperStyle={{flex: 1}}
                contentContainerStyle={{paddingHorizontal: SIZES.padding}}
                keyExtractor={item => `${item.id}`}
                numColumns={2}
                renderItem={({item, index}) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <CheckComponent
                      check={item?.check}
                      size={24}
                      color={COLORS.lightGray1}
                      onPress={e => {
                        handleCheckItem(e, item);
                        //handleSeachByHawb(e)
                      }}
                    />
                    <Text>{item.des}</Text>
                  </View>
                )}
              />
            </View>
            <View
              style={{
                paddingHorizontal: SIZES.radius,
                paddingVertical: SIZES.radius,
                backgroundColor: COLORS.lightOrange3,
                borderTopWidth: 1,
                borderTopColor: COLORS.orange,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.orange,
              }}>
              <Text h2>Photo Upload</Text>
            </View>
            <View
              style={{
                marginVertical: 8,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Pressable
                style={styles.photoBtn}
                onPress={takePhoto}
                disabled={loading}>
                <Icon
                  style={{fontSize: 30, paddingRight: 8}}
                  type="FontAwesome5"
                  name="camera"
                />
                <Text>Take photo</Text>
              </Pressable>
              <Pressable
                style={styles.photoBtn}
                onPress={uploadPhoto}
                disabled={loading}>
                <Icon
                  style={{fontSize: 30, paddingRight: 8}}
                  type="FontAwesome5"
                  name="image"
                />
                <Text>Upload photo</Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',

                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
              }}>
              <TextButton
                label="Cancel"
                buttonContainerStyle={{
                  // flex:1,
                  width: 120,
                  height: 40,
                  borderRadius: SIZES.base,
                  backgroundColor: COLORS.gray,
                }}
                onPress={() => navigation.goBack()}
              />
              <TextButton
                label="Save"
                buttonContainerStyle={{
                  //flex:1,
                  width: 120,
                  height: 40,
                  borderRadius: SIZES.base,
                  backgroundColor: !isValid
                    ? COLORS.lightGray1
                    : COLORS.primaryALS,
                }}
                disabled={!isValid}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 80 : 60,
          paddingHorizontal: SIZES.radius,
        }}>
        <Text h2>MAWB: {awb.mawb}</Text>
        <Text h2>HAWB: {awb.hawb}</Text>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default connectToRedux({
  component: AddIrregularityScreen,
  stateProps: state => ({
    loading: createLoadingSelector()(state),
  }),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
