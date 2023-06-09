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
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import * as Yup from 'yup';
import moment from 'moment';
import CheckComponent from '../../../../components/Checkbox';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import {
  getPoDoByVehicle,
  getSumPoDoVehicleDetail,
  getListPoDo,
  AddPoDoToTruck,
  createPo,
  closeTruck
} from '../../../../api/OutboundAPI';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import {FlatList} from 'react-native-gesture-handler';
import {interpolate} from 'react-native-reanimated';

const validations = {
  // vehicleRegNo: Yup.string().required('Required.'),
  pieces : Yup.number().required('Required.'),
};
const EditPoModal = ({modalVisible, applyFunc, handleOffModal,pieces}) => {
  const [visible, setVisible] = useState(modalVisible);
  const onSubmit = values => {
    applyFunc(values.pieces)
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
              height: 200,
            }}>
            <Formik
              validationSchema={Yup.object().shape({
                ...validations,
                //password: passwordValidation,
              })}
              initialValues={{
                pieces: pieces +'',
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
                          Pieces:
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
                          keyboardType='number-pad'
                          placeholder="Pieces"
                          value={values.pieces+''}
                          onChangeText={handleChange('pieces')}
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
export default EditPoModal;
