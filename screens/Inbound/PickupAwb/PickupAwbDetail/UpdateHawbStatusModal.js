import React, {useState, useEffect, useRef, useCallback} from 'react';

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
} from 'react-native';
import {Formik} from 'formik';
import Modal from 'react-native-modal';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import TextRadioButton from '../../../../components/TextRadioButton';
import * as Yup from 'yup';



import TextButton from '../../../../components/TextButton';


const validations = {
  // vehicleRegNo: Yup.string().required('Required.'),
  hawbStatusValue: Yup.string().required('Required.')
};
const UpdateHawbStatusModal = ({modalVisible, applyFunc, handleOffModal}) => {
  const [visible, setVisible] = useState(modalVisible);
  const [statusHawb,setStatusHawb] = useState('')
  const onSubmit = values => {
    applyFunc(values.hawbStatusValue)
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
        Alert.alert('Modal has been closed.');
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
              initialValues={{
                hawbStatusValue: '',
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
                <>
                  <View style={styles.container}>
                    <View
                      style={
                        {
                          // display: 'flex',
                        }
                      }>
                      <View
                        style={{
                            justifyContent:'center',
                            //alignItems:'center'
                        }}
                      >
                        <View
                            style={{
                                alignItems:'center'
                            }}
                        >
                        <Text
                          h2
                          primaryALS
                          style={
                            {
                              //marginTop: 60,
                            }
                          }>
                          Update Hawb Status
                        </Text>
                        </View>
                        
                        <TextRadioButton
                        customContainerStyle={{
                            justifyContent:'flex-start',
                            alignItems:'center',
                            marginTop:SIZES.padding
                          //flex: 1,
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="HOÀN THÀNH THỦ TỤC XUẤT KHO TẠI NHÀ GA"
                        labelStyle={{
                            fontSize:17
                        }}
                        isSelected={
                          values.hawbStatusValue === 'HOÀN THÀNH THỦ TỤC XUẤT KHO TẠI NHÀ GA'
                            ? true
                            : false
                        }
                        onPress={() => {
                          setFieldValue('hawbStatusValue', 'HOÀN THÀNH THỦ TỤC XUẤT KHO TẠI NHÀ GA');
                        }}
                      />
                      <TextRadioButton
                        customContainerStyle={{
                            justifyContent:'flex-start',
                            alignItems:'flex-start',
                            marginTop:SIZES.padding
                        }}
                        labelStyle={{
                            fontSize:17
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="ĐANG SOI CHIẾU"
                        isSelected={
                          values.hawbStatusValue === 'ĐANG SOI CHIẾU' ? true : false
                        }
                        onPress={() => {
                          setFieldValue('hawbStatusValue', 'ĐANG SOI CHIẾU');
                        }}
                      />
                       <TextRadioButton
                        customContainerStyle={{
                            justifyContent:'flex-start',
                            alignItems:'flex-start',
                            marginTop:SIZES.padding
                        }}
                        labelStyle={{
                            fontSize:17
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="SOI CHIẾU THÀNH CÔNG"
                        isSelected={
                          values.hawbStatusValue === 'SOI CHIẾU THÀNH CÔNG' ? true : false
                        }
                        onPress={() => {
                          setFieldValue('hawbStatusValue', 'SOI CHIẾU THÀNH CÔNG');
                        }}
                      />
                        <TextRadioButton
                        customContainerStyle={{
                            justifyContent:'flex-start',
                            alignItems:'flex-start',
                            marginTop:SIZES.padding
                        }}
                        labelStyle={{
                            fontSize:17
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="SOI CHIẾU KHÔNG THÀNH CÔNG"
                        isSelected={
                          values.hawbStatusValue === 'SOI CHIẾU KHÔNG THÀNH CÔNG' ? true : false
                        }
                        onPress={() => {
                          setFieldValue('hawbStatusValue', 'SOI CHIẾU KHÔNG THÀNH CÔNG');
                        }}
                      />
                       <TextRadioButton
                        customContainerStyle={{
                            justifyContent:'flex-start',
                            alignItems:'flex-start',
                            marginTop:SIZES.padding
                        }}
                        labelStyle={{
                            fontSize:17
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="ĐÃ NHẬN HÀNG"
                        isSelected={
                          values.hawbStatusValue === 'ĐÃ NHẬN HÀNG' ? true : false
                        }
                        onPress={() => {
                          setFieldValue('hawbStatusValue', 'ĐÃ NHẬN HÀNG');
                        }}
                      />
                      </View>
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
                      label="Cancel"
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
                    <TextButton
                      label="Save"
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
export default UpdateHawbStatusModal;
