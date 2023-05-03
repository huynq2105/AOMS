import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import {
  DELIVER_FORMAT_DATE,
  ADD_TRUCK_FORMAT_TIME,
  DELIVER_FORMAT_TIME,
} from '../../../../utils/DateHelpers';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import FormInputMik from '../../../../components/FormInputMik';
import {Formik} from 'formik';
import AddVihicleModal from './AddVihicleModal';
import * as Yup from 'yup';
import {
  getVehicles,
  getDrivers,
  getWarehouse,
  getAgents,
  getDriversByVehicleId,
  createVehicle,
  createTruck,
  getWareHousePickUp,
} from '../../../../api/OutboundAPI';
import Autocomplete from 'react-native-autocomplete-input';
import {Picker} from '@react-native-picker/picker';
import TextButton from '../../../../components/TextButton';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';

const validations = {
  vehicleRegNo: Yup.string().required('Required.'),
  vhclLoadingWarehouse: Yup.string().notOneOf(
    ['--Choose--'],
    'Phai set gia tri',
  ),
  vhclDriverName: Yup.string().required('Required.'),
  vehicleLoadWeight: Yup.string().required('Required.'),
  vhclRemarks: Yup.string().required('Required.'),
};
const AddTruckScreen = ({startLoading, stopLoading, navigation}) => {
  const [trucks, setTrucks] = useState([]);
  const [driver, setDriver] = useState(null);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const today = moment();
  const [valueWareHouse, setValueWareHouse] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [wareHouse, setWareHouse] = useState([
    {id: 0, label: '--Choose--', value: 0},
  ]);
  const [wareHousePickUp, setWareHousePickUp] = useState([
    {id: 0, label: '--Choose--', value: 0},
  ]);
  const [vihicle, setVihicle] = useState();
  const handleAddTruck = () => {
    setIsVisible(true);
  };

  const handleSelectTruck = id => {
    getDriversByVehicleId({VehicleId: id}).then(
      ({items, totalCount: total}) => {
        if (items.length > 0) {
          setDriver(items[0]);
        }
      },
    );
  };
  const loadWareHouse = async () => {
    const wareHouseSaved = await AsyncStorage.getItem('wareHouseSave');
    if (wareHouseSaved) {
      setValueWareHouse(wareHouseSaved);
      return wareHouseSaved;
    }
    return null;
  };
  useEffect(() => {
    /*     const wareSaved = loadWareHouse();
    console.log('wareSaved=====================================',wareSaved) */
    getVehicles({maxResultCount: 1000, skipCount: 0})
      .then(({items, totalCount: total}) => {
        setTrucks(items);
        getDrivers({maxResultCount: 1000, skipCount: 0}).then(
          ({items, totalCount: total}) => {
            setDrivers(items);
            getWarehouse({maxResultCount: 1000, skipCount: 0}).then(
              ({items, totalCount: total}) => {
                const loadWareHouse = [];
                let valueWareHouseInit = '';
                items.forEach((item, index) => {
                  valueWareHouseInit = item.id + '';
                  return loadWareHouse.push({
                    id: item.id,
                    label: item.warehouseShortCode,
                    value: item.id,
                  });
                });
                setValueWareHouse(valueWareHouseInit);
                setWareHouse(loadWareHouse);

                getWareHousePickUp({maxResultCount: 1000, skipCount: 0}).then(
                  ({items, totalCount: total}) => {
                    const loadWarehousePickup = [];
                    items.forEach((item, index) => {
                      return loadWarehousePickup.push({
                        id: item.id,
                        label: item.code,
                        value: item.id,
                      });
                    });
                    setWareHousePickUp([
                      ...wareHousePickUp,
                      ...loadWarehousePickup,
                    ]);
                  },
                );
              },
            );
          },
        );
      })
      .catch(e => {
        if (e === 'AxiosError: Request failed with status code 401') {
          alert('Hết phiên đăng nhập');
        } else {
          alert(e);
        }
      });
  }, []);

  const findTruck = query => {
    if (query) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      setFilteredTrucks(
        trucks.filter(truck => truck.vehicleRegNo.search(regex) >= 0),
      );
    } else {
      setFilteredTrucks([]);
    }
  };
  const findDriver = query => {
    if (query) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      setFilteredDrivers(
        drivers.filter(driver => driver.firstName.search(regex) >= 0),
      );
    } else {
      setFilteredDrivers([]);
    }
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
  const handleAddVihicle = (responseVehicle, responseDriver) => {
    setIsVisible(false);
    setVihicle({
      ...vihicle,
      vehicleRegNo: responseVehicle.vehicleRegNo,
      id: responseVehicle.id,
      vehicleLoadWeight: responseVehicle.vehicleLoadWeight,
    });
    setDriver(responseDriver);
  };
  const onSubmit = values => {
    const date = DELIVER_FORMAT_DATE(today);
    const time = ADD_TRUCK_FORMAT_TIME(today);
    const unloadingTime = DELIVER_FORMAT_TIME(today);
    const newVehicleRegistration = {
      ...values,
      vehicleLoadWeight: parseInt(values.vehicleLoadWeight),
      numberOfDoors: parseInt(values.numberOfDoors),
    };
    const truckData = {
      vehicRegNo: values.vehicleRegNo,
      vhclDriverName: values.vhclDriverName,
      vhclImportExport: 'EXPORT',
      vhclLoadingWarehouse: values.vhclLoadingWarehouse,
      vhclLoadingArrivalDate: GetDateNowUCT(),
      vhclLoadingArrivalTime: time,
      vhclLoadingAtDoorDate: GetDateNowUCT(),
      vhclLoadingAtDoorTime: time,
      vhclUnloadingWarehouse: null,
      vhclUnloadingEtaDate: GetDateNowUCT(),
      vhclUnloadingEtaTime: unloadingTime,
      vhclTruckType: 'PICK UP',
      vhclRemarks: values.vhclRemarks + ' Mobile',
      vhclMasterIsn: parseInt(values.vhclMasterIsn),
      vhclWareHousePickupIsn: parseInt(values.vhclWareHousePickupIsn),
    };
    console.log('Truck Data===============', truckData);
    startLoading({key: 'addTruck'});
    createTruck(truckData)
      .then(() => {
        navigation.goBack();
      })
      .catch(e => {
        Alert.alert(e + '');
      })
      .finally(() => stopLoading({key: 'addTruck'}));
  };
  const closeModal = () => {
    setIsVisible(false);
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

          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        title="Add Truck"
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

  function renderForm() {
    return (
      <Formik
        enableReinitialize
        validationSchema={Yup.object().shape({
          ...validations,
        })}
        validateOnMount={true}
        initialValues={{
          vehicleRegNo: vihicle ? vihicle.vehicleRegNo : '',
          vhclMasterIsn: vihicle ? vihicle.id + '' : '',
          vehicleLoadWeight: vihicle
            ? vihicle.vehicleLoadWeight
              ? vihicle.vehicleLoadWeight.toString()
              : ''
            : '',
          vhclLoadingWarehouse: valueWareHouse + '',
          vhclWareHousePickupIsn: '',
          vhclDriverName: driver
            ? driver.firstName + '-' + driver.phoneNumber
            : '',
          vhclRemarks: '',
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
          <View
            style={{
              marginTop: 40,
              flex: 1,
              //padding: 16,
              //backgroundColor: COLORS.green,
            }}>
            <Text
              h3
              primaryALS
              style={{
                marginTop: SIZES.base,
              }}>
              Truck Number <Text style={{color: COLORS.red}}>(*)</Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View>
                <Autocomplete
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    backgroundColor: '#F5FCFF',
                    width: 200,
                    borderLeftWidth: 0,
                    borderWidth: 0,
                  }}
                  containerStyle={{
                    backgroundColor: '#F5FCFF',
                    borderWidth: 0,
                    marginTop: 10,
                    position: 'absolute',
                    zIndex: 1000,
                    elevation: Platform.OS === 'android' ? 2 : 0,
                    // height:800
                  }}
                  data={filteredTrucks}
                  defaultValue={values.vehicleRegNo}
                  onChangeText={text => findTruck(text)}
                  placeholder="Enter the truck No"
                  flatListProps={{
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({item}) => (
                      <TouchableOpacity
                        style={{
                          height: 50,
                          borderWidth: 1,
                        }}
                        onPress={() => {
                          setFieldValue('vehicleRegNo', item.vehicleRegNo);
                          setFieldValue('vhclMasterIsn', item.id.toString());
                          setFieldValue(
                            'vehicleLoadWeight',
                            item.vehicleLoadWeight
                              ? item.vehicleLoadWeight.toString()
                              : '',
                          );
                          setVihicle(item);
                          //setSelectedValue(item);
                          setFilteredTrucks([]);
                          handleSelectTruck(item.id);
                        }}>
                        <Text style={styles.itemText}>{item.vehicleRegNo}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 70,
                  top: 10,
                }}
                onPress={() => setIsVisible(true)}>
                <Image
                  source={icons.plus}
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: COLORS.primaryALS,
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text
              h3
              primaryALS
              style={{
                marginTop: 60,
                zIndex: -1,
              }}>
              Load weight <Text style={{color: COLORS.red}}>(*)</Text>
            </Text>
            <TextInput
              style={{
                //flex:1,
                borderWidth: 1,
                height: 45,
                marginTop: SIZES.base,
                //borderBottomWidth:1,
                borderBottomColor: COLORS.gray,
                zIndex: -1,
              }}
              value={values.vehicleLoadWeight.toString()}
              onChangeText={handleChange('vehicleLoadWeight')}
              keyboardType="number-pad"
            />
            <Text
              h3
              primaryALS
              style={{
                marginTop: SIZES.base,
                zIndex: -1,
              }}>
              Driver <Text style={{color: COLORS.red}}>(*)</Text>
            </Text>
            <View
              style={{
                top: 200,
                zIndex: Platform.OS === 'ios' ? -1 : 2,
                position:'absolute'
              }}>
              <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={{
                  backgroundColor: '#F5FCFF',
                  borderWidth: 0,
                  elevation: Platform.OS === 'android' ? 2 : 0,
                  position: 'absolute',
                  zIndex: 2,
                }}
                style={{
                  backgroundColor: '#F5FCFF',
                  width: 200,
                  borderLeftWidth: 0,
                  borderWidth: 0,
                }}
                data={filteredDrivers}
                defaultValue={values.vhclDriverName}
                onChangeText={text => findDriver(text)}
                placeholder="Driver"
                flatListProps={{
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({item}) => (
                    <TouchableOpacity
                      style={{
                        height: 30,
                      }}
                      onPress={() => {
                        setFieldValue('vhclDriverName', item.firstName);
                        setFilteredDrivers([]);
                      }}>
                      <Text style={styles.itemText}>{item.firstName}</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 50,
                zIndex: -2,
              }}>
              <Text
                h3
                primaryALS
                style={{
                  flex: 1,
                  zIndex: -2,
                }}>
                Factory <Text style={{color: COLORS.red}}>(*)</Text>
              </Text>
              <Text
                h3
                primaryALS
                style={{
                  flex: 1,
                }}>
                To
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                zIndex: -2,
                // marginTop: 5,
                //backgroundColor:COLORS.yellow
              }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.black,
                  width: 140,
                  zIndex: -2,
                  //padding: 10,
                  //  flex: 1,
                  backgroundColor:COLORS.green
                }}>
                <Picker
                  mode="dropdown"
                  style={{
                    zIndex:-2
                  }}
                  selectedValue={values.vhclWareHousePickupIsn}
                  onValueChange={(itemValue, itemIndex) =>
                    setFieldValue('vhclWareHousePickupIsn', itemValue)
                  }>
                  {wareHousePickUp.map(it => (
                    <Picker.Item
                      key={it.id.toString()}
                      label={it.label}
                      value={it.value}
                    />
                  ))}
                </Picker>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.black,
                  width: 140,
                  //padding: 10,
                  // flex: 1,
                  //backgroundColor:COLORS.green
                }}>
                <Picker
                  style={{
                    //borderWidth: 2,
                    //flex: 1,
                    borderColor: COLORS.black,
                  }}
                  mode="dropdown"
                  selectedValue={values.vhclLoadingWarehouse}
                  onValueChange={(itemValue, itemIndex) => {
                    setFieldValue('vhclLoadingWarehouse', itemValue + '');
                    AsyncStorage.setItem('wareHouseSave', itemValue + '');
                  }}>
                  {wareHouse.map(it => (
                    <Picker.Item
                      key={it.id.toString()}
                      label={it.label}
                      value={it.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View
              style={{
                zIndex: Platform.OS === 'ios' ? -2 : null,
              }}>
              <Text
                h3
                primaryALS
                style={{
                  marginTop: SIZES.base,
                 zIndex: -2,
                  //flex: 1,
                }}>
                W.H <Text style={{color: COLORS.red}}>(*)</Text>
              </Text>
              <TextInput
                style={{
                  padding: 0,
                  zIndex: -2,
                  // flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.gray,
                }}
                value={values.vhclRemarks}
                onChangeText={handleChange('vhclRemarks')}
              />
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
          </View>
        )}
      </Formik>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderForm()}
      <AddVihicleModal
        applyFilterFunc={handleAddVihicle}
        handleOffModal={closeModal}
        isVisible={isVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 16,
    //marginBottom:40
    //marginTop: 40,
  },
  autocompleteContainer: {
    backgroundColor: '#F5FCFF',
    borderWidth: 0,
    marginTop: 40,
    position: 'absolute',
    zIndex: 1000,
    elevation: Platform.OS === 'android' ? 5 : 0,
    // height:800
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
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
  component: AddTruckScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
