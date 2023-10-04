import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, View, TextInput, FlatList,Alert} from 'react-native';
import {Formik} from 'formik';
import Modal from 'react-native-modal';
import { getSealByTruckId,checkSeal } from '../../../api/MasterAPI';
import Text from '../../../constants/Text';
import {SIZES, COLORS} from '../../../constants/theme';
import * as Yup from 'yup';
import TextButton from '../../../components/TextButton';
import CheckComponent from '../../../components/Checkbox';
import api from '../../../api/API'
const validations = {
  /*   // vehicleRegNo: Yup.string().required('Required.'),
  domgrDono: Yup.string().required('Required.'),
  domgrPieces: Yup.string().required('Required.'), */
};
const seals = [
  {id:1,name: 'ABC009911', check: false},
  {id:2,name: 'ABC009912', check: false},
  {id:3,name: 'ABC009913', check: false},
  {id:4,name: 'ABC009914', check: false},
  {id:5,name: 'ABC009915', check: false},
];
const SealListModal = ({modalVisible, applyFunc, handleOffModal,truck,listSeal}) => {
  const [visible, setVisible] = useState(modalVisible);
  const [checkAll, setCheckAll] = useState(false);
  const [listSeals, setListSeals] = useState(listSeal);
  console.log('xe can xac nhan',listSeals)
  const onSubmit = values => {
    const listSealPut = [];
    listSeals.forEach((item,index)=>{
      if(item.check){
        listSealPut.push(item.id)
      }
    
    })
    const sealPut = {VehicleRegId:truck.vehicleRegId,sealId:listSealPut}
    checkSeal(sealPut).then((data)=>{
      console.log('UpdateSeal Thanh Cong======')
      applyFunc();
      handleOffModal()
    }).catch((e)=>{console.log(e)}) 
   

  };

  const ToggleCheckAll = e => {
    setCheckAll(e);
    const newState = listSeals.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, check: e};
    });
    setListSeals(newState);
  };
  const handleCheckItem = (e, item) => {
    const newState = listSeals.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, check: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setListSeals(newState);
    if (newState.every(item => item.check === true)) {
      setCheckAll(true);
    }

    if (newState.some(item => item.check === false)) {
      setCheckAll(false);
    }
  };
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
      visible={modalVisible}
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
                        Xe {truck?.vehicleRegNo}
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
                        data={listSeals}
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
                                  ? COLORS.primaryALS
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
                                  item.check === true ? COLORS.primaryALS : null,
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
                        handleOffModal();
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
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
export default SealListModal;
