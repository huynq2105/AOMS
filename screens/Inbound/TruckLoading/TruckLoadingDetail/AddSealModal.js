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
import * as Yup from 'yup';
import TextButton from '../../../../components/TextButton';

const validations = {
  vhclSealNumber : Yup.string().required('Required.'),
  qlaNumber : Yup.string().required('Required.'),
};
const AddSealModal = ({modalVisible, applyFunc, handleOffModal,truck,totalAwb}) => {
  const [visible, setVisible] = useState(modalVisible);
  const sealRef =  React.useRef();
  const olaRef =  React.useRef();
  const onSubmit = values => {
    applyFunc(values.vhclSealNumber,values.qlaNumber)
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
              height: 500,
            }}>
                <View
                    style={{
                        flexDirection:'row'
                    }}
                >
                    <Text>Truck Number: {truck.vehicRegNo}</Text>
                </View>
                <Text>Total Awb: {totalAwb}</Text>
            <Formik
            validateOnMount={true}
            enableReinitialize
              validationSchema={Yup.object().shape(validations)}
              initialValues={{
                vhclSealNumber: '',
                qlaNumber:''
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
                      <View>
                        <Text
                          h3
                          primaryALS
                          style={
                            {
                              //marginTop: 60,
                            }
                          }>
                          Seal Number:
                        </Text>
                        <TextInput
                          style={{
                            //flex:1,
                            // borderWidth: 1,
                            height: 45,
                            marginBottom: SIZES.base,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.gray,
                          }}
                          ref={sealRef}
                          placeholder="Seal Number"
                          value={values.vhclSealNumber}
                          onChangeText={handleChange('vhclSealNumber')}
                        />
                        
                      </View>
                      <View>
                        <Text
                          h3
                          primaryALS
                          style={
                            {
                              //marginTop: 60,
                            }
                          }>
                          OLA Number:
                        </Text>
                        <TextInput
                          style={{
                            //flex:1,
                            // borderWidth: 1,
                            height: 45,
                            marginBottom: SIZES.base,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.gray,
                          }}
                          ref={olaRef}
                          placeholder="Ola Number"
                          value={values.qlaNumber}
                          onChangeText={handleChange('qlaNumber')}
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
                        backgroundColor:isValid? COLORS.primaryALS : COLORS.gray
                      }}
                      disabled={!isValid}
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
export default AddSealModal;
