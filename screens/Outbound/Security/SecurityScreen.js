/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import CheckComponent from '../../../components/Checkbox';
import moment from 'moment';
import {getTruckFactoryPickup} from '../../../api/OutboundAPI';
import {
  getVehicleSecurity,
  updateSeal,
  checkSeal,
  getSealByTruckId,
} from '../../../api/MasterAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import {DMY_FORMAT, DMY_TIME, FORMAT_TIME} from '../../../utils/DateHelpers';
import TextButton from '../../../components/TextButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import SealListModal from './SealListModal';
const validations = {
  /*   // vehicleRegNo: Yup.string().required('Required.'),
  domgrDono: Yup.string().required('Required.'),
  domgrPieces: Yup.string().required('Required.'), */
};
const SecurityScreen = ({navigation}) => {
  const [filterDate, setFilterDate] = useState({
    show: false,
    val: new Date(),
  });
  const [modalListSeal, setModalListSeal] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [truckSelect, setTruckSelect] = useState(null);
  const [listSeal, setListSeal] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const today = moment();
  const [params, setParams] = useState({
    importOrExport: 'EXPORT',
  });
  const changeFilterDate = date => {
    console.log(date);
    setFilterDate({show: false, val: date ? date : filterDate.val});
    setParams({...params, LoadingArrivalDate: DMY_FORMAT(date)});
  };
  const loadData = () => {
    getVehicleSecurity(params).then(data => {
      setTrucks(data);
    }).catch((e)=>console.log('Da xay ra loi',e));
  };
  useEffect(() => {
    loadData();
  }, []);
  const ToggleCheckAll = e => {
    setCheckAll(e);
    const newState = listSeal.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, check: e};
    });
    setListSeal(newState);
  };
  const handleCheckItem = (e, item) => {
    const newState = listSeal.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, check: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setListSeal(newState);
    if (newState.every(item => item.check === true)) {
      setCheckAll(true);
    }

    if (newState.some(item => item.check === false)) {
      setCheckAll(false);
    }
  };
  const closeModalConfirmSeal = () => {
    setModalListSeal(false);
  };
  const handleConfirmSeal = item => {
    getSealByTruckId({VehicleRegId: item?.vehicleRegId}).then(
      ({items, totalCount}) => {
        const data = [];
        items.forEach((item, index) => {
          if (item.vhslSealConfirmed == 1) {
            data.push({...item, check: true});
          } else {
            data.push({...item, check: false});
          }
          setListSeal(data);
        });
        /* if(sealNo){
        setSerialNo(sealNo.substring(0, sealNo.length - 1))
      } */
      },
    );
    setTimeout(() => {
      setModalListSeal(true);
      setTruckSelect(item);
    }, 200);
  };
  const onSubmit = values => {
    const listSealPut = [];
    listSeal.forEach((item, index) => {
      if (item.check) {
        listSealPut.push(item.id);
      }
    });
    const sealPut = {
      VehicleRegId: truckSelect.vehicleRegId,
      sealId: listSealPut,
    };
    checkSeal(sealPut)
      .then(data => {
        console.log('UpdateSeal Thanh Cong======');
        loadData();
        closeModalConfirmSeal();
      })
      .catch(e => {
        console.log(e);
      });
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
        title="Kiểm Soát Seal"
        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  const applyFuncConfirmSeal = () => {
    loadData();
  };
  //console.log('danh sach Seal==========',listSeal)
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: SIZES.base,
          // marginHorizontal:SIZES.base
        }}>
        <FlatList
          data={trucks}
          keyExtractor={item => item.vehicleRegId}
          ListFooterComponent={
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.secondaryALS,
              }}
            />
          }
          ListHeaderComponent={
            <View
              style={{
                flexDirection: 'row',
                borderTopColor: COLORS.secondaryALS,
                borderTopWidth: 1,
              }}></View>
          }
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={{
                paddingVertical: SIZES.radius,
                // paddingHorizontal: SIZES.base,
                borderTopWidth: 1,
                borderColor: COLORS.secondaryALS,
                flexDirection: 'row',
                justifyContent: 'center',

                // alignItems: 'center',
              }}
              onPress={() => handleConfirmSeal(item)}>
              <View
                style={{
                  flex: 1,
                  //borderLeftWidth: 1,
                  //borderLeftColor: COLORS.secondaryALS,
                  alignItems: 'center',
                  //  paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text>{index + 1}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  //borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.radius,
                }}>
                <Text primaryALS>{item.vehicleRegNo}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  // borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  alignItems: 'center',
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text> {item.warehousePickup}</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  //  borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                  //paddingHorizontal: SIZES.radius,
                  justifyContent: 'center',
                }}>
                <Text> {FORMAT_TIME(item.loadingArrivalDate)}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 5,
                  //   borderLeftWidth: 1,
                  borderLeftColor: COLORS.secondaryALS,
                }}>
                <View
                  style={{
                    paddingHorizontal: SIZES.base,
                    // marginLeft: SIZES.base,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //borderWidth:1,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      //flex: 1,
                      color: COLORS.green,
                    }}>
                    {item.checkedSeal ? 'Kiểm tra lại' : ''}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.right_arrow}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: COLORS.primaryALS,
                      marginLeft: SIZES.radius,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  function renderModal() {
    return (
      <Modal
        backdropOpacity={0.3}
        onBackdropPress={() => {
          handleOffModal();
        }}
        onBackButtonPress={() => {
          handleOffModal();
        }}
        animationType="slide"
        transparent={true}
        visible={modalListSeal}
        onRequestClose={() => {
          setVisible(!visible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Text style={styles.modalText}>Add PO!</Text> */}
            <View
              style={{
                width: 300,
                marginBottom: SIZES.base,
                height: 400,
              }}>
              <Formik
                validationSchema={Yup.object().shape({
                  ...validations,
                  //password: passwordValidation,
                })}
                initialValues={
                  {
                    /*    domgrDono: '',
                domgrPieces: '', */
                  }
                }
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
                  <>
                    <View style={styles.container}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text h2 primaryALS>
                          Xe {truckSelect?.vehicleRegNo}
                        </Text>
                        <Text h2 primaryALS>
                          Danh sách Seal cần xác nhận
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: SIZES.radius,
                        }}>
                        <CheckComponent
                          check={checkAll}
                          size={24}
                          color={checkAll == true ? COLORS.green : COLORS.black}
                          onPress={e => {
                            ToggleCheckAll(e);
                          }}
                        />
                        <Text
                          body3
                          style={{
                            color: checkAll === true ? COLORS.green : null,
                          }}>
                          Xác nhận tất cả
                        </Text>
                      </View>
                      <View>
                        <FlatList
                          keyExtractor={item => item.id}
                          data={listSeal}
                          renderItem={({item, index}) => (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: SIZES.base,
                              }}>
                              <CheckComponent
                                check={item?.check}
                                size={24}
                                color={
                                  item.check === true
                                    ? COLORS.green
                                    : COLORS.black
                                }
                                onPress={e => {
                                  handleCheckItem(e, item);
                                  //handleSeachByHawb(e)
                                }}
                              />
                              <Text
                                style={{
                                  color:
                                    item.check === true ? COLORS.green : null,
                                }}>
                                {item.vhslSealNumber}
                              </Text>
                            </View>
                          )}
                        />
                      </View>

                      <View
                        style={{
                          height: 60,
                        }}></View>
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
                        label="Đồng ý"
                        buttonContainerStyle={{
                          //flex:1,
                          width: 120,
                          height: 40,
                          borderRadius: SIZES.base,
                        }}
                        onPress={() => {
                          handleSubmit();
                        }}
                      />
                      <TextButton
                        label="Hủy Bỏ"
                        buttonContainerStyle={{
                          // flex:1,
                          width: 120,
                          height: 40,
                          borderRadius: SIZES.base,
                          backgroundColor: COLORS.gray,
                        }}
                        onPress={() => {
                          closeModalConfirmSeal();
                        }}
                      />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 80 : 60,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text h3 primaryALS>
          Pickup Date
        </Text>
        <View
          style={{
            height: 40,
            width: 100,
            borderWidth: 1,
            borderColor: COLORS.gray,
            marginLeft: SIZES.base,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{DMY_FORMAT(filterDate.val)}</Text>
        </View>
        <TouchableOpacity
          style={{
            marginLeft: SIZES.base,
          }}
          onPress={() => setFilterDate({...filterDate, show: true})}>
          <Image
            source={icons.calendar}
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.green,
            }}
          />
        </TouchableOpacity>
      </View>
      {filterDate.show && (
        <DatePicker
          modal
          mode="date"
          open={filterDate.show}
          date={filterDate.val}
          onConfirm={changeFilterDate}
          onCancel={() => setFilterDate({...filterDate, show: false})}
          minimumDate={new Date(2000, 1, 1)}
          maximumDate={new Date()}
          locale={'vi'}
        />
      )}
      {renderContent()}
      {renderModal()}
      {/*  <SealListModal
        modalVisible={modalListSeal}
        applyFunc={applyFuncConfirmSeal}
        handleOffModal={closeModalConfirmSeal}
        truck = {truckSelect}
        listSeal = {listSeal}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    //padding: 16,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 35,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SecurityScreen;
