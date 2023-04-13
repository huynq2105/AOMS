import React, {useState, useEffect} from 'react';

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
import {
  getVehicles,
  getDrivers,
  getWarehouse,
  getAgents,
  getDriversByVehicleId,
  createVehicle,
  createTruck,
} from '../../../../api/OutboundAPI';
import Autocomplete from 'react-native-autocomplete-input';
import {Picker} from '@react-native-picker/picker';
import TextButton from '../../../../components/TextButton';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
//import { getVehicle } from '../../../../api/OutboundAPI';
const AddTruckScreen = ({startLoading, stopLoading, navigation}) => {
  const [trucks, setTrucks] = useState([]);
  const [driver, setDriver] = useState(null);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedValue, setSelectedValue] = useState({});
  const today = moment();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [wareHouse, setWareHouse] = useState([]);
  const [vihicle, setVihicle] = useState();
  const handleAddTruck = () => {
    console.log('Add Truck');
    setIsVisible(true);
  };
  const handleSelectTruck = id => {
    getDriversByVehicleId({VehicleId: id}).then(
      ({items, totalCount: total}) => {
        console.log('Item driver ==================================', items);
        if (items.length > 0) {
          console.log('Driver====================', items[0]);
          setDriver(items[0]);
        }
      },
    );
  };

  useEffect(() => {
    getVehicles({maxResultCount: 1000, skipCount: 0})
      .then(({items, totalCount: total}) => {
        setTrucks(items);
        getDrivers({maxResultCount: 1000, skipCount: 0}).then(
          ({items, totalCount: total}) => {
            setDrivers(items);
            getWarehouse({maxResultCount: 1000, skipCount: 0}).then(
              ({items, totalCount: total}) => {
                const loadWareHouse = [{id: 0, label: '--Choose--', value: 0}];
                items.forEach((item, index) => {
                  return loadWareHouse.push({
                    id: item.id,
                    label: item.warehouseShortCode,
                    value: item.id,
                  });
                });
                setWareHouse(loadWareHouse);
                getAgents({type: 'OUTBOUND', page: 0}).then(
                  ({items, totalCount: total}) => {
                    const loadAgents = [{id: 0, label: '--Choose--', value: 0}];
                    items.forEach((item, index) => {
                      return loadAgents.push({
                        id: item.kundId,
                        label: item.agentName,
                        value: item.kundId,
                      });
                    });
                    setAgents(loadAgents);
                  },
                );
              },
            );
          },
        );
      })
      .catch(e => {
        alert(e);
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

  const handleAddVihicle = (responseVehicle, responseDriver) => {
    setIsVisible(false);
    console.log(
      'responseVehicle==============================',
      responseVehicle,
    );
    console.log('responseDriver==============================', responseDriver);
    setVihicle({
      ...vihicle,
      vehicleRegNo: responseVehicle.vehicleRegNo,
      id: responseVehicle.id,
      vehicleLoadWeight: responseVehicle.vehicleLoadWeight,
    });
    setDriver(responseDriver);
  };
  console.log('Vehicle============================================',vihicle)
  const onSubmit = values => {
    const date = DELIVER_FORMAT_DATE(today);
    const time = ADD_TRUCK_FORMAT_TIME(today);
    const unloadingTime = DELIVER_FORMAT_TIME(today);
    const newVehicleRegistration = {
      ...values,
      vehicleLoadWeight: parseInt(values.vehicleLoadWeight),
      numberOfDoors: parseInt(values.numberOfDoors),
    };
    //console.log('Data request============================',values)
    const truckData = {
      vehicRegNo: values.vehicleRegNo,
      vhclDriverName: values.vhclDriverName,
      vhclImportExport: 'EXPORT',
      vhclLoadingWarehouse: values.vhclLoadingWarehouse + '',
      vhclLoadingArrivalDate: date,
      vhclLoadingArrivalTime: time,
      vhclLoadingAtDoorDate: date,
      vhclLoadingAtDoorTime: time,
      vhclUnloadingWarehouse: null,
      vhclUnloadingEtaDate: date,
      vhclUnloadingEtaTime: unloadingTime,
      vhclTruckType: 'PICK UP',
      vhclRemarks: values.vhclRemarks,
      vhclMasterIsn: values.vhclMasterIsn,
      vhclProviderCustomerIsn: values.vhclProviderCustomerIsn,
    };
    console.log('Data request============================', truckData);
    startLoading({key: 'addTruck'});
    createTruck(truckData)
      .then(() => {
        console.log('Add truck success!');
      })
      .catch(e => {
        console.log(e);
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
        initialValues={{
          vehicleRegNo: vihicle ? vihicle.vehicleRegNo : '',
          vhclMasterIsn: vihicle ? vihicle.id : 0,
          vehicleLoadWeight: vihicle ? vihicle.vehicleLoadWeight.toString() : '',
          vhclLoadingWarehouse: '',
          vhclProviderCustomerIsn: '',
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
              Truck Number
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
                    elevation: Platform.OS === 'android' ? 100 : 0,
                    // height:800
                  }}
                  keyboardType="number-pad"
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
                          console.log('Press!!!', item);

                          setFieldValue('vehicleRegNo', item.vehicleRegNo);
                          setFieldValue('vhclMasterIsn', item.id);
                          setFieldValue(
                            'vehicleLoadWeight',
                            item.vehicleLoadWeight,
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
              }}>
              Load weight
            </Text>
            <TextInput
              style={{
                //flex:1,
                borderWidth: 1,
                height: 45,
                marginTop: SIZES.base,
                //borderBottomWidth:1,
                borderBottomColor: COLORS.gray,
              }}
              value={values.vehicleLoadWeight}
              onChangeText={handleChange('vehicleLoadWeight')}
              keyboardType="number-pad"
            />
            <Text
              h3
              primaryALS
              style={{
                marginTop: SIZES.base,
              }}>
              Driver
            </Text>
            <View
              style={{
                marginTop: 10,
              }}>
              <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={{
                  backgroundColor: '#F5FCFF',
                  borderWidth: 0,
                  elevation: Platform.OS === 'android' ? 1 : 0,
                  position: 'absolute',
                  // zIndex: 1,
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
              }}>
              <Text
                h3
                primaryALS
                style={{
                  flex: 1,
                }}>
                From
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
                // marginTop: 5,
                //backgroundColor:COLORS.yellow
              }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.black,
                  width: 140,
                  //padding: 10,
                  //  flex: 1,
                  //backgroundColor:COLORS.green
                }}>
                <Picker
                  mode="dropdown"
                  style={{}}
                  selectedValue={values.vhclProviderCustomerIsn}
                  onValueChange={(itemValue, itemIndex) =>
                    setFieldValue('vhclProviderCustomerIsn', itemValue)
                  }>
                  {agents.map(it => (
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
                  onValueChange={(itemValue, itemIndex) =>
                    setFieldValue('vhclLoadingWarehouse', itemValue)
                  }>
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
            <View>
              <Text
                h3
                primaryALS
                style={{
                  marginTop: SIZES.base,
                  //flex: 1,
                }}>
                Remark
              </Text>
              <TextInput
                style={{
                  padding: 0,
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
                onPress={()=>navigation.goBack()}
              />
              <TextButton
                label="Save"
                buttonContainerStyle={{
                  //flex:1,
                  width: 120,
                  height: 40,
                  borderRadius: SIZES.base,
                }}
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
