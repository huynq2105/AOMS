import React, {useState, useEffect, useRef} from 'react';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import Modal from 'react-native-modal';
import {Formik} from 'formik';
import FormInputMik from '../../../../components/FormInputMik';
import * as Yup from 'yup';
import {Picker} from '@react-native-picker/picker';
import TextRadioButton from '../../../../components/TextRadioButton';
import {createVehicle, createDriver} from '../../../../api/OutboundAPI';
import {TextInput} from 'react-native-gesture-handler';
import TextButton from '../../../../components/TextButton';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
const selectKey = {
  init: 0,
  arrive: 1,
  unload: 2,
  complete: 3,
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height * 0.5
    : Dimensions.get('window').height * 0.5;
// const initialValues = {
//     vehicle: '',
// }
const validations = {
  // vehicleRegNo: Yup.string().required('Required.'),
  vehicleType: Yup.string().notOneOf(['--Choose--'], 'Phai set gia tri'),
};
const selectKeyLoad = {
  ton0: 0,
  tonHalf: 1,
  ton125: 2,
  ton19: 3,
  ton25: 4,
  ton35: 5,
  ton5: 6,
  ton8: 7,
  ton10: 8,
  ton15: 9,
};
const selectData = {
  assignee: [
    {id: selectKey.init, label: '--Choose--'},
    {id: selectKey.arrive, label: 'Arrive cargo terminal'},
    {id: selectKey.unload, label: 'Start unvehicleLoadWeight'},
    {id: selectKey.complete, label: 'Complete'},
  ],
  loadWeight: [
    {id: selectKeyLoad.ton0, label: '--Choose--', value: 0},
    {id: selectKeyLoad.tonHalf, label: '0.5 ton', value: 500},
    {id: selectKeyLoad.ton125, label: '1.25 ton', value: 1250},
    {id: selectKeyLoad.ton19, label: '1.9 ton', value: 1900},
    {id: selectKeyLoad.ton25, label: '2.5 tấn', value: 2500},
    {id: selectKeyLoad.ton35, label: '3.5 tấn', value: 3500},
    {id: selectKeyLoad.ton5, label: '5 tấn', value: 5000},
    {id: selectKeyLoad.ton8, label: '8 tấn', value: 8000},
    {id: selectKeyLoad.ton10, label: '10 tấn', value: 10000},
    {id: selectKeyLoad.ton15, label: '15 tấn', value: 15000},
  ],
};
let roleNames = [];
const AddVihicleModal = ({
  isVisible,
  applyFilterFunc,
  handleOffModal,
  startLoading,
  stopLoading,
}) => {
  const [vihicle, setVihicle] = useState({
    id: 0,
    vehicleRegNo: '',
  });
  const [driver, setDriver] = useState({
    firstName: '',
    phoneNumber: '',
  });
  //const [vehicleTypeOnwer,setvehicleTypeOnwer] = useState(0)
  const submitHandle = data => {
    //startvehicleLoadWeight({key: 'saveUser'});
    console.log('signupHandle', data.userName);
    const {userName, email, password} = data;

    const body = {
      userName,
      emailAddress: email,
      password,
      appName: 'Mobile',
      returnUrl: 'string',
      returnUrlHash: 'string',
      captchaResponse: 'string',
    };
    startLoading;
    console.log('Body', body);
    createVehicle(body)
      .then(({data}) => {
        console.log(data);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => stopLoading({key: 'saveUser'}));
  };
  const newVehicle = {};
  const [status, setStatus] = useState(selectKey.init);
  const [statusvehicleLoadWeight, setStatusvehicleLoadWeight] = useState(
    selectKeyLoad.ton0,
  );
  const [showModal, setShowModal] = useState(isVisible);
  const vehicleRegNoRef = useRef();
  const driverFn = useRef();
  const driverLn = useRef();
  const phoneNo = useRef();
  const handleSubmit = () => {
    //setShowModal(!isVisible);
    const a = vihicle.id + 1;
    setVihicle({...vihicle, id: a, vehicleRegNo: '30H-12345'});
    applyFilterFunc(vihicle);
  };
  const onSubmit = values => {
    const newVehicle = {
      vehicleRegNo: values.vehicleRegNo,
      vehicleLoadWeight: parseInt(values.vehicleLoadWeight),
      numberOfDoors: parseInt(values.numberOfDoors),
      vehicleType: values.vehicleType,
      vehicleTypeOnwer: values.vehicleTypeOnwer
    };
    console.log(
      'OnSubmit===============================================',
      newVehicle,
    );
    startLoading({key: 'addVehicle'});
    createVehicle(newVehicle)
      .then(data => {
        console.log('data==============================', data);
        const newDriver = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          vehicleId: data.id,
          title:'Mobile'
        }
        createDriver(newDriver).then(() => {
          const resultVehicle = {...newVehicle,id:data.id}
           
          applyFilterFunc(resultVehicle,newDriver);
          setShowModal(!isVisible);
        });
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => stopLoading({key: 'addVehicle'}));

    //  submitHandle({...newVehicle, ...values});
  };
  useEffect(() => {
    setShowModal(isVisible);
  }, [isVisible]);
  console.log('SHow modal', isVisible);
  return (
    <Modal
      //deviceWidth='120'
      // deviceHeight={Dimensions.get('window').width * 0.8}
      isVisible={showModal}
      backdropOpacity={1}
      onBackdropPress={() => {
        handleOffModal();
      }}
      onBackButtonPress={() => {
        handleOffModal();
      }}
      style={{
        backgroundColor: COLORS.white,
        padding: SIZES.base,
        margin: SIZES.padding,
        //width: Dimensions.get('window').width * 0.8,
        //height: Dimensions.get('window').width
        // height:60
      }}
      backdropColor={'rgba(100,100,100,0.5)'}>
      <View>
        <Text>Add Vihicle</Text>
        <Formik
          validationSchema={Yup.object().shape({
            ...validations,
            //password: passwordValidation,
          })}
          initialValues={{
            // lockoutEnabled: false,
            // twoFactorEnabled: false,
            vehicleRegNo: '',
            vehicleType: '--Choose--',
            vehicleLoadWeight: '--Choose--',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            //driverFn:'',
            numberOfDoors: '',
            // driverLn:'',
            // phoneNo:'',
            vehicleTypeOnwer: 'Xe công ty',
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
                  <Text
                    h3
                    primaryALS
                    style={
                      {
                        //marginTop: 60,
                      }
                    }>
                    Biển số xe:
                  </Text>
                  <TextInput
                    style={{
                      //flex:1,
                      // borderWidth: 1,
                      height: 45,
                      // padding:2,
                      //marginTop: SIZES.base,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.gray,
                    }}
                    value={values.vehicleRegNo}
                    onChangeText={handleChange('vehicleRegNo')}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      //backgroundColor:COLORS.lightGreen
                    }}>
                    <View
                      style={{
                        width: '45%',
                        marginRight: SIZES.padding,
                      }}>
                      <Text>
                        Vehicle Type*
                        <Text>
                          {errors.vehicleType ? errors.vehicleType : ''}
                        </Text>
                      </Text>
                      <Picker
                        mode="dropdown"
                        selectedValue={values.vehicleType}
                        onValueChange={(itemValue, itemIndex) =>
                          setFieldValue('vehicleType', itemValue)
                        }>
                        <Picker.Item
                          label="--Choose--"
                          value={values.vehicleType}
                          key={0}
                        />
                        <Picker.Item
                          label="Xe thường"
                          value={'Xe thường'}
                          key={1}
                        />
                        <Picker.Item
                          label="Xe lạnh"
                          value={'Xe lạnh'}
                          key={2}
                        />
                      </Picker>
                    </View>
                    <View
                      style={{
                        width: '45%',
                      }}>
                      <Text>Load weight</Text>
                      <Picker
                        mode="dropdown"
                        selectedValue={values.vehicleLoadWeight}
                        onValueChange={(itemValue, itemIndex) =>
                          setFieldValue('vehicleLoadWeight', itemValue)
                        }>
                        {selectData.loadWeight.map(it => (
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
                    <Text>No door</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        style={{
                          flex: 1,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.gray,
                        }}
                        value={values.numberOfDoors}
                        onChangeText={handleChange('numberOfDoors')}
                        keyboardType="number-pad"
                      />
                      <TextRadioButton
                        customContainerStyle={{
                          flex: 1,
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="Xe công ty"
                        isSelected={
                          values.vehicleTypeOnwer === 'Xe công ty'
                            ? true
                            : false
                        }
                        onPress={() => {
                          setFieldValue('vehicleTypeOnwer', 'Xe công ty');
                        }}
                      />
                      <TextRadioButton
                        customContainerStyle={{
                          flex: 1,
                        }}
                        iconStyle={{
                          tintColor: COLORS.primaryALS,
                        }}
                        label="Xe thuê"
                        isSelected={
                          values.vehicleTypeOnwer === 'Xe thuê' ? true : false
                        }
                        onPress={() => {
                          setFieldValue('vehicleTypeOnwer', 'Xe thuê');
                        }}
                      />
                    </View>
                    <Text
                      h3
                      primaryALS
                      style={
                        {
                          //marginTop: 60,
                        }
                      }>
                      Lái xe:
                    </Text>
                    <TextInput
                      style={{
                        //flex:1,
                        // borderWidth: 1,
                        height: 45,
                        // padding:2,
                        //marginTop: SIZES.base,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.gray,
                      }}
                      placeholder="First Name"
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                    />
                    <TextInput
                      style={{
                        //flex:1,
                        // borderWidth: 1,
                        height: 45,
                        // padding:2,
                        //marginTop: SIZES.base,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.gray,
                      }}
                      placeholder="Last Name"
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                    />
                    <Text
                      h3
                      primaryALS
                      style={
                        {
                          //marginTop: 60,
                        }
                      }>
                      SĐT:
                    </Text>
                    <TextInput
                      style={{
                        //flex:1,
                        // borderWidth: 1,
                        height: 45,
                        // padding:2,
                        //marginTop: SIZES.base,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.gray,
                      }}
                      placeholder="Số điện thoại"
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                    />
                    {/*   <KeyboardAvoidingView behavior="padding"> */}
                    {/*  <FormInputMik
                      label="Driver First Name"
                      style={{
                        backgroundColor: 'green',
                      }}
                      containerStyle={{}}
                      inputRef={vehicleRegNoRef}
                     // onSubmitEditing={() => emailRef.current.focus()}
                      returnKeyType="next"
                      onChangeText={handleChange('driverFn')}
                      onBlur={handleBlur('driverFn')}
                      inputValue={values.driverFn}
                      autoCapitalize="none"
                      errMsg={errors.driverFn}
                    />
                
                            <FormInputMik
                      label="Driver First Name"
                      style={{
                        backgroundColor: 'green',
                      }}
                      inputRef={vehicleRegNoRef}
                     // onSubmitEditing={() => emailRef.current.focus()}
                      returnKeyType="next"
                      onChangeText={handleChange('driverLn')}
                      onBlur={handleBlur('driverLn')}
                      inputValue={values.driverLn}
                      autoCapitalize="none"
                      errMsg={errors.driverLn}
                    />
                        <FormInputMik
                      label="Phone number"
                      style={{
                        backgroundColor: 'green',
                      }}
                      inputRef={vehicleRegNoRef}
                     // onSubmitEditing={() => emailRef.current.focus()}
                      returnKeyType="next"
                      onChangeText={handleChange('phoneNo')}
                      onBlur={handleBlur('phoneNo')}
                      inputValue={values.phoneNo}
                      autoCapitalize="none"
                      errMsg={errors.phoneNo}
                    /> */}
                    {/* </KeyboardAvoidingView> */}
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
            </>
          )}
        </Formik>

        {/*    <Picker
                    
                    ></Picker> */}
        {/*    <TouchableOpacity onPress={handleSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    padding: SIZES.base,
  },
});
//export default AddVihicleModal;
export default connectToRedux({
  component: AddVihicleModal,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
